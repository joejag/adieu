import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { lightBlue } from '@material-ui/core/colors'

import { useEmails } from '../emails-context'
import { allEmailsByDate } from '../core/emails'
import { fetchEmails } from '../api-client'
import {
  SocialSummary,
  UpdatesSummary,
  PromosSummary,
  ForumSummary,
} from './Summaries'
import Email from './Email'

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
  personal: {
    color: theme.palette.getContrastText(lightBlue[500]),
    backgroundColor: lightBlue[500],
  },
  rule: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

const AllEmails = () => {
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
    setEmails(allEmailsByDate(cachedEmails))
  }, [cachedEmails])

  return (
    <Container component="main" maxWidth="lg">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        className={classes.rule}
      >
        Adieu
      </Typography>
      <div className={classes.root}>
        {emails.map((period) => (
          <div key={period.label}>
            <Typography className={classes.dayLabel} variant="h5">
              {period.label}
            </Typography>
            {period.emails.map((bundle) => (
              <div key={bundle.label}>
                {bundle.label === 'personal' &&
                  bundle.emails.map((e) => (
                    <Email
                      key={e.id}
                      item={e}
                      color={classes.personal}
                      updateEmail={updateEmail}
                    />
                  ))}
                {bundle.label === 'social' && (
                  <SocialSummary
                    key={bundle.label}
                    bundle={bundle}
                  ></SocialSummary>
                )}
                {bundle.label === 'updates' && (
                  <UpdatesSummary
                    key={bundle.label}
                    bundle={bundle}
                  ></UpdatesSummary>
                )}
                {bundle.label === 'promos' && (
                  <PromosSummary
                    key={bundle.label}
                    bundle={bundle}
                  ></PromosSummary>
                )}
                {bundle.label === 'forum' && (
                  <ForumSummary
                    key={bundle.label}
                    bundle={bundle}
                  ></ForumSummary>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  )
}

export default AllEmails
