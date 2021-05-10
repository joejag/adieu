const { DynamoDB } = require('aws-sdk')
const { google } = require('googleapis')
const crypto = require('crypto')

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CLIENT_REDIRECT
)

exports.loginHandler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2))

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  })

  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
  }
}

exports.callbackHandler = async function (event) {
  console.log('request:', JSON.stringify(event, undefined, 2))

  const code = event.queryStringParameters.code
  const { tokens } = await oauth2Client.getToken(code)

  // generate cookie id, stripping out nasty chars
  const cookieId = crypto.randomBytes(64).toString('base64').replace(/\W/g, '')

  // save the auth tokens in Dynamo
  var docClient = new DynamoDB.DocumentClient()
  await docClient
    .put({
      TableName: process.env.SESSIONS_TABLE_NAME,
      Item: {
        sessionId: cookieId,
        authToken: tokens,
      },
    })
    .promise()

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': `key=${cookieId}; Secure; HttpOnly; SameSite`,
      Location: process.env.ADIEU_HOMEPAGE,
    },
  }
}
