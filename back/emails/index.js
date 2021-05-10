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
    .then((res) => {
      const threadId = res.data.threadId
      const snippet = res.data.snippet
      const labelIds = res.data.labelIds
      const headers = res.data.payload.headers
      const gmailDate = res.data.internalDate
      const date = headers.filter((h) => h['name'] === 'Date')[0].value
      const to = headers.filter((h) => h['name'] === 'To')[0].value
      const from = headers.filter((h) => h['name'] === 'From')[0].value
      const subject = headers.filter((h) => h['name'] === 'Subject')[0].value
      const unread = res.data.labelIds.includes('UNREAD')

      // attempt to find the email from many parts
      let emailBody = ''
      let mimeType = ''

      if (format === 'full') {
        // If parts. Recurse until you find the text/html, then try text/plan
        if (res.data.payload.parts) {
          const htmlElement = res.data.payload.parts.find(
            (p) => p['mimeType'] === 'text/html'
          )
          const textElement = res.data.payload.parts.find(
            (p) => p['mimeType'] === 'text/plain'
          )
          if (htmlElement) {
            emailBody = htmlElement.body.data
            mimeType = 'text/html'
          } else if (textElement) {
            emailBody = textElement.body.data
            mimeType = 'text/plain'
          } else {
            // TODO: handle mult/alt thingy better
            const possible = res.data.payload.parts[0].parts.find(
              (p) => p['mimeType'] === 'text/html'
            )
            if (possible) {
              emailBody = possible.body.data
            }

            mimeType = 'text/html'
          }
        } else {
          emailBody = res.data.payload.body.data
          mimeType = res.data.payload.mimeType
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
        subject,
        labelIds,
        snippet,
        mimeType,
        emailBody,
      }
    })
    .then((result) => {
      if (format !== 'full' || !result.labelIds.includes('UNREAD')) {
        return result
      }

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

const fetchEmails = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    const emailIds = await gmail.users.messages.list({
      auth,
      userId: 'me',
      maxResults: 100,
      q: 'after:2021/4/20 NOT label:SENT',
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
