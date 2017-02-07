import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Main extends Component {
    render() {
        return (
            <div>
                TODO: Build components for to go here
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(<Main />, document.getElementById('s3-file-manager'));
}

render();
