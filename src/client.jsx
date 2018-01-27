import React, { Component } from 'react'
import { Route, Router } from 'react-router'
import { Navbar, Button } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import { FileBrowser } from './pages'
import { Callback } from './components'
import { Auth, history } from './lib'

require('bootstrap/dist/css/bootstrap.css')
require('font-awesome/css/font-awesome.css')
require('./styles/style.css')

window.React = React

const auth = new Auth()

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication()
    }
}

class Client extends Component {
    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    login() {
        this.props.auth.login()
    }

    logout() {
        this.props.auth.logout()
    }

    render() {
        const { isAuthenticated } = this.props.auth

        return (
            <div>
                <Navbar fluid>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">S3 File Manager</a>
                        </Navbar.Brand>
                        {
                            !isAuthenticated() && (
                                <Button
                                    bsStyle="primary"
                                    className="btn-margin"
                                    onClick={this.login.bind(this)}
                                >
                                    Log In
                                </Button>
                            )
                        }
                        {
                            isAuthenticated() && (
                                <Button
                                    bsStyle="primary"
                                    className="btn-margin"
                                    onClick={this.logout.bind(this)}
                                >
                                    Log Out
                                </Button>
                            )
                        }
                    </Navbar.Header>
                </Navbar>
            </div>
        )
    }
}

// Render our application
ReactDOM.render(
    <Router history={history} component={Client}>
        <div>
            <Route path="/" render={(props) => <Client auth={auth} {...props} />} />
            <Route path="/files" render={(props) => <FileBrowser auth={auth} {...props} />} />
            <Route path="/callback" render={(props) => {
                handleAuthentication(props);
                return <Callback {...props} />
            }}/>
        </div>
    </Router>,
    document.getElementById('filemanager-app')
)
