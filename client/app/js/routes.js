import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { App, PageNotFound } from './components'
import SkiDayCount from './components/containers/SkiDayCount'

const routes = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={SkiDayCount}/>
            <Route path="add-day" component={AddDayForm}/>
            <Route path="list-days" component={SkiDayList}>
                <Route path=":filter" component={SkiDayList}/>
            </Route>
        <Route path="*" component={PageNotFound}/>
        </Route>
    </Router>
)

export default routes

//TODO: integrate router