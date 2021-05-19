const { google } = require('googleapis')
const { DynamoDB, S3 } = require('aws-sdk')
const { S3RequestPresigner } = require('@aws-sdk/s3-request-presigner')
const { HttpRequest } = require('@aws-sdk/protocol-http')
const { Hash } = require('@aws-sdk/hash-node')

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
}

exports.emailsHandler = async (event) => {
  console.log('request:', JSON.stringify(event, undefined, 2))

  try {
    const oauth2Client = await authWithGoogle(event.cookies)
    const emails = await fetchEmails(oauth2Client)

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(emails),
    }
  } catch (err) {
    if (err.message === 'feed me new creds') {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
      }
    }

    console.error('unexpected error', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
    }
  }
}

exports.emailHandler = async (event) => {
  console.log('request:', JSON.stringify(event, undefined, 2))

  if (
    event.pathParameters == undefined ||
    event.pathParameters.emailId === undefined
  ) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reason: 'No email id supplied' }),
    }
  }

  try {
    const oauth2Client = await authWithGoogle(event.cookies)
    const email = await fetchEmail(
      oauth2Client,
      event.pathParameters.emailId,
      'full'
    )

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(email),
    }
  } catch (err) {
    if (err.message === 'feed me new creds') {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
      }
    }

    console.error('unexpected error', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
    }
  }
}

exports.attachmentViewHandler = async (event) => {
  console.log('request:', JSON.stringify(event, undefined, 2))

  if (
    event.pathParameters == undefined ||
    event.pathParameters.emailId === undefined ||
    event.pathParameters.attachmentId === undefined
  ) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reason: 'No emailId/attachmentId supplied' }),
    }
  }

  try {
    const { attachment, data } = await fetchAttachment(event)

    const s3 = new S3()
    const params = {
      Bucket: process.env.ATTACHMENTS_BUCKET_NAME,
      Key: attachment.filename,
      Body: Buffer.from(data, 'base64'),
    }
    await s3.upload(params).promise()
    const url = s3.getSignedUrl('getObject', {
      Bucket: process.env.ATTACHMENTS_BUCKET_NAME,
      Key: attachment.filename,
      Expires: 60 * 30,
      ResponseContentType: attachment.mimeType,
    })

    return {
      statusCode: 302,
      headers: {
        ...CORS_HEADERS,
        Location: url,
      },
    }
  } catch (err) {
    if (err.message === 'feed me new creds') {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
      }
    }

    console.error('unexpected error', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
    }
  }
}

const fetchAttachment = async (event) => {
  const oauth2Client = await authWithGoogle(event.cookies)
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

  const email = await fetchEmail(
    oauth2Client,
    event.pathParameters.emailId,
    'full'
  )
  const attachment = email.attachments.find(
    (a) => a.id === event.pathParameters.attachmentId
  )

  const data = await gmail.users.messages.attachments.get({
    auth: oauth2Client,
    userId: 'me',
    messageId: event.pathParameters.emailId,
    id: attachment.unstableId,
  })

  return { data: data.data.data, attachment: attachment }
}

const authWithGoogle = async (cookies) => {
  if (cookies === undefined) {
    throw new Error('feed me new creds')
  }

  const sessionId = cookies[0].substring(4)

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.CLIENT_REDIRECT
  )

  const docClient = new DynamoDB.DocumentClient()
  const data = await docClient
    .get({
      TableName: process.env.SESSIONS_TABLE_NAME,
      Key: {
        sessionId,
      },
    })
    .promise()

  if (data.Item === undefined) {
    throw new Error('feed me new creds')
  }

  oauth2Client.setCredentials(data.Item.authToken)

  return oauth2Client
}

const fetchEmail = (auth, id, format) => {
  const gmail = google.gmail({ version: 'v1', auth })

  return gmail.users.messages
    .get({
      auth,
      userId: 'me',
      id,
      format,
    })
    .then((res) => gmailToAdieuMail(id, res.data, format))
    .then((result) => {
      if (format !== 'full' || !result.labelIds.includes('UNREAD')) {
        return result
      }

      // Mark email as read
      return gmail.users.messages
        .modify({
          userId: 'me',
          id: result.id,
          resource: {
            addLabelIds: [],
            removeLabelIds: ['UNREAD'],
          },
        })
        .then(() => {
          return { ...result, unread: false }
        })
    })
    .catch((error) => {
      console.error(`problem with ${id}`, error)
    })
}

const gmailToAdieuMail = (id, data, format) => {
  const threadId = data.threadId
  const snippet = data.snippet
  const gmailDate = data.internalDate
  const labelIds = data.labelIds || []
  const unread = data.labelIds.includes('UNREAD')
  const headers = data.payload.headers
  const to = headers.find(({ name }) => name === 'To').value
  const from = headers.find(({ name }) => name === 'From').value
  const subject = headers.find(({ name }) => name === 'Subject').value
  const date = headers.find(({ name }) => name === 'Date').value

  const attachments = findAttachments(data.payload.parts)

  // try and make a human readable version of the sender
  let fromName = from
    .substring(0, from.indexOf('<'))
    .replace('"', '')
    .replace('"', '')
    .trim()
  if (from.trim().indexOf('<') === 0) {
    fromName = from.trim().substring(1, from.trim().length - 1)
  }
  if (fromName.trim().length === 0) {
    fromName = from
  }

  let emailBody = ''
  let mimeType = ''
  if (format === 'full') {
    // Find html or plain version in all the parts
    const matchingHtmlPart = findContentType(data.payload.parts, 'text/html')
    const matchingPlainPart = findContentType(data.payload.parts, 'text/plain')
    if (matchingHtmlPart !== undefined) {
      emailBody = matchingHtmlPart.body.data
      mimeType = 'text/html'
    } else if (matchingPlainPart !== undefined) {
      emailBody = matchingPlainPart.body.data
      mimeType = 'text/plain'
    } else {
      emailBody = data.payload.body.data
      mimeType = data.payload.mimeType
    }
  }

  // if (id === '179564361da33a97') {
  //   console.log(data.payload)
  // }

  return {
    id,
    threadId,
    date,
    gmailDate,
    unread,
    to,
    from,
    fromName,
    subject,
    labelIds,
    snippet,
    attachments,
    mimeType,
    emailBody,
  }
}
exports.gmailToAdieuMail = gmailToAdieuMail

const findContentType = (currentParts, contentType) => {
  return walkParts(currentParts, (p) => p['mimeType'] === contentType)[0]
}

const findAttachments = (currentParts) => {
  const parts = walkParts(currentParts, (p) =>
    p.headers.some(
      ({ name, value }) =>
        name === 'Content-Disposition' && value.startsWith('attachment;')
    )
  )
  return parts.map((p) => {
    return {
      filename: p.filename,
      id: p.partId,
      unstableId: p.body.attachmentId,
      mimeType: p.mimeType,
    }
  })
}

const walkParts = (part, predicate, matches = []) => {
  if (part === undefined) return []

  const matchingElement = part.find(predicate)
  if (matchingElement) {
    matches.push(matchingElement)
  }

  const subpartWithParts = part.filter((p) => p.parts)
  for (const subpart of subpartWithParts) {
    const matchingElements = walkParts(subpart.parts, predicate)
    matches = [...matches, ...matchingElements]
  }

  return matches
}

const fetchEmails = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const emailIds = await gmail.users.messages.list({
      auth,
      userId: 'me',
      maxResults: 50,
      q: 'NOT label:SENT',
    })

    return await Promise.all(
      emailIds.data.messages.map((msg) => {
        return fetchEmail(auth, msg.id, 'metadata')
      })
    )
  } catch (err) {
    if (err.message === 'No refresh token is set.') {
      throw new Error('feed me new creds')
    }
    throw err
  }
}
