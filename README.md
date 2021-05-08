# Top things

- Bundle view. Get emails on demand.
- Group by category, or show if personal
  - Today,Yesterday, This Month, March, Feb, Jan, 2020
  - finance:green
  - trips:purple
  - purchases:brown
- Keyboard shortcuts: up, down, open/close (done, undo)
- Show unread/read status
- Mark things as 'done'
- mobile view
- Show email threads together

# Nice things - small effot

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
- store OAuth redirect for all sessions rather than just the initial one

# Probably never

- use WebSockets to look for new mail
- Tell google to ping when there is a new message
- send emails

# Docs

https://github.com/googleapis/google-api-nodejs-client#oauth2-client
https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list
https://material-ui.com/components/accordion/
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html

Inbox:

- https://cdn3.vox-cdn.com/assets/4435703/Screen3.png

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
