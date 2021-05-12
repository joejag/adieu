import { render, screen } from '@testing-library/react'
import { EmailsProvider } from '../emails-context'
import AllEmails from './AllEmails'

test('renders AllEmails page', () => {
  render(
    <EmailsProvider>
      <AllEmails />
    </EmailsProvider>
  )
  const linkElement = screen.getByText(/adieu/i)
  expect(linkElement).toBeInTheDocument()
})
