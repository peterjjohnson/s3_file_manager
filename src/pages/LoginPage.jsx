import Auth from '../lib/auth'

const auth = new Auth()

/**
 * Render the login page
 */
const LoginPage = () => (
    <div className="login-page">
        <h1 className="col-xs-offset-4 col-sm-4">Please log in</h1>
        {auth.login()}
    </div>
)

export default LoginPage
