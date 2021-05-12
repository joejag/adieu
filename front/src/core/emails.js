import { byDate } from '../core/byDate'
import { byCategory } from './byCategory'

const allEmailsByDate = (emails) => {
  const emailsByDate = byDate(emails)
  return emailsByDate.map((period) => {
    period.emails = byCategory(period.emails)
    return period
  })
}

const bundleEmailsByDate = (emails, bundleType) => {
  const filteredEmails = emails.filter((e) => e.labelIds.includes(bundleType))
  return allEmailsByDate(filteredEmails)
}

export { allEmailsByDate, bundleEmailsByDate }
