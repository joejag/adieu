import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  SocialBundle,
  ForumsBundle,
  PromosBundle,
  UpdatesBundle,
} from './Bundle'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

ReactDOM.render(
  <>
    <CssBaseline />
    <Router>
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
          <App />
        </Route>
      </Switch>
    </Router>
  </>,
  document.getElementById('root')
)
