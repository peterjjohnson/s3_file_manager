const File = ({file, deleteFile}) =>
    <div className="file-item">
        <span className="fa fa-file"> </span>
        <span className="file-name">{file.Key.slice(file.Key.lastIndexOf('/') + 1)} {file.Size}B</span>
        <span className="file-delete fa fa-trash" onClick={() => { deleteFile(file.Key) }} />
    </div>

export default File
