import React, { Component } from 'react';
import { LoginForm } from 'react-stormpath';

export default class LoginPage extends Component {
    render() {
        return (
            <div>
                <LoginForm />
            </div>
        );
    }
}
