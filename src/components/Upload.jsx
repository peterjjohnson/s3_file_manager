import React, { Component } from 'react'
import AWS from 'aws-sdk'

export default class Upload extends Component {
    constructor(props) {
        super(props)
        AWS.config.update({
            credentials: props.credentials,
            region: props.region
        })
        this.uploadFile = this.uploadFile.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
    }

    uploadFile(file) {
        return new Promise((resolve, reject) => {
            const params = {
                    Bucket: this.props.params.Bucket,
                    Key: this.props.params.Key + file.name,
                    Body: file,
                    ServerSideEncryption: 'AES256'
                },
                S3 = new AWS.S3()
            this.props.onAddObject({Key: params.Key, Size: file.size})
            S3.putObject(params, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })

    }

    handleUpload(e) {
        Promise.all(Object.keys(e.target.files).map(key => this.uploadFile(e.target.files[key])))
            .then(res => { console.log(JSON.stringify(res, null, 2)) })
            .catch(err => { console.error(err, err.stack) })
    }

    render() {
        return (
            <div id="file-dropzone">
                <input onChange={this.handleUpload} type="file" multiple />
            </div>
        )
    }
}
