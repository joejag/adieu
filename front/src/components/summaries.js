import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { red, deepOrange, cyan, purple } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import PeopleIcon from '@material-ui/icons/People'
import FlagIcon from '@material-ui/icons/Flag'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import ForumIcon from '@material-ui/icons/Forum'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
  social: {
    color: red[500],
    backgroundColor: theme.palette.getContrastText(red[500]),
  },
  updates: {
    color: deepOrange[500],
    backgroundColor: theme.palette.getContrastText(deepOrange[500]),
  },
  promos: {
    color: cyan[600],
  },
  forum: {
    color: purple[500],
    backgroundColor: theme.palette.getContrastText(purple[500]),
  },
}))

const SocialSummary = ({ bundle }) => {
  const classes = useStyles()

  return (
    <GenericSummary
      bundle={bundle}
      color={classes.social}
      title="Social"
      link="/social"
      icon={<PeopleIcon fontSize="large" className={classes.social} />}
    ></GenericSummary>
  )
}

const UpdatesSummary = ({ bundle }) => {
  const classes = useStyles()

  return (
    <GenericSummary
      bundle={bundle}
      color={classes.updates}
      title="Updates"
      link="/updates"
      icon={<FlagIcon fontSize="large" className={classes.updates} />}
    ></GenericSummary>
  )
}

const PromosSummary = ({ bundle }) => {
  const classes = useStyles()

  return (
    <GenericSummary
      bundle={bundle}
      color={classes.promos}
      title="Promos"
      link="/promos"
      icon={<LocalOfferIcon fontSize="large" className={classes.promos} />}
    ></GenericSummary>
  )
}

const ForumSummary = ({ bundle }) => {
  const classes = useStyles()

  return (
    <GenericSummary
      bundle={bundle}
      color={classes.forum}
      title="Forums"
      link="/forums"
      icon={<ForumIcon fontSize="large" className={classes.forum} />}
    ></GenericSummary>
  )
}

const GenericSummary = ({ title, color, bundle, link, icon }) => {
  const routerHistory = useHistory()

  const onExpanded = (event, expanded) => {
    if (expanded) {
      routerHistory.push(link)
    }
  }

  return (
    <Accordion onChange={onExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${title}-content`}
        id={`panel-${title}-header`}
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
            <Grid item>{icon}</Grid>

            <Grid item xs zeroMinWidth>
              <Typography className={color}>{title}</Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography>
              {bundle.emails.map((e, idx) => (
                <span key={e.id} style={{ fontWeight: e.unread ? 600 : 400 }}>
                  {e.fromName + (idx !== bundle.emails.length - 1 ? ', ' : '')}
                </span>
              ))}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
    </Accordion>
  )
}

export { SocialSummary, UpdatesSummary, PromosSummary, ForumSummary }
