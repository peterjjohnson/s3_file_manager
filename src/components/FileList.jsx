import React, {Component} from 'react'
import File from './File.jsx'

export default class FileList extends Component {
    render() {
        return (
            <ul>
                {
                    this.props.objects.map(object => {
                        if (object.Size > 0) return <File key={object.Key} object={object} />
                    })
                }
            </ul>
        )
    }
}
