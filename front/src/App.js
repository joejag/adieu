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
import { deepOrange } from '@material-ui/core/colors'

import FullheightIframe from './components/iframe'
import {
  within,
  todayRange,
  yesterdayRange,
  monthRange,
  beforeMonthRange,
} from './core/sorter'

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
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
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
        setEmails(res)
      })
  }, [])

  const todayEmails = emails.filter((e) =>
    within({
      ...todayRange(),
      candidate: new Date(parseInt(e.gmailDate)),
    })
  )
  const yesterdayEmails = emails.filter((e) =>
    within({
      ...yesterdayRange(),
      candidate: new Date(parseInt(e.gmailDate)),
    })
  )
  const monthsEmails = emails.filter((e) =>
    within({
      ...monthRange(),
      candidate: new Date(parseInt(e.gmailDate)),
    })
  )
  const previousEmails = emails.filter((e) =>
    within({
      ...beforeMonthRange(),
      candidate: new Date(parseInt(e.gmailDate)),
    })
  )

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
        {todayEmails.length > 0 && (
          <Typography className={classes.dayLabel} variant="h5">
            Today
          </Typography>
        )}
        {todayEmails.map((item) => (
          <Emails key={item.id} item={item}></Emails>
        ))}
        {yesterdayEmails.length > 0 && (
          <Typography className={classes.dayLabel} variant="h5">
            Yesterday
          </Typography>
        )}
        {yesterdayEmails.map((item) => (
          <Emails key={item.id} item={item}></Emails>
        ))}
        {monthsEmails.length > 0 && (
          <Typography className={classes.dayLabel} variant="h5">
            This month
          </Typography>
        )}
        {monthsEmails.map((item) => (
          <Emails key={item.id} item={item}></Emails>
        ))}
        {previousEmails.length > 0 && (
          <Typography className={classes.dayLabel} variant="h5">
            Before this month
          </Typography>
        )}
        {previousEmails.map((item) => (
          <Emails key={item.id} item={item}></Emails>
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
      setEmailBody(item.emailBody)
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
            <Avatar className={classes.orange}>
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
