/**
 * Display the specified file as a table row
 *
 * @param object file - The file we are displaying
 * @param callback deleteFile - Callback method to trigger when we want to delete this file
 */
const File = ({file, deleteFile, downloadFile}) =>
    <tr className="file-item">
        <td className="file-name">
            <i className="fa fa-file file-icon" />
            {file.Key.slice(file.Key.lastIndexOf('/') + 1)}
        </td>
        <td className="file-size">
            {file.Size}B
        </td>
        <td className="file-actions">
            {(file.UploadComplete) ?
                <div>
                    <i className="file-download fa fa-download" onClick={() => { downloadFile(file.Key) }} />
                    <i className="file-delete fa fa-trash" onClick={() => { deleteFile(file.Key) }} />
                </div>
                :
                <i className="fa fa-refresh fa-spin fa-fw" />
            }
        </td>
    </tr>

export default File
