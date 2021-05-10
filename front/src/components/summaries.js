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
    ></GenericSummary>
  )
}

const GenericSummary = ({ title, color, bundle, link }) => {
  const onExpanded = (event, expanded) => {
    if (expanded) {
      window.location = `${window.location.origin}${link}`
    }
  }

  return (
    <Accordion onChange={onExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Grid container spacing={1}>
          <Grid item xs={1} sm={1}>
            {title === 'Social' && (
              <PeopleIcon fontSize="large" className={color} />
            )}
            {title === 'Updates' && (
              <FlagIcon fontSize="large" className={color} />
            )}
            {title === 'Promos' && (
              <LocalOfferIcon fontSize="large" className={color} />
            )}
            {title === 'Forums' && (
              <ForumIcon fontSize="large" className={color} />
            )}
          </Grid>

          <Grid item xs={2} sm={2}>
            <Typography className={color}>{title}</Typography>
          </Grid>

          <Grid item xs={9} sm={9}>
            <Typography>
              {bundle.emails.map((e) => (
                <span key={e.id} style={{ fontWeight: e.unread ? 600 : 400 }}>
                  {e.from
                    .substring(0, e.from.indexOf('<'))
                    .replace('"', '')
                    .replace('"', '') + ', '}
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
