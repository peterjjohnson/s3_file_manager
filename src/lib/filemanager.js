'use strict'

import AWS from 'aws-sdk'

const FileManagerFactory = user => {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('GET', '/credentials?user=' + user)

        req.addEventListener('load', function() {
            resolve(new FileManager(JSON.parse(this.responseText)))
        })

        req.addEventListener('error', err => reject(err))

        req.send()
    })
}

class FileManager {
    constructor(config) {
        Object.keys(config).map(key => { this[key] = config[key] })
        AWS.config.update({credentials: this.credentials, region: this.region})
        this.S3 = new AWS.S3()
    }

    listFiles() {
        return new Promise((resolve, reject) => {
            this.S3.listObjects(this.listParams, (err, {Contents: files}) => err ? reject(err) : resolve(files))
        })
    }

    uploadFile(params, progressHandler) {
        return new Promise((resolve, reject) => {
            const uploadRequest = this.S3.putObject(params)
            uploadRequest.on('httpUploadProgress', progress => {
                progressHandler(progress, params.Key)
            })
            uploadRequest.send((err, file) => err ? reject(err) : resolve(file))
        })
    }

    deleteFile(params) {
        return new Promise((resolve, reject) => {
            this.S3.deleteObject(params, err => err ? reject(err) : resolve())
        })
    }
}

export default FileManagerFactory
