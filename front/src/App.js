import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { lightBlue } from '@material-ui/core/colors'

import { splitter } from './core/splitter'
import { bundled } from './core/bundler'
import {
  SocialSummary,
  UpdatesSummary,
  PromosSummary,
  ForumSummary,
} from './components/summaries'
import EmailViewer from './components/EmailViewer'

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
  emailbody: {
    width: '100%',
    height: '100%',
  },
  rule: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

const App = () => {
  const classes = useStyles()
  const [emails, setEmails] = React.useState([])

  React.useEffect(() => {
    const url = `${window.location.origin}/api/emails`
    fetch(url)
      .then((res) => {
        if (res.status === 401) {
          window.location = `${window.location.origin}/api/login`
          return []
        }
        return res.json()
      })
      .then((res) => {
        const splitEmails = splitter(res)
        const newSplit = splitEmails.map((period) => {
          period.emails = bundled(period.emails)
          return period
        })

        setEmails(newSplit)

        // warm up the Lambda
        const warmup = res.find((e) => e.unread)
        if (warmup !== undefined) {
          const firstEmail = `${window.location.origin}/api/email/${warmup.id}`
          fetch(firstEmail).then()
        }
      })
  }, [])

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
                    <EmailViewer key={e.id} item={e} color={classes.personal} />
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

export default App
