import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'

import { EmailsProvider } from './emails-context'
import {
  SocialBundle,
  ForumsBundle,
  PromosBundle,
  UpdatesBundle,
} from './components/CategoryEmails'
import AllEmails from './components/AllEmails'
import ScrollToTop from './components/ScrollToTop'

ReactDOM.render(
  <>
    <EmailsProvider>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/forums">
            <ForumsBundle />
          </Route>
          <Route path="/promos">
            <PromosBundle />
          </Route>
          <Route path="/updates">
            <UpdatesBundle />
          </Route>
          <Route path="/social">
            <SocialBundle />
          </Route>
          <Route path="/">
            <AllEmails />
          </Route>
        </Switch>
      </Router>
    </EmailsProvider>
  </>,
  document.getElementById('root')
)
