const { google } = require('googleapis')
const { DynamoDB } = require('aws-sdk')

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CLIENT_REDIRECT
)

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
}

exports.handler = async (event) => {
  console.log('request:', JSON.stringify(event, undefined, 2))

  if (event.cookies === undefined) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
    }
  }

  try {
    const sessionId = event.cookies[0].substring(4)
    const details = await go(sessionId)

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(details),
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

const go = async (sessionId) => {
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

  return fetchEmails(oauth2Client)
}

const fetchEmails = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth })

  // TODO: Catch auth failure and return 401
  try {
    const res = await gmail.users.messages.list({
      auth,
      userId: 'me',
      maxResults: 100,
      q: 'after:2021/4/20',
    })

    const proms = res.data.messages.map((msg) => {
      return getMessage(auth, msg.id)
    })

    return Promise.all(proms).then((values) => values)
  } catch (err) {
    if (err.message === 'No refresh token is set.') {
      throw new Error('feed me new creds')
    }
    throw err
  }
}

const getMessage = (auth, id) => {
  const gmail = google.gmail({ version: 'v1', auth })

  return gmail.users.messages
    .get({
      auth,
      userId: 'me',
      id,
      format: 'full',
      // format: 'metadata',
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

      console.log(labelIds)

      // attempt to find the email from many parts
      let emailBody = ''
      let mimeType = ''

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
          if (id === '1793b9c747dac319') {
            console.log(res.data.payload.parts[0].parts)
          }

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

      return {
        id,
        threadId,
        date,
        gmailDate,
        to,
        from,
        subject,
        labelIds,
        snippet,
        mimeType,
        emailBody,
      }
    })
    .catch((error) => {
      console.error(`problem with ${id}`, error)
    })
}
