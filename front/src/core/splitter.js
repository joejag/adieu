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

  const previousMonthDate = new Date(date.getTime())
  previousMonthDate.setUTCMonth(date.getUTCMonth() - 1)
  const [previousMonths, notPreviousMonths] = partition(notThisMonths, (e) => {
    return within({ ...monthRange(previousMonthDate), candidate: e.gmailDate })
  })
  const previousMonthLabel = previousMonthDate.toLocaleString('default', {
    month: 'long',
  })

  return [
    { label: 'Today', emails: todays },
    { label: 'Yesterday', emails: yesterdays },
    { label: 'This month', emails: thisMonths },
    { label: previousMonthLabel, emails: previousMonths },
    { label: 'Older', emails: notPreviousMonths },
  ].filter((period) => period.emails.length)
}

export { splitter }
