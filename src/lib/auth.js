import auth0 from 'auth0-js'
import history from './history'
import config from './client.config'

export default class Auth {
    auth0 = new auth0.WebAuth({
        ...config.auth0,
        responseType: 'token id_token',
        scop: 'openid profile'
    })

    constructor() {
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
        this.isAuthenticated = this.isAuthenticated.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authRes) => {
            if (authRes && authRes.accessToken && authRes.idToken) {
                this.setSession(authRes)
                history.replace(`/files`)
            } else if (err) {
                history.replace(`/`)
                console.error(err)
            }
        })
    }

    setSession(authRes) {
        localStorage.setItem(`access_token`, authRes.accessToken)
        localStorage.setItem(`id_token`, authRes.idToken)
        localStorage.setItem(`expires_at`, JSON.stringify((authRes.expiresIn * 1000) + new Date().getTime()))
        history.replace(`/files`)
    }

    isAuthenticated() {
        return new Date().getTime() < JSON.parse(localStorage.getItem(`expires_at`))
    }

    login() {
        this.auth0.authorize()
    }

    logout() {
        localStorage.removeItem(`access_token`)
        localStorage.removeItem(`id_token`)
        localStorage.removeItem(`expires_at`)
        history.replace(`/`)
    }

    getAccessToken() {
        const accessToken = localStorage.getItem(`access_token`)
        if (!accessToken) {
            throw new Error('No access token')
        }
        return accessToken
    }

    getProfile() {
        return new Promise((resolve, reject) => {
            this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
                if (err) {
                    reject(err)
                } else if (profile) {
                    resolve(profile)
                } else {
                    reject('Unknown error')
                }
            })
        })
    }
}
