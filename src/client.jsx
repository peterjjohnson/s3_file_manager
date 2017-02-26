'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, browserHistory } from 'react-router'
import ReactStormpath, { Router, LoginForm, HomeRoute, AuthenticatedRoute } from 'react-stormpath'
import { LoginPage, FileBrowser } from './views'

ReactStormpath.init()
ReactDOM.render(
    <Router history={browserHistory}>
        <AuthenticatedRoute>
            <HomeRoute path="/files" component={FileBrowser} />
        </AuthenticatedRoute>
        <Route path="/" component={LoginPage} />
    </Router>,
    document.getElementById('filemanager-app')
)
