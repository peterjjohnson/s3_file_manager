import React, { Component } from 'react'
import AWS from 'aws-sdk'

export default class Upload extends Component {
    constructor(props) {
        super(props)
        const {credentials, region} = props;
        AWS.config.update({...AWS.config, credentials, region})
        this.uploadFile = this.uploadFile.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.handleClick = this.handleClick.bind(this)
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
            this.props.onAddObject({Key: params.Key, Size: 0})
            S3.putObject(params, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            }).on('httpUploadProgress', progress => { this.props.uploadProgress(progress, params.Key) })
        })

    }

    handleUpload(e) {
        e.preventDefault()
        const files = e.target.files || e.dataTransfer.files
        Promise.all(Object.keys(files).map(key => this.uploadFile(files[key])))
            .then(res => { console.log(JSON.stringify(res, null, 2)) })
            .catch(err => { console.error(err, err.stack) })
    }

    handleClick(e) {
        const {_fileUpload} = this.refs
        _fileUpload.click(e);
    }

    preventDefault(e) {
        e.preventDefault()
    }

    render() {
        return (
            <div id="file-dropzone" className="fa fa-cloud-upload" onClick={this.handleClick} onDragOver={this.preventDefault} onDragEnter={this.preventDefault} onDrop={this.handleUpload}>
                <input ref="_fileUpload" id="file-upload" type="file" multiple onChange={this.handleUpload} />
            </div>
        )
    }
}
