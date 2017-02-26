import React, {Component} from 'react'

export default class File extends Component {
    render() {
        const name = this.props.object.Key.slice(this.props.object.Key.lastIndexOf('/') + 1)
        return <li>{name} {this.props.object.Size}B</li>
    }
}
