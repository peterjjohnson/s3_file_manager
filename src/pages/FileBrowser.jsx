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
        this.handleDeleteFile = this.handleDeleteFile.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.state = {loading: true, files:[]}
        this.fileManager = {}
    }

    handleDeleteFile(params) {
        this.fileManager.deleteFile(params).then(() => {
            this.setState({files: this.state.files.filter(file => file.Key != params.Key)})
        })
    }

    uploadFiles(event) {
        this.preventDefault(event)
        const uploadObjects = event.target.files || event.dataTransfer.files,
            files = Object.keys(uploadObjects).map(key => {
                const params = {
                        ...this.fileManager.uploadParams,
                        Body: uploadObjects[key],
                        Key: this.fileManager.uploadParams.Key + uploadObjects[key].name
                    },
                    file = {Key: params.Key, Size: 0, UploadComplete: false}
                return {params, file}
            })

        this.setState({files: [...this.state.files, ...files.map(({file}) => file)]})

        files.map(({params}) => {
            this.fileManager.uploadFile(params, ({loaded: Size, total}) => {
                const UploadComplete = ( total == Size )
                this.setState({files: this.state.files.map(file => (file.Key == params.Key) ? {...file, Size, UploadComplete} : file)})
            }).catch(err => console.error(err))
        })
    }

    componentWillMount() {
        FileManagerFactory(this.context.user.username).then(fileManager => {
            this.fileManager = fileManager
            this.setState({loading: true})
            this.fileManager.listFiles().then(files => {
                this.setState({files: files.map(file => { return {...file, UploadComplete: true} }), loading: false});
            })
        })
    }

    preventDefault(e) {
        e.preventDefault()
        return false
    }

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
                {(loading) ?
                    <i className="loading fa fa-5x fa-spinner fa-pulse fa-fw" aria-hidden="true"></i> :
                    <div>
                        <Upload uploadFiles={this.uploadFiles} />
                        <FileList
                            files={files}
                            deleteFile={Key => {
                                this.handleDeleteFile({...this.fileManager.deleteParams, Key})
                            }}
                        />
                    </div>
                }
            </div>
        )
    }
}
