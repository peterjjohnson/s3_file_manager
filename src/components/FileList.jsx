import File from './File.jsx'

const FileList = ({objects}) =>
    <ul>
        {objects.map(object => object.Size > 0 ? <File key={object.Key} object={object} /> : null)}
    </ul>

export default FileList
