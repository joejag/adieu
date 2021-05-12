import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Avatar from '@material-ui/core/Avatar'

import ResizingIFrame from './ResizingIFrame'
import { fetchEmail } from '../api-client'
import AttachmentCard from './Attachment'

// Used to make the opening transition less jumpy
const FAKE_BODY = btoa('<p>&nbsp;</p>'.repeat(20))

const Email = ({ item, color, updateEmail }) => {
  const fontWeight = item.unread ? 600 : 400
  const emailBody = item.emailBody.length ? item.emailBody : FAKE_BODY

  const onExpanded = (event, expanded) => {
    if (expanded && item.emailBody.length === 0) {
      fetchEmail(item.id).then(updateEmail)
    }
  }

  return (
    <Accordion key={item.id} onChange={onExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${item.id}-content`}
        id={`panel-${item.id}-header`}
      >
        <Grid
          container
          spacing={1}
          direction="row"
          alignItems="center"
          justify="flex-start"
        >
          <Grid
            item
            xs={12}
            md={3}
            container
            spacing={1}
            alignItems="center"
            justify="flex-start"
          >
            <Grid item>
              <Avatar className={color}>
                {item.fromName.substring(0, 1).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography style={{ fontWeight }} noWrap={true}>
                {item.fromName}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography style={{ fontWeight }}>{item.subject}</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2} direction="column">
          <Grid item>
            {item.attachments.map((a) => (
              <AttachmentCard key={a.id} item={a} />
            ))}
          </Grid>
          <Grid item>
            <ResizingIFrame
              emailbody={emailBody}
              mimeType={item.mimeType}
              subject={item.subject}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default Email
