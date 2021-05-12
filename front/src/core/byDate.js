const byDate = (emails, today = new Date()) => {
  const [todays, notTodays] = partition(emails, (e) =>
    within({ ...todayRange(today), candidate: e.gmailDate })
  )
  const [yesterdays, notYesterdays] = partition(notTodays, (e) =>
    within({ ...yesterdayRange(today), candidate: e.gmailDate })
  )
  const [thisMonths, notThisMonths] = partition(notYesterdays, (e) =>
    within({ ...monthRange(today), candidate: e.gmailDate })
  )

  const previousMonthDate = new Date(today.getTime())
  previousMonthDate.setUTCMonth(today.getUTCMonth() - 1)
  const [previousMonths, notPreviousMonths] = partition(notThisMonths, (e) =>
    within({ ...monthRange(previousMonthDate), candidate: e.gmailDate })
  )
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

const within = ({ from, to, candidate }) => candidate >= from && candidate <= to

const withoutTime = (d) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))

const todayRange = (today = new Date()) => {
  const from = withoutTime(today)
  const to = withoutTime(today)
  to.setUTCDate(to.getUTCDate() + 1)

  return { from, to }
}

const yesterdayRange = (today = new Date()) => {
  const from = withoutTime(today)
  from.setUTCDate(from.getUTCDate() - 1)
  const to = withoutTime(today)

  return { from, to }
}

const monthRange = (today = new Date()) => {
  const from = withoutTime(today)
  from.setUTCDate(1)
  const to = withoutTime(today)
  to.setUTCDate(1)
  to.setUTCMonth(to.getUTCMonth() + 1)
  to.setUTCDate(to.getUTCDate() - 1)

  return { from, to }
}

function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]]
    },
    [[], []]
  )
}

export { byDate, within, todayRange, yesterdayRange, monthRange }
