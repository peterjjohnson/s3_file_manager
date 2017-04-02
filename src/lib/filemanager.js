'use strict'

import AWS from 'aws-sdk'

/**
 * Create and return an instance of FileManager for the specified user
 *
 * @param string user - User requesting access
 *
 * @returns {Promise}
 */
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

/**
 * Class to handle all client-side communication with S3
 */
class FileManager {

    /**
     * Initialise the instance using the specified config
     *
     * @param object config - Object containing config details provided by our /credentials endpoint
     */
    constructor(config) {
        Object.keys(config).map(key => { this[key] = config[key] })
        AWS.config.update({credentials: this.credentials, region: this.region})
        this.S3 = new AWS.S3()
    }

    /**
     * Return a file list
     *
     * @returns {Promise}
     */
    listFiles() {
        return new Promise((resolve, reject) => {
            this.S3.listObjects(this.listParams, (err, {Contents: files}) => err ? reject(err) : resolve(files))
        })
    }

    /**
     * Upload a file
     *
     * @param object params - S3 upload params (must include Body, Key and Bucket)
     * @param progressHandler
     *
     * @returns {Promise}
     */
    uploadFile(params, progressHandler) {
        return new Promise((resolve, reject) => {
            const uploadRequest = this.S3.putObject(params)
            uploadRequest.on('httpUploadProgress', progress => {
                progressHandler(progress, params.Key)
            })
            uploadRequest.send((err, file) => err ? reject(err) : resolve(file))
        })
    }

    /**
     * Delete a file
     *
     * @param object params - S3 delete params (must include Key and Bucket)
     *
     * @returns {Promise}
     */
    deleteFile(params) {
        return new Promise((resolve, reject) => {
            this.S3.deleteObject(params, err => err ? reject(err) : resolve())
        })
    }

    downloadFile(params) {
        return new Promise((resolve, reject) => {
            this.S3.getSignedUrl('getObject', {...params, Expires: 60}, (err, url) => err ? reject(err) : resolve(url))
        })
    }
}

export default FileManagerFactory
