import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { red, deepOrange, cyan, purple } from '@material-ui/core/colors'

import EmailViewer from './components/EmailViewer'
import { splitter } from './core/splitter'
import { bundled } from './core/bundler'

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
  emailbody: {
    width: '100%',
    height: '100%',
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
        const bundleEmails = res.filter((r) => r.labelIds.includes(bundleType))
        const splitEmails = splitter(bundleEmails)
        const newSplit = splitEmails.map((period) => {
          period.emails = bundled(period.emails)
          return period
        })

        setEmails(newSplit)
      })
  }, [bundleType])

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
                  <EmailViewer key={e.id} item={e} color={color} />
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
