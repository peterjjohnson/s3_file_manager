/**
 * Render an upload link that will open a file browser when clicked
 *
 * @param callback uploadFiles - Method to handle uploads, called on the change event on our file input
 *
 * @returns {XML}
 */
const Upload = ({uploadFiles}) => {
    let _fileUpload

    return (
        <div id="upload-tab" onClick={e => _fileUpload.click(e)}>
            Click&nbsp;
            <div className="fa fa-cloud-upload">
                <input ref={input => _fileUpload = input} id="file-upload" type="file" multiple onChange={uploadFiles} />
            </div>
            &nbsp;or drag and drop files to upload
        </div>
    )
}

export default Upload
