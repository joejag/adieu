# Adieu

# Running locally

You will need a Google API app registered first

1. Head over to https://console.cloud.google.com/apis/credentials
2. Create a New Project called 'Adieu'
3. Enable the Gmail API inside the "Library".
4. Create new Credentials. Create credentials > OAuth client ID. Ignore the scopes.  Choose Web application application type.
5. Set the callback URLs to be http://localhost:3000/api/callback
6. On the Consent screen, add your email address to the "Trusted Users" section
7. Once you have the Client id and secret, make sure they work at https://developers.google.com/oauthplayground/

You have to run three things locally:

- React
- Lambda
- DynamoDB

I usually run these in three different terminals.

To run React:

```
cd front && npm install && npm start
```

To run DynamoDB (this stores the Gmail OAuth tokens):

```
docker run -p 8000:8000 amazon/dynamodb-local  -jar DynamoDBLocal.jar -sharedDb

```

Then create the Sessions tables in Dynamo using:

```
 aws dynamodb create-table \
        --table-name sessions \
        --attribute-definitions AttributeName=sessionId,AttributeType=S \
        --key-schema AttributeName=sessionId,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --endpoint-url http://localhost:8000
```

Finally, set your Google CLIENT_ID and CLIENT_SECRET. There are 2 ways to do this...

* Change the script
* or make new parameters is SSM parameter store named `/adieu/client-id` and `/adieu/client-secret`

Now you can run the Lambda (via Express) with:

```
cd back/local && npm install 
cd .. && npm install 
cd ..
./run.sh
```

Use the app by going to http://localhost:3000


# Top things

- load embedded images (1795ab0217072bf4)
- Attachments
- Keyboard shortcuts: up, down, open/close
- unsub (1795ab0217072bf4)

# Nice things

- Add icons for common services (github, linkedin, google etc)
- Block spy trackers using ublock origin lists
- Search functionality (messages)
- Search functionality (contacts)
- Handle ics - which is a mime part, see email from Dan Webb
- Add pastebin
- Create fancy cards for trips
- spruce up emails, if style is missing add it (like Kent Dodds pre section)

# Probably never

- use WebSockets to look for new mail
- Tell google to ping when there is a new message
- send emails
- Snoozing emails
- Mark things as 'done'

# Docs

- Original CDK info: https://dev.to/evnz/single-cloudfront-distribution-for-s3-web-app-and-api-gateway-15c3
- https://github.com/googleapis/google-api-nodejs-client#oauth2-client
- https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list
- https://material-ui.com/components/accordion/
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html
- Content-id spec: https://datatracker.ietf.org/doc/html/rfc2392

Inbox:

- https://cdn3.vox-cdn.com/assets/4435703/Screen3.png
- Video: https://www.youtube.com/watch?v=aH9EXJMevzo

## Secrets for SSM

Create an API account at https://console.cloud.google.com/apis/credentials. Store the creds in AWS Systems Manager.

```bash
aws ssm put-parameter --cli-input-json '{
  "Name": "/adieu/client-id",
  "Value": "SOME ID",
  "Type": "String"
}'

aws ssm put-parameter --cli-input-json '{
  "Name": "/adieu/client-secret",
  "Value": "SOME SECRET",
  "Type": "String"
}'

aws ssm put-parameter --cli-input-json '{
  "Name": "/adieu/client-redirect-url",
  "Value": "https://adieu.joejag.com/api/callback",
  "Type": "String"
}'

aws ssm put-parameter --cli-input-json '{
  "Name": "/adieu/url",
  "Value": "https://adieu.joejag.com",
  "Type": "String"
}'
```

# Interesting emails

- 17926f1e1459b897 (multipart/mixed) with PDF
- 17947ef1f5f89b69 body missing
- 1793b9c747dac319 body missing
- 1793d9aa4d62a079 not being shown properly
- 1795bc65ceba377a body being truncated
