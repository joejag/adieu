import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
})

export default function AttachmentCard({ messageId, item }) {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {item.filename}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <a
            href={`${window.location.origin}/api/email/${messageId}/attachment/${item.id}`}
            target="_blank"
            rel="noreferrer"
            className="MuiLink-underlineNone"
          >
            Download
          </a>
        </Button>
      </CardActions>
    </Card>
  )
}
