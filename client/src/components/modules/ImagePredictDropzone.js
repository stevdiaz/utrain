import React, { Component } from 'react'
import "./ImagePredictDropzone.css"

class ImagePredictDropzone extends Component {
    constructor(props) {
        super(props)
        this.fileInputRef = React.createRef();
        this.state = {
            highlight: false,
            imageSrc: null,
         };
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        
    }
    openFileDialog() {
        if (this.props.disabled) {
            return;
        }
        this.fileInputRef.current.click();
    }
    onFilesAdded(evt) {
        if (this.props.disabled) {
            return;
        }
        const files = evt.target.files;
        const imageFile = this.fileListToOne(files);
        this.sendImageFile(imageFile);
        evt.target.value = '';
    }
    fileListToOne(fileList) {
        return fileList.item(0);
    }
    onDragOver(evt) {
        evt.preventDefault();
        if (this.props.disabled) {
            return;
        }
        this.setState({ highlight: true });
    }
    onDragLeave(evt) {
        this.setState({ highlight: false });
    }
    onDrop(evt) {
        evt.preventDefault();
        if (this.props.disabled) {
            return;
        }
        const files = evt.dataTransfer.files;
        const imageFile = this.fileListToOne(files);
        this.sendImageFile(imageFile);
    }
    sendImageFile(imageFile) {
        var reader = new FileReader();

        reader.onload = (event) => {
            const imageSrc = event.target.result;
            this.setState({
                imageSrc: imageSrc,
                highlight: false,
            }, () => this.props.onFileAdded(imageSrc))
        }
        
        reader.readAsDataURL(imageFile);
    }
    onChangeImage() {
        this.setState({
            imageSrc: null,
        })
        this.props.onFileAdded(null);
    }
    render() {
        let uploadImage;
        if (this.state.imageSrc === null) {
            // no image yet
            uploadImage = (
                <div 
                    className={`ImagePredictDropzone-container ${this.state.highlight ? "ImagePredictDropzone-highlight" : ""}`}
                    onClick={() => {
                        this.openFileDialog();
                    }}
                    onDragOver={(evt) => {
                        this.onDragOver(evt);
                    }}
                    onDragLeave={(evt) => {
                        this.onDragLeave(evt);
                    }}
                    onDrop={(evt) => {
                        this.onDrop(evt);
                    }}
                    style={{cursor: this.props.disabled ? 'default' : 'pointer'}} >
                    <img
                    alt="upload"
                    className="ImagePredictDropzone-icon"
                    src={require("../../public/file-upload.png")}
                    />
                    <input
                        ref={this.fileInputRef}
                        className="ImagePredictDropzone-fileInput"
                        type="file"
                        accept='image/*'
                        onChange={(evt) => {
                            this.onFilesAdded(evt);
                        }}
                    />
                    <span className='ImagePredictDropzone-instructions'>
                        Choose Image
                    </span>
                </div>
            )
        }
        else {
            uploadImage = (
                <div className='ImagePredictDropzone-imageContainer'>
                    <div className='ImagePredictDropzone-container ImagePredictDropzone-containerNoDash'>
                        <img className='ImagePredictDropzone-image' src={this.state.imageSrc} id={this.state.imageSrc} />
                    </div>
                    <div className='ImagePredictDropzone-uploadButton' onClick={(evt) => this.onChangeImage()}>Upload Another</div>
                </div>
            )
        }
        return (
            <div className='ImagePredictDropzone-outerContainer'>
                {uploadImage}
            </div>
        );
    }
}

export default ImagePredictDropzone;
