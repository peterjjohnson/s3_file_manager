const File = ({object, deleteObject}) =>
    <div className="file-item">
        <span className="fa fa-file"> </span>
        <span className="file-name">{object.Key.slice(object.Key.lastIndexOf('/') + 1)} {object.Size}B</span>
        <span className="file-delete fa fa-trash" onClick={() => { deleteObject(object.Key) }} />
    </div>

export default File
