'use strict'

import React, {Component, PropTypes} from 'react'
import {LogoutLink} from 'react-stormpath'
import {FileManagerFactory} from '../lib'
import {Upload, FileList} from '../components'

export default class FileBrowser extends Component {
    static contextTypes = {
        user: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.handleUploadProgress = this.handleUploadProgress.bind(this)
        this.handleDeleteFile = this.handleDeleteFile.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.state = ({files: []})
        this.fileManager = {}
    }

    handleUploadProgress({key, loaded: Size}) {
        this.setState({
            files: this.state.files.map(file => (file.Key == key) ? {...file, Size} : file)
        })
    }

    handleDeleteFile(params) {
        this.fileManager.deleteFile(params).then(() => {
            this.setState({files: this.state.files.filter(file => file.Key != params.Key)})
        })
    }

    uploadFile(file) {
        const params = {
            ...this.fileManager.uploadParams,
            Body: file,
            Key: this.fileManager.uploadParams.Key + file.name
        }
        this.setState({files: [...this.state.files, {Key: params.Key, Size: 0}]})
        return this.fileManager.uploadFile(params, ({loaded: Size}) => {
            this.setState({files: this.state.files.map(file => (file.Key == params.Key) ? {...file, Size} : file)})
        })
    }

    uploadFiles(event) {
        this.preventDefault(event)
        const files = event.target.files || event.dataTransfer.files
        Object.keys(files).map(key => this.uploadFile(files[key]).catch(err => console.error(err)))
    }

    componentDidMount() {
        FileManagerFactory(this.context.user.username).then(fileManager => {
            this.fileManager = fileManager
            this.fileManager.listFiles().then(files => {
                this.setState({files})
            })
        })
    }

    preventDefault(e) {
        e.preventDefault()
        return false
    }

    render() {
        return (
            <div className="drop-zone"
                 onDragOver={this.preventDefault}
                 onDragEnter={this.preventDefault}
                 onDragLeave={this.preventDefault}
                 onDrop={this.uploadFiles}>
                <Upload uploadFiles={this.uploadFiles} />
                <FileList
                    files={this.state.files}
                    deleteFile={Key => {
                        this.handleDeleteFile({...this.fileManager.deleteParams, Key})
                    }}
                />
                <LogoutLink />
            </div>
        )
    }
}
