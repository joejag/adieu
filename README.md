# Top things

- recursive body finder
- minify the lambda code
- Attachments
- cache retrieved emails in a global context object

# If we do Inbox style

- Keyboard shortcuts: up, down, open/close (done, undo)
- Mark things as 'done'

# Nice things - small effort

- Take all letters of the name to create Avatar up to three
- Add icons for common services (github, linkedin, google etc)
- Add mini-avatars for other folks involved in the email chain

# Nice things - big effort

- Block spy trackers using ublock origin lists
- Search functionality (messages)
- Search functionality (contacts)
- Handle ics - which is a mime part, see email from Dan Webb
- Add pastebin
- Create fancy cards for trips
- spruce up emails, if style is missing add it (like Kent Dodds pre section)
- Sleeping things

# Probably never

- use WebSockets to look for new mail
- Tell google to ping when there is a new message
- send emails

# Docs

- Original CDK info: https://dev.to/evnz/single-cloudfront-distribution-for-s3-web-app-and-api-gateway-15c3
- https://github.com/googleapis/google-api-nodejs-client#oauth2-client
- https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list
- https://material-ui.com/components/accordion/
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html

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
