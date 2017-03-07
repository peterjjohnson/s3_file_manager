'use strict'

import React, {Component, PropTypes} from 'react'
import {LogoutLink} from 'react-stormpath'
import AWS from 'aws-sdk'
import {Upload, FileList} from '../components'

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
        this.handleUploadProgress = this.handleUploadProgress.bind(this)
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

    handleUploadProgress({loaded: Size}, key) {
        this.setState({
            objects: this.state.objects.map(object => (object.Key == key) ? {...object, Size} : object)
        })
    }

    handleDeleteObject(params) {
        const S3 = new AWS.S3()
        S3.deleteObject(params, (err) => {
            if (!err) this.setState({objects: this.state.objects.filter(object => object.Key != params.Key)})
            else console.error(`Unable to delete file: ${params.Key}`)
        })
    }

    render() {
        return (
            <div>
                <Upload {...this.state} onAddObject={this.handleUpload} uploadProgress={this.handleUploadProgress} />
                <FileList
                    objects={this.state.objects}
                    deleteObject={Key => {this.handleDeleteObject({...this.state.params, Key})}}
                />
                <LogoutLink />
            </div>
        )
    }

    componentDidMount() {
        getCredentials(this.context.user.username).then(res => {
            const {credentials, region, uploadParams: params, listParams} = JSON.parse(res)
            AWS.config.update({...AWS.config, credentials, region})
            const S3 = new AWS.S3()
            S3.listObjects(listParams, (err, {Contents: objects}) => {
                if (err) this.setState({objects: [err]})
                else this.setState({objects, params, credentials, region})
            })
        })
    }
}
