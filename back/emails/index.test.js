const { gmailToAdieuMail } = require('./index')
const { EMAIL_WITH_IMAGES } = require('./example_emails/with_images')
const { EMAIL_WITH_ATTACHMENT } = require('./example_emails/with_attachment')
const {
  MULTIPART_HTML_EMAIL,
  MULTIPART_PLAIN_EMAIL,
} = require('./example_emails/multipart')

test('map metadata', () => {
  expect(gmailToAdieuMail('1', MULTIPART_HTML_EMAIL, 'full')).toEqual(
    expect.objectContaining({
      id: '1',
      threadId: '1',
      date: 'Fri, 7 May 2021 17:45:19 +0000',
      gmailDate: '1620409519000',
      unread: false,
      to: '"joe@joejag.com" <joe@joejag.com>',
      from: 'Lee Richards <LRichards@example.com>',
      subject: 'Content Author - Data Analyst/Software Developer',
      labelIds: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
      snippet:
        'Hello , I urgently need someone for the below position, our client is amending/creating new content in line with the new apprenticeship standards that have been introduced for a Data Analyst/',
    })
  )
})

test('map multipart html email', () => {
  expect(gmailToAdieuMail('1', MULTIPART_HTML_EMAIL, 'full')).toEqual(
    expect.objectContaining({
      mimeType: 'text/html',
      emailBody: 'HTML Email',
    })
  )
})

test('map multipart plain email', () => {
  expect(gmailToAdieuMail('1', MULTIPART_PLAIN_EMAIL, 'full')).toEqual(
    expect.objectContaining({
      mimeType: 'text/plain',
      emailBody: 'Plain Email',
    })
  )
})

const cases = [
  ['Lee Richards <LRichards@example.com>', 'Lee Richards'],
  ['"Lee Richards" <LRichards@example.com>', 'Lee Richards'],
  ['<LRichards@example.com>', 'LRichards@example.com'],
  ['LRichards@example.com', 'LRichards@example.com'],
]

describe('can extract a reasonable name for the sender', () => {
  test.each(cases)('%s => %s', (sender, expectedResult) => {
    const email = MULTIPART_PLAIN_EMAIL
    email.payload.headers = [
      { name: 'From', value: sender },
      ...email.payload.headers,
    ]

    expect(gmailToAdieuMail('1', email, 'metadata').fromName).toEqual(
      expectedResult
    )
  })
})

test('email with embedded images', () => {
  //  <img src="cid:60925519ee8a7_fbb170d411472d@production-web01.ord.dnsimple.net.mail" width="200px" height="140px" alt="Trusty in a gift!" />
  gmailToAdieuMail('1', EMAIL_WITH_IMAGES, 'full')
})

test('list attachments on a mail', () => {
  expect(
    gmailToAdieuMail('1', EMAIL_WITH_ATTACHMENT, 'full').attachments
  ).toEqual([
    {
      filename: 'dnsimple-1891215-936.pdf',
      mimeType: 'application/pdf',
      id: 'a_long_id',
    },
  ])
})
