const fetchEmails = () => {
  const url = `${window.location.origin}/api/emails`
  return fetch(url)
    .then((res) => {
      if (res.status === 401) {
        window.location = `${window.location.origin}/api/login`
        return []
      }
      return res.json()
    })
    .then((res) => {
      // warm up the email Lambda
      const firstAlreadyReadEmail = res.find((e) => !e.unread)
      if (firstAlreadyReadEmail !== undefined) {
        fetchEmail(firstAlreadyReadEmail.id)
      }

      return res
    })
}

const fetchEmail = (id) => {
  const url = `${window.location.origin}/api/email/${id}`
  return fetch(url).then((res) => {
    if (res.status === 401) {
      window.location = `${window.location.origin}/api/login`
      return {}
    }
    return res.json()
  })
}

export { fetchEmails, fetchEmail }
