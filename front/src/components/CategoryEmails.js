import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { red, deepOrange, cyan, purple } from '@material-ui/core/colors'

import Email from './Email'
import { useEmails } from '../emails-context'
import { fetchEmails } from '../api-client'
import { bundleEmailsByDate } from '../core/emails'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  dayLabel: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(3.5),
  },
  rule: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  social: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  updates: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  promos: {
    color: theme.palette.getContrastText(cyan[600]),
    backgroundColor: cyan[600],
  },
  forum: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
  },
}))

const SocialBundle = () => {
  const classes = useStyles()

  return (
    <Bundle
      title="Social"
      bundleType="CATEGORY_SOCIAL"
      color={classes.social}
    />
  )
}

const ForumsBundle = () => {
  const classes = useStyles()

  return (
    <Bundle title="Forums" bundleType="CATEGORY_FORUMS" color={classes.forum} />
  )
}

const PromosBundle = () => {
  const classes = useStyles()

  return (
    <Bundle
      title="Promotions "
      bundleType="CATEGORY_PROMOTIONS"
      color={classes.promos}
    />
  )
}

const UpdatesBundle = () => {
  const classes = useStyles()

  return (
    <Bundle
      title="Updates"
      bundleType="CATEGORY_UPDATES"
      color={classes.updates}
    />
  )
}

const Bundle = ({ title, bundleType, color }) => {
  const classes = useStyles()
  const [cachedEmails, setCachedEmails, updateEmail] = useEmails()
  const [emails, setEmails] = React.useState([])

  React.useEffect(() => {
    if (cachedEmails.length > 0) {
      return
    }
    fetchEmails().then(setCachedEmails)
  }, [cachedEmails, setCachedEmails])

  React.useEffect(() => {
    setEmails(bundleEmailsByDate(cachedEmails, bundleType))
  }, [cachedEmails, bundleType])

  return (
    <Container component="main" maxWidth="lg">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        className={classes.rule}
      >
        {title}
      </Typography>
      <div className={classes.root}>
        {emails.map((period) => (
          <div key={period.label}>
            <Typography className={classes.dayLabel} variant="h5">
              {period.label}
            </Typography>
            {period.emails.map((bundle) => (
              <div key={bundle.label}>
                {bundle.emails.map((e) => (
                  <Email
                    key={e.id}
                    item={e}
                    color={color}
                    updateEmail={updateEmail}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  )
}

export { SocialBundle, ForumsBundle, PromosBundle, UpdatesBundle }
