const byCategory = (emails) => {
  return [
    {
      label: 'personal',
      emails: emails.filter(
        (e) =>
          e.labelIds.includes('CATEGORY_PERSONAL') ||
          (!e.labelIds.includes('CATEGORY_UPDATES') &&
            !e.labelIds.includes('CATEGORY_PROMOTIONS') &&
            !e.labelIds.includes('CATEGORY_SOCIAL') &&
            !e.labelIds.includes('CATEGORY_FORUMS'))
      ),
    },
    {
      label: 'updates',
      emails: emails.filter((e) => e.labelIds.includes('CATEGORY_UPDATES')),
    },
    {
      label: 'promos',
      emails: emails.filter((e) => e.labelIds.includes('CATEGORY_PROMOTIONS')),
    },
    {
      label: 'social',
      emails: emails.filter((e) => e.labelIds.includes('CATEGORY_SOCIAL')),
    },
    {
      label: 'forum',
      emails: emails.filter((e) => e.labelIds.includes('CATEGORY_FORUMS')),
    },
  ].filter((b) => b.emails.length)
}

export { byCategory }
