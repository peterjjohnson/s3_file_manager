import {LoginForm} from 'react-stormpath'

/**
 * Render the login page
 */
const LoginPage = () => (
    <div className="login-page">
        <h1 className="col-xs-offset-4 col-sm-4">Please log in</h1>
        <LoginForm />
    </div>
)

export default LoginPage
