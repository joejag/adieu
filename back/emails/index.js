const { google } = require('googleapis')
const { DynamoDB } = require('aws-sdk')

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
        .then(() => result)
    })
    .catch((error) => {
      console.error(`problem with ${id}`, error)
    })
}

const gmailToAdieuMail = (id, data, format) => {
  const threadId = data.threadId
  const snippet = data.snippet
  const labelIds = data.labelIds
  const gmailDate = data.internalDate

  const headers = data.payload.headers
  const date = headers.filter((h) => h['name'] === 'Date')[0].value
  const to = headers.filter((h) => h['name'] === 'To')[0].value
  const from = headers.filter((h) => h['name'] === 'From')[0].value
  const subject = headers.filter((h) => h['name'] === 'Subject')[0].value
  const unread = data.labelIds.includes('UNREAD')

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

  // attempt to find the email from many parts
  let emailBody = ''
  let mimeType = ''

  if (format === 'full') {
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
    mimeType,
    emailBody,
  }
}
exports.gmailToAdieuMail = gmailToAdieuMail

// 'multipart/mixed' emails are deeply nested, gotta search them all
const findContentType = (currentParts, contentType) => {
  if (currentParts === undefined) return undefined

  const htmlElement = currentParts.find((p) => p['mimeType'] === contentType)
  if (htmlElement) {
    return htmlElement
  }

  const subpartWithParts = currentParts.filter((p) => p.parts !== undefined)
  for (const subpart of subpartWithParts) {
    const possible = findContentType(subpart.parts, contentType)
    if (possible !== undefined) {
      return possible
    }
  }
}

const fetchEmails = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const emailIds = await gmail.users.messages.list({
      auth,
      userId: 'me',
      maxResults: 30,
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
