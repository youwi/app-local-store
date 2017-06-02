import React from 'react'
import { Router, Route , IndexRedirect } from 'dva/router'
import RootPage from './pages/RootPage'
import Error from './pages/error/error'
import Dashboard from './pages/dashboard/dashboard'

import Ico from './pages/ui-test/ico'
import About from "./pages/about"

export default function ({ history }) {

  return (
    <Router history={ history }>
      <Route path="/" component={ RootPage } >
        {/*<IndexRedirect to="/project" />*/}
        <Route path="/dashboard" component={ Dashboard }/>
        <Route path="/ui/ico" component={Ico}/>
        <Route path="/about" component={About}/>
        <Route path="*" component={ Error } />
      </Route>
    </Router>
  )
}
