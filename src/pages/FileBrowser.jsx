'use strict'

import React, {Component, PropTypes} from 'react'
import {LogoutLink} from 'react-stormpath'
import {FileManagerFactory} from '../lib'
import {Upload, FileList} from '../components'

/**
 * FileBrowser class
 */
export default class FileBrowser extends Component {
    // Give us access to the user object for the logged in user
    static contextTypes = {
        user: PropTypes.object
    }

    /**
     * Initialise the instance
     *
     * @param object props - Component props
     */
    constructor(props) {
        super(props)
        this.handleDeleteFile = this.handleDeleteFile.bind(this)
        this.handleDownloadFile = this.handleDownloadFile.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.state = {loading: true, files:[]}
        this.fileManager = {}
    }

    /**
     * Handle file deletes
     *
     * @param object params - S3 params (must include Bucket and Key)
     */
    handleDeleteFile(params) {
        this.fileManager.deleteFile(params).then(() => {
            this.setState({files: this.state.files.filter(file => file.Key != params.Key)})
        })
    }

    /**
     * Handle file download requests
     *
     * @param object params - S3 params (must include Bucket and Key)
     */
    handleDownloadFile(params) {
        this.fileManager.downloadFile(params).then(url => {
            location.href = url
        })
    }

    /**
     * Handle file uploads
     *
     * @param object event - The event that initiated this callback (was it a click or a drag/drop?)
     */
    uploadFiles(event) {
        this.preventDefault(event)
        const uploadObjects = event.target.files || event.dataTransfer.files,
            // Extract and format the files from the event
            files = Object.keys(uploadObjects).map(key => {
                const params = {
                        ...this.fileManager.uploadParams,
                        Body: uploadObjects[key],
                        Key: this.fileManager.uploadParams.Key + uploadObjects[key].name
                    },
                    file = {Key: params.Key, Size: 0, UploadComplete: false}
                return {params, file}
            })

        // Add all the new files to the file list
        this.setState({files: [...this.state.files, ...files.map(({file}) => file)]})

        // Iterate through the new files and send them up to S3
        files.map(({params}) => {
            this.fileManager.uploadFile(params, ({loaded: Size, total}) => {
                const UploadComplete = ( total == Size )
                this.setState({files: this.state.files.map(file => (file.Key == params.Key) ? {...file, Size, UploadComplete} : file)})
            }).catch(err => console.error(err))
        })
    }

    /**
     * Before we render, let's set up our FileManager and grab our file list from S3
     */
    componentWillMount() {
        FileManagerFactory(this.context.user.username).then(fileManager => {
            this.fileManager = fileManager
            this.setState({loading: true})
            this.fileManager.listFiles().then(files => {
                this.setState({files: files.map(file => { return {...file, UploadComplete: true} }), loading: false});
            })
        })
    }

    /**
     * Don't do anything.
     *
     * @param object e - The event to cancel
     *
     * @returns {boolean}
     */
    preventDefault(e) {
        e.preventDefault()
        return false
    }

    /**
     * Render our FileBrowser component
     *
     * @returns {XML}
     */
    render() {
        const {files, loading} = this.state
        return (
            <div className="drop-zone"
                 onDragOver={this.preventDefault}
                 onDragEnter={this.preventDefault}
                 onDragLeave={this.preventDefault}
                 onDrop={this.uploadFiles}>
                <div className="user-controls">
                    <LogoutLink />
                </div>
                { // See if we're still loading and display a spinner until we're done
                    (loading) ?
                    <i className="loading fa fa-5x fa-spinner fa-pulse fa-fw" aria-hidden="true" /> :
                    <div>
                        <Upload uploadFiles={this.uploadFiles} />
                        <FileList
                            files={files}
                            deleteFile={Key => {
                                this.handleDeleteFile({...this.fileManager.deleteParams, Key})
                            }}
                            downloadFile={Key => {
                                this.handleDownloadFile({...this.fileManager.deleteParams, Key})
                            }}
                        />
                    </div>
                }
            </div>
        )
    }
}
