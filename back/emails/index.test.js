const { gmailToAdieuMail } = require('./index')

const MULTIPART_HTML_EMAIL = {
  id: '1',
  threadId: '1',
  labelIds: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
  snippet:
    'Hello , I urgently need someone for the below position, our client is amending/creating new content in line with the new apprenticeship standards that have been introduced for a Data Analyst/',
  payload: {
    partId: '',
    mimeType: 'multipart/mixed',
    filename: '',
    headers: [
      {
        name: 'From',
        value: 'Lee Richards <LRichards@educationstaffbank.com>',
      },
      { name: 'To', value: '"joe@joejag.com" <joe@joejag.com>' },
      {
        name: 'Subject',
        value: 'Content Author - Data Analyst/Software Developer',
      },
      { name: 'Date', value: 'Fri, 7 May 2021 17:45:19 +0000' },
      {
        name: 'Content-Type',
        value:
          'multipart/mixed; boundary="_005_CWXP123MB287125368A569523B2B8BD08C7579CWXP123MB2871GBRP_"',
      },
    ],
    body: { size: 0 },
    parts: [
      {
        partId: '0',
        mimeType: 'multipart/related',
        filename: '',
        headers: [
          {
            name: 'Content-Type',
            value:
              'multipart/related; boundary="MCBoundary=_12105071845220781"',
          },
        ],
        body: { size: 0 },
        parts: [
          {
            partId: '0.0',
            mimeType: 'multipart/alternative',
            filename: '',
            headers: [
              {
                name: 'Content-Type',
                value:
                  'multipart/alternative; boundary="_000_CWXP123MB287125368A569523B2B8BD08C7579CWXP123MB2871GBRP_"',
              },
            ],
            body: { size: 0 },
            parts: [
              {
                partId: '0.0.0',
                mimeType: 'text/plain',
                filename: '',
                headers: [
                  { name: 'Content-Type', value: 'text/plain; charset=UTF-8' },
                ],
                body: {
                  size: 2944,
                  data: 'Plain Email',
                },
              },
              {
                partId: '0.0.1',
                mimeType: 'text/html',
                filename: '',
                headers: [
                  { name: 'Content-Type', value: 'text/html; charset=UTF-8' },
                ],
                body: {
                  size: 8287,
                  data: 'HTML Email',
                },
              },
            ],
          },
        ],
      },
      {
        partId: '1',
        mimeType: 'application/pdf',
        filename: 'Education StaffBank Applicant Terms 2019 v1.0.pdf',
        headers: [],
        body: {
          attachmentId: 'anid',
          size: 297692,
        },
      },
      {
        partId: '2',
        mimeType: 'application/pdf',
        filename: 'Education StaffBank Applicant Terms1.pdf',
        headers: [],
        body: {
          attachmentId: 'anotherId',
          size: 359211,
        },
      },
    ],
  },
  sizeEstimate: 939581,
  historyId: '8054155',
  internalDate: '1620409519000',
}

// exactly the same as above, but without the html part
const MULTIPART_PLAIN_EMAIL = {
  id: '1',
  threadId: '1',
  labelIds: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
  snippet:
    'Hello , I urgently need someone for the below position, our client is amending/creating new content in line with the new apprenticeship standards that have been introduced for a Data Analyst/',
  payload: {
    partId: '',
    mimeType: 'multipart/mixed',
    filename: '',
    headers: [
      {
        name: 'From',
        value: 'Lee Richards <LRichards@educationstaffbank.com>',
      },
      { name: 'To', value: '"joe@joejag.com" <joe@joejag.com>' },
      {
        name: 'Subject',
        value: 'Content Author - Data Analyst/Software Developer',
      },
      { name: 'Date', value: 'Fri, 7 May 2021 17:45:19 +0000' },
      {
        name: 'Content-Type',
        value:
          'multipart/mixed; boundary="_005_CWXP123MB287125368A569523B2B8BD08C7579CWXP123MB2871GBRP_"',
      },
    ],
    body: { size: 0 },
    parts: [
      {
        partId: '0',
        mimeType: 'multipart/related',
        filename: '',
        headers: [
          {
            name: 'Content-Type',
            value:
              'multipart/related; boundary="MCBoundary=_12105071845220781"',
          },
        ],
        body: { size: 0 },
        parts: [
          {
            partId: '0.0',
            mimeType: 'multipart/alternative',
            filename: '',
            headers: [
              {
                name: 'Content-Type',
                value:
                  'multipart/alternative; boundary="_000_CWXP123MB287125368A569523B2B8BD08C7579CWXP123MB2871GBRP_"',
              },
            ],
            body: { size: 0 },
            parts: [
              {
                partId: '0.0.0',
                mimeType: 'text/plain',
                filename: '',
                headers: [
                  { name: 'Content-Type', value: 'text/plain; charset=UTF-8' },
                ],
                body: {
                  size: 2944,
                  data: 'Plain Email',
                },
              },
            ],
          },
        ],
      },
      {
        partId: '1',
        mimeType: 'application/pdf',
        filename: 'Education StaffBank Applicant Terms 2019 v1.0.pdf',
        headers: [],
        body: {
          attachmentId: 'anid',
          size: 297692,
        },
      },
      {
        partId: '2',
        mimeType: 'application/pdf',
        filename: 'Education StaffBank Applicant Terms1.pdf',
        headers: [],
        body: {
          attachmentId: 'anotherId',
          size: 359211,
        },
      },
    ],
  },
  sizeEstimate: 939581,
  historyId: '8054155',
  internalDate: '1620409519000',
}

test('map metadata', () => {
  expect(gmailToAdieuMail('1', MULTIPART_HTML_EMAIL, 'full')).toEqual(
    expect.objectContaining({
      id: '1',
      threadId: '1',
      date: 'Fri, 7 May 2021 17:45:19 +0000',
      gmailDate: '1620409519000',
      unread: false,
      to: '"joe@joejag.com" <joe@joejag.com>',
      from: 'Lee Richards <LRichards@educationstaffbank.com>',
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
