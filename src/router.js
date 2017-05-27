import React from 'react'
import { Router, Route , IndexRedirect } from 'dva/router'
import RootPage from './pages/RootPage'
import Error from './pages/error/error'
import Dashboard from './pages/dashboard/dashboard'

import Ico from './pages/ui-test/ico'
import PimItemPage from "./pages/PimItemPage/PimItemPage"
import PimTypePage from "./pages/PimTypePage/PimTypePage"
import About from "./pages/about"
import ViewItemPage from "./pages/ViewItemPage/ViewItemPage";
import MapPage from "./pages/MapPage/PimMapPage";
import TocPage from "./pages/PimTocPage/PimTocPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import OperationManagePage from "./pages/OperationManagePage/OperationManagePage"
import DetailTypePage from "./pages/DetailPage/DetailTypePage";
export default function ({ history }) {

  return (
    <Router history={ history }>
      <Route path="/" component={ RootPage } >
        {/*<IndexRedirect to="/project" />*/}
        <Route path="/dashboard" component={ Dashboard }/>
        <Route path="/types" component={ PimTypePage }/>
        <Route path="/typeProps/:shortName" component={ DetailTypePage }/>
        <Route path="/items" component={ PimItemPage }/>
        <Route path="/types/:shortName" component={ ViewItemPage }/>
        <Route path="/map" component={ MapPage }/>
        <Route path="/itemProps/:shortName" component={ DetailPage }/>
        <Route path="/operation" component={ OperationManagePage}/>
        <Route path="/ui/ico" component={Ico}/>
        <Route path="/about" component={About}/>
        <Route path="/api" component={TocPage}/>
        <Route path="*" component={ Error } />
      </Route>
    </Router>
  )
}
