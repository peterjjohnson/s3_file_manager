'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Route, browserHistory} from 'react-router'
import ReactStormpath, {Router, HomeRoute, AuthenticatedRoute} from 'react-stormpath'
import {LoginPage, FileBrowser} from './pages'

require('font-awesome/css/font-awesome.css')
require('./styles/style.css')

// Make sure React is always available
window.React = React

// Initialise Stormpath
ReactStormpath.init()

// Render our application
ReactDOM.render(
    <Router history={browserHistory}>
        <AuthenticatedRoute>
            <HomeRoute path="/files" component={FileBrowser} />
        </AuthenticatedRoute>
        <Route path="/" component={LoginPage} />
    </Router>,
    document.getElementById('filemanager-app')
)
