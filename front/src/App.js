import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Avatar from '@material-ui/core/Avatar'
import { lightBlue } from '@material-ui/core/colors'

import FullheightIframe from './components/iframe'
import { splitter } from './core/splitter'
import { bundled } from './core/bundler'
import {
  SocialSummary,
  UpdatesSummary,
  PromosSummary,
  ForumSummary,
} from './components/summaries'

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
                  bundle.emails.map((e) => <Emails key={e.id} item={e} />)}
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

// Used to make the opening transition less jumpt
const FAKE_BODY = btoa('<p>&nbsp;</p>'.repeat(20))

const Emails = ({ item }) => {
  const classes = useStyles()
  const [emailBody, setEmailBody] = React.useState(FAKE_BODY)

  const onExpanded = (event, expanded) => {
    if (expanded) {
      const url = `${window.location.origin}/api/email/${item.id}`
      fetch(url)
        .then((res) => {
          if (res.status === 401) {
            window.location = `${window.location.origin}/api/login`
            return []
          }
          return res.json()
        })
        .then((res) => {
          setEmailBody(res.emailBody)
        })
    } else {
      setEmailBody(FAKE_BODY)
    }
  }

  return (
    <Accordion key={item.id} onChange={onExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Grid container spacing={1}>
          <Grid item xs={1} sm={1}>
            <Avatar className={classes.personal}>
              {item.from.replace('"', '').substring(0, 1).toUpperCase()}
            </Avatar>
          </Grid>

          <Grid item xs={2} sm={2}>
            <Typography className={classes.heading}>
              {item.from
                .substring(0, item.from.indexOf('<'))
                .replace('"', '')
                .replace('"', '')}
            </Typography>
          </Grid>

          <Grid item xs={9} sm={9}>
            <Typography className={classes.heading}>{item.subject}</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <FullheightIframe
          emailbody={emailBody}
          mimeType={item.mimeType}
          subject={item.subject}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default App
