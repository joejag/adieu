const { partition } = require('./arrays')
const { within, todayRange, yesterdayRange, monthRange } = require('./sorter')

const splitter = (emails, date = new Date()) => {
  const [todays, notTodays] = partition(emails, (e) => {
    return within({ ...todayRange(date), candidate: e.gmailDate })
  })
  const [yesterdays, notYesterdays] = partition(notTodays, (e) => {
    return within({ ...yesterdayRange(date), candidate: e.gmailDate })
  })
  const [thisMonths, notThisMonths] = partition(notYesterdays, (e) => {
    return within({ ...monthRange(date), candidate: e.gmailDate })
  })

  return [
    { label: 'Today', emails: todays },
    { label: 'Yesterday', emails: yesterdays },
    { label: 'This month', emails: thisMonths },
    { label: 'Older', emails: notThisMonths },
  ].filter((period) => period.emails.length)
}

export { splitter }
