const bundled = (emails) => {
  // TODO: Do other properly by taking what does not have a home
  return [
    {
      label: 'personal',
      emails: emails.filter(
        (e) => e.labelIds && e.labelIds.includes('CATEGORY_PERSONAL')
      ),
    },
    {
      label: 'updates',
      emails: emails.filter(
        (e) => e.labelIds && e.labelIds.includes('CATEGORY_UPDATES')
      ),
    },
    {
      label: 'promos',
      emails: emails.filter(
        (e) => e.labelIds && e.labelIds.includes('CATEGORY_PROMOTIONS')
      ),
    },
    {
      label: 'social',
      emails: emails.filter(
        (e) => e.labelIds && e.labelIds.includes('CATEGORY_SOCIAL')
      ),
    },
    {
      label: 'forum',
      emails: emails.filter(
        (e) => e.labelIds && e.labelIds.includes('CATEGORY_FORUMS')
      ),
    },
    {
      label: 'other',
      emails: emails.filter((e) => e.labelIds === undefined),
    },
  ].filter((b) => b.emails.length)
}

export { bundled }
