import File from './File.jsx'

const FileList = ({files, deleteFile}) =>
    <div className="file-list">
        {files.map(file => file.Size > 0 ? <File key={file.Key} deleteFile={deleteFile} file={file} /> : null)}
    </div>

export default FileList
