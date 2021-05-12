import * as React from 'react'

const EmailsContext = React.createContext()

function useEmails() {
  const context = React.useContext(EmailsContext)
  if (!context) {
    throw new Error(`useEmails must be used within a EmailsProvider`)
  }

  const updateEmail = (email) => {
    const [_, setCachedEmails] = context

    setCachedEmails((cachedEmails) =>
      cachedEmails.map((knownEmail) => {
        if (knownEmail.id === email.id) {
          return email
        }
        return knownEmail
      })
    )
  }

  return [...context, updateEmail]
}

function EmailsProvider(props) {
  const [emails, setEmails] = React.useState([])
  const value = React.useMemo(() => [emails, setEmails], [emails])
  return <EmailsContext.Provider value={value} {...props} />
}

export { EmailsProvider, useEmails }
