exports.EMAIL_WITH_ATTACHMENT = {
  id: '1793b9c747dac319',
  threadId: '1793b9c747dac319',
  labelIds: ['CATEGORY_UPDATES', 'INBOX'],
  snippet: 'Invoice Number 1891215-936',
  payload: {
    partId: '',
    mimeType: 'multipart/mixed',
    filename: '',
    headers: [
      { name: 'Delivered-To', value: 'joe@joejag.com' },
      { name: 'From', value: 'DNSimple <support@example.com>' },
      { name: 'Date', value: 'Wed, 05 May 2021 08:19:38 +0000' },
      { name: 'Subject', value: 'DNSimple Invoice 1891215-936: Paid' },
      { name: 'To', value: 'joe@joejag.com' },
      { name: 'MIME-Version', value: '1.0' },
      {
        name: 'Content-Type',
        value: 'multipart/mixed; boundary=mk-f97f94d19e7a4955865d18660d95eb05',
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
            value: 'multipart/related; boundary="=-cLjKGS9ScufsXPwWROI4Vg=="',
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
                  'multipart/alternative; boundary=mk-f9cc337e92634b9b97b59882a330cada; charset=UTF-8',
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
                  {
                    name: 'Content-Transfer-Encoding',
                    value: 'quoted-printable',
                  },
                ],
                body: {
                  size: 1006,
                  data: 'PLAIN',
                },
              },
              {
                partId: '0.0.1',
                mimeType: 'text/html',
                filename: '',
                headers: [
                  { name: 'Content-Type', value: 'text/html; charset=UTF-8' },
                  {
                    name: 'Content-Transfer-Encoding',
                    value: 'quoted-printable',
                  },
                ],
                body: {
                  size: 6768,
                  data: 'HTML',
                },
              },
            ],
          },
          {
            partId: '0.1',
            mimeType: 'image/png',
            filename: 'logo.png',
            headers: [
              { name: 'Content-Type', value: 'image/png; name=logo.png' },
              { name: 'Content-Transfer-Encoding', value: 'base64' },
              {
                name: 'Content-Id',
                value:
                  '<60925519ed840_fbb170d411462@production-web01.ord.dnsimple.net.mail>',
              },
              {
                name: 'Content-Disposition',
                value: 'inline; filename=logo.png',
              },
            ],
            body: {
              attachmentId:
                'ANGjdJ8iokyr31dhRNuJ3HFJU-GIbtQS9Zvd3y-qDaXbgvqcBFTIEWN9eZMyJvnWq9yebVAeM5WQQPQFC5IBWU_N9LFnn0pLTFVU2b0vdnXudPnkYgc-wTfoiNWPWGEMk8g03r74RONekmmy-1TqHOksYhL2--x0iaQQ0Yex2NMoULpwDyyE7LB1n_beaG9QMdAUadSjnqKmddGPWoONlyZq64UTeeGInUO3MCjGP6sB12_GLIgbteDdXEdMa-ILbArwH0JKUd1EmvAS5QSc_TKhovSJvE-O4e6sOx_Y6fQA5jQt64gtdKJIPXkKMecbaQ-FIduHFSje9oapDfeVKgMXj07Wz8DbD_aLHPPbNCdVXLrKggY-z3zvGkKa28STKddebanKSVErDUSS4yXF',
              size: 2081,
            },
          },
          {
            partId: '0.2',
            mimeType: 'image/png',
            filename: 'referral_trusty.png',
            headers: [
              {
                name: 'Content-Type',
                value: 'image/png; name=referral_trusty.png',
              },
              { name: 'Content-Transfer-Encoding', value: 'base64' },
              {
                name: 'Content-Id',
                value:
                  '<60925519ee8a7_fbb170d411472d@production-web01.ord.dnsimple.net.mail>',
              },
              {
                name: 'Content-Disposition',
                value: 'inline; filename=referral_trusty.png',
              },
            ],
            body: {
              attachmentId:
                'ANGjdJ-A89H1PkOCyXkdD4vc8s5_zaHhYEOzkJyW-xvMuO423ORhZiVqPNs4qXxIGABlAe539pkzMnDtAyzf_7jfVIrZZWIpWQ3VS3r8ip-hXvscyw5oYYlx4TgTfS2tnEkEqHcG6nOlV-PF-w-2Vbk-Sctrrb739mDv9kT8lI2ItO_cfHIGCU1Rpg7DvDp7vwkDSeacS3L0AzzHKt1FT9EXscFV3EdsPjiU-tn1PvcEWgS3QBQP0uSNL9DXE_9V9xhqjJWd91bgk1bAwKvlMOF3eyAZZ1BJgnMRfxPofUib5xIFDaHiId_U2DuKge1MJmERHllo9VQc5ijWhIVBRywUfwS1Svw1xzcUa9q2-GEBWMUoPHMSgpoZaijeECqw_6ziL7KTYhLZHRh6qmkE',
              size: 16799,
            },
          },
        ],
      },
      {
        partId: '1',
        mimeType: 'application/pdf',
        filename: 'dnsimple-1891215-936.pdf',
        headers: [
          {
            name: 'Content-Type',
            value: 'application/pdf; name=dnsimple-1891215-936.pdf',
          },
          { name: 'Content-Transfer-Encoding', value: 'base64' },
          {
            name: 'Content-Id',
            value:
              '<60925519f054f_fbb170d41151f7@production-web01.ord.dnsimple.net.mail>',
          },
          {
            name: 'Content-Disposition',
            value: 'attachment; filename=dnsimple-1891215-936.pdf',
          },
        ],
        body: {
          attachmentId: 'a_long_id',
          size: 24178,
        },
      },
    ],
  },
  sizeEstimate: 73711,
  historyId: '8050377',
  internalDate: '1620202778000',
}
