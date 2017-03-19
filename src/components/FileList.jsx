import File from './File.jsx'

const FileList = ({files, deleteFile}) =>
    <table className="file-list">
        <thead>
            <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {files.map(file => file.Size > 0 ? <File key={file.Key} deleteFile={deleteFile} file={file} /> : null)}
        </tbody>
    </table>

export default FileList
