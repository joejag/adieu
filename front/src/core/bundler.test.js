const { bundled } = require('./bundler')

test('the bundles', () => {
  const personalsEmail = { id: 0, labelIds: ['CATEGORY_PERSONAL'] }
  const updatesEmail = { id: 1, labelIds: ['CATEGORY_UPDATES'] }
  const promosEmail = { id: 2, labelIds: ['CATEGORY_PROMOTIONS'] }
  const socialEmail = { id: 3, labelIds: ['CATEGORY_SOCIAL'] }
  const forumEmail = { id: 4, labelIds: ['CATEGORY_FORUMS'] }
  const otherEmail = { id: 5 }
  const emails = [
    personalsEmail,
    updatesEmail,
    promosEmail,
    socialEmail,
    forumEmail,
    otherEmail,
  ]

  expect(bundled(emails)).toEqual([
    { label: 'personal', emails: [personalsEmail] },
    { label: 'updates', emails: [updatesEmail] },
    { label: 'promos', emails: [promosEmail] },
    { label: 'social', emails: [socialEmail] },
    { label: 'forum', emails: [forumEmail] },
    { label: 'other', emails: [otherEmail] },
  ])
})

test('omit missing', () => {
  const personalsEmail = { id: 0, labelIds: ['CATEGORY_PERSONAL'] }
  const forumEmail = { id: 4, labelIds: ['CATEGORY_FORUMS'] }
  const emails = [personalsEmail, forumEmail]

  expect(bundled(emails)).toEqual([
    { label: 'personal', emails: [personalsEmail] },
    { label: 'forum', emails: [forumEmail] },
  ])
})
