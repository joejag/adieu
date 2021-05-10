import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Avatar from '@material-ui/core/Avatar'

import FullheightIframe from './iframe'

// Used to make the opening transition less jumpt
const FAKE_BODY = btoa('<p>&nbsp;</p>'.repeat(20))

const EmailViewer = ({ item, color }) => {
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
            <Avatar className={color}>
              {item.from.replace('"', '').substring(0, 1).toUpperCase()}
            </Avatar>
          </Grid>

          <Grid item xs={2} sm={2}>
            <Typography>
              {item.from
                .substring(0, item.from.indexOf('<'))
                .replace('"', '')
                .replace('"', '')}
            </Typography>
          </Grid>

          <Grid item xs={9} sm={9}>
            <Typography>{item.subject}</Typography>
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

export default EmailViewer
