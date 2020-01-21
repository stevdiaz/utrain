import React, { Component } from 'react'
import "./ImageDropzone.css"

class ImageDropzone extends Component {
    constructor(props) {
        super(props)
        this.fileInputRef = React.createRef();
        this.state = {
            highlight: false,
            fileArray: null,
            selectedClassIndex: 0,
         };
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        if (this.state.selectedClassIndex < prevProps.classes.length && this.state.selectedClassIndex >= this.props.classes.length) {
            // our selected class has been deleted
            this.setState({
                selectedClassIndex: this.props.classes.length - 1,
            });
        }
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
        const fileArray = this.fileListToArray(files);
        this.setState({
            fileArray: fileArray,
        })
        evt.target.value = '';
    }
    fileListToArray(fileList) {
        let array = [];
        for (let i = 0; i < fileList.length; i++) {
            array.push(fileList.item(i));
        }
        return array;
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
        const fileArray = this.fileListToArray(files);
        this.setState({
            fileArray: fileArray,
            highlight: false,
        })
    }
    onSelectClass(evt) {
        let selectedClassIndex = evt.target.selectedIndex;
        this.setState({
            selectedClassIndex: selectedClassIndex,
        });
    }
    onUpload() {
        if (this.state.fileArray === null) {
            return;
        }
        else {
            this.props.onFilesAdded(this.state.fileArray, this.state.selectedClassIndex);
            this.setState({
                fileArray: null,
            });
        }
    } 
    render() {
        const classOptions = this.props.classes.map((classification, classIndex) => {return (
            <option value={classification} key={classification + classIndex} selected={this.state.selectedClassIndex === classIndex}>{classification}</option>
        )});
        return (
            <div className='ImageDropzone-outerContainer'>
                <div 
                    className={`ImageDropzone-container ${this.state.highlight ? "ImageDropzone-highlight" : ""}`}
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
                    className="ImageDropzone-icon"
                    src={require("../../public/file-upload.png")}
                    />
                    <input
                        ref={this.fileInputRef}
                        className="ImageDropzone-fileInput"
                        type="file"
                        accept='image/*'
                        onChange={(evt) => {
                            this.onFilesAdded(evt);
                        }}
                        multiple
                    />
                    <span className='ImageDropzone-instructions'>
                        {this.state.fileArray === null ? 'Choose Images' : `Upload ${this.state.fileArray.length} image${this.state.fileArray.length > 1 ? 's' : ''}`}
                    </span>
                </div>
                <div className='ImageDropzone-captureAndSend'>
                    <div className={`ImageDropzone-uploadButton ${this.state.fileArray === null ? 'ImageDropzone-uploadButtonDisabled' : ''}`} 
                    onClick={() => this.onUpload()}>Upload</div>
                    <span> to </span> 
                    <select className='ImageDropzone-uploadSelect' onChange={(evt) => this.onSelectClass(evt)}>
                        {classOptions}
                    </select>
                </div>
            </div>
        );
    }
}

export default ImageDropzone;
