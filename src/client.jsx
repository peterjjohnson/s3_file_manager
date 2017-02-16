import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, browserHistory } from 'react-router';
import ReactStormpath, { Router, LoginForm, HomeRoute } from 'react-stormpath';
import LoginPage from './views/LoginPage.jsx';
import FileBrowser from './views/FileBrowser.jsx';

ReactStormpath.init();
ReactDOM.render(
    <Router history={browserHistory}>
        <HomeRoute path="/files" component={FileBrowser} />
        <Route path="/" component={LoginPage} />
    </Router>,
    document.getElementById('filemanager-app')
);
