const { splitter } = require('./splitter')

const date = (year, month, day) => {
  return new Date(Date.UTC(year, month - 1, day))
}

const TODAY = date(2000, 5, 4)
const YESTERDAY = date(2000, 5, 3)
const EARLY_MONTH = date(2000, 5, 1)
const APRIL = date(2000, 4, 30)

test('a weeks worth of email', () => {
  const todayEmail = { id: '1', gmailDate: TODAY.getTime() }
  const yesterdaysEmail = { id: '2', gmailDate: YESTERDAY.getTime() }
  const earilyMonthEmail = { id: '2', gmailDate: EARLY_MONTH.getTime() }
  const lastMonthEmail = { id: '2', gmailDate: APRIL.getTime() }
  const emails = [todayEmail, yesterdaysEmail, earilyMonthEmail, lastMonthEmail]

  expect(splitter(emails, TODAY)).toEqual([
    { label: 'Today', emails: [todayEmail] },
    { label: 'Yesterday', emails: [yesterdaysEmail] },
    { label: 'This month', emails: [earilyMonthEmail] },
    { label: 'Older', emails: [lastMonthEmail] },
  ])
})

test('omit label if missing', () => {
  const todayEmail = { id: '1', gmailDate: TODAY.getTime() }
  const emails = [todayEmail]

  expect(splitter(emails, TODAY)).toEqual([
    { label: 'Today', emails: [todayEmail] },
  ])
})
