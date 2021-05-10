const { splitter } = require('./splitter')

const date = (year, month, day) => {
  return new Date(Date.UTC(year, month - 1, day))
}

const TODAY = date(2000, 5, 4)
const YESTERDAY = date(2000, 5, 3)
const EARLY_MONTH = date(2000, 5, 1)
const APRIL = date(2000, 4, 30)
const MARCH = date(2000, 3, 30)
const DECEBMER = date(1999, 12, 30)

test('email is split over time', () => {
  const todayEmail = { id: '1', gmailDate: TODAY.getTime() }
  const yesterdaysEmail = { id: '2', gmailDate: YESTERDAY.getTime() }
  const earilyMonthEmail = { id: '3', gmailDate: EARLY_MONTH.getTime() }
  const aprilEmail = { id: '4', gmailDate: APRIL.getTime() }
  const marchEmail = { id: '5', gmailDate: MARCH.getTime() }
  const decemberEmail = { id: '6', gmailDate: DECEBMER.getTime() }
  const emails = [
    todayEmail,
    yesterdaysEmail,
    earilyMonthEmail,
    aprilEmail,
    marchEmail,
    decemberEmail,
  ]
  expect(splitter(emails, TODAY)).toEqual([
    { label: 'Today', emails: [todayEmail] },
    { label: 'Yesterday', emails: [yesterdaysEmail] },
    { label: 'This month', emails: [earilyMonthEmail] },
    { label: 'April', emails: [aprilEmail] },
    { label: 'Older', emails: [marchEmail, decemberEmail] },
  ])
})

test('omit label if missing', () => {
  const todayEmail = { id: '1', gmailDate: TODAY.getTime() }
  const emails = [todayEmail]

  expect(splitter(emails, TODAY)).toEqual([
    { label: 'Today', emails: [todayEmail] },
  ])
})
