var AWS = require('aws-sdk')
AWS.config.update({
  region: 'local',
  // endpoint: 'http://localhost:8000', // for Dynamo
  endpoint: 'http://localhost:4566',
  s3ForcePathStyle: true,
})
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const emailH = require('../../back/emails/index')
const loginH = require('../../back/login/index')

const app = express()
const port = 3000

// Forward to Lambda
const lambdas = {
  '/api/login': loginH.loginHandler,
  '/api/callback': loginH.callbackHandler,
  '/api/emails': emailH.emailsHandler,
  '/api/email/:emailId': emailH.emailHandler,
  '/api/email/:emailId/attachment/:attachmentId': emailH.attachmentViewHandler,
}
for (const [route, handler] of Object.entries(lambdas)) {
  app.get(route, (req, res) => {
    const event = {
      queryStringParameters: req.query,
      cookies: req.headers.cookie ? [req.headers.cookie] : undefined,
      pathParameters: req.params,
    }

    handler(event)
      .then((res2) => {
        for (const [key, value] of Object.entries(res2.headers)) {
          res.set(key, value)
        }

        let body = res2.body

        if (res2.isBase64Encoded) {
          body = Buffer.from(body, 'base64')
        }

        res.status(res2.statusCode).send(body)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send(err.message)
      })
  })
}

// Forward to React
app.use(
  '/*',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      [`^/`]: '',
    },
  })
)

app.listen(port, () => {
  console.log(`Running on ${port}`)
})
