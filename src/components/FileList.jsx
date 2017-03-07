import File from './File.jsx'

const FileList = ({objects, deleteObject}) =>
    <div className="file-list">
        {objects.map(object => object.Size > 0 ? <File key={object.Key} object={object} deleteObject={deleteObject} /> : null)}
    </div>

export default FileList
