'use strict'

import React, { Component, PropTypes } from 'react'
import { LogoutLink } from 'react-stormpath'
import AWS from 'aws-sdk'
import { Upload, FileList } from '../components'

const getCredentials = user => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('GET', '/credentials?user=' + user)
        req.addEventListener('load', function() {
            resolve(this.responseText)
        })
        req.addEventListener('error', err => reject(err))
        req.send()
    })
}

export default class FileBrowser extends Component {
    static contextTypes = {
        user: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.handleUpload = this.handleUpload.bind(this)
        this.state = {
            objects: [],
            params: {},
            region: "",
            credentials: {}
        }
    }

    handleUpload(object) {
        this.setState({objects: [...this.state.objects, object]})
    }

    render() {
        return (
            <div>
                <Upload
                    params={this.state.params}
                    credentials={this.state.credentials}
                    region={this.state.region}
                    onAddObject={this.handleUpload}
                />
                <FileList objects={this.state.objects} />
                <LogoutLink />
            </div>
        )
    }

    componentDidMount() {
        getCredentials(this.context.user.username).then(config => {
            config = JSON.parse(config)
            AWS.config.update({
                credentials: config.credentials,
                region: config.region
            })
            const S3 = new AWS.S3()
            S3.listObjects(config.listParams, (err, objects) => {
                if (err) {
                    console.error(err)
                    this.setState({ objects: [err] })
                } else {
                    this.setState({
                        objects: objects.Contents,
                        params: config.uploadParams,
                        credentials: config.credentials,
                        region: config.region
                    })
                }
            })
        })
    }
}
