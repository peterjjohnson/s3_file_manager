const File = ({object}) => <li>{object.Key.slice(object.Key.lastIndexOf('/') + 1)} {object.Size}B</li>

export default File
