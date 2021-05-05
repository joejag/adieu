const within = ({ from, to, candidate }) => {
  return candidate >= from && candidate <= to
}

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

export { within, todayRange, yesterdayRange, monthRange }
