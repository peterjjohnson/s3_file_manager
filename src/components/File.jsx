const File = ({file, deleteFile}) =>
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
                    <i className="file-download fa fa-download" onClick={() => {}} />
                    <i className="file-delete fa fa-trash" onClick={() => { deleteFile(file.Key) }} />
                </div>
                :
                <i className="fa fa-refresh fa-spin fa-fw" />
            }
        </td>
    </tr>

export default File
