import React from 'react'
import {Router, Route, Switch,} from 'dva/router'
import RootLayout from './RootLayout'
import Error from './error/error'
// import Dashboard from './dashboard/dashboard'

// import Ico from './ui-test/ico'
import About from "./about"
import VersionsPage from "./VersionsPage/VersionsPage";

export default function ({history}) {

  return (
    <Router history={history}>

      <Switch>
        <Route exact path="/" component={RootLayout}/>
        {/*<Route path="/dashboard" component={Dashboard}/>*/}
        {/*<Route path="/ui/ico" component={Ico}/>*/}
        <Route path="/about" component={About}/>
        <Route path="/product/:productShortName" component={VersionsPage}/>
        <Route path="*" component={Error}/>
      </Switch>
    </Router>
  )
}
