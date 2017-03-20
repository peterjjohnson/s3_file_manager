import File from './File.jsx'

/**
 * Render the specified list of files in a table
 *
 * @param array files - The files to display
 * @param callback deleteFile - Callback to pass to each file so that they can be deleted
 */
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
