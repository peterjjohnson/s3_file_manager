const Upload = ({uploadFiles}) => {
    let _fileUpload

    return (
        <div className="fa fa-cloud-upload" onClick={e => _fileUpload.click(e)}>
            <input ref={input => _fileUpload = input} id="file-upload" type="file" multiple onChange={uploadFiles} />
        </div>
    )
}

export default Upload
