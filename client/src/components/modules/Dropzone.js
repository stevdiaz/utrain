import React, { Component } from 'react'
import "./Dropzone.css"

class Dropzone extends Component {
    constructor(props) {
        super(props)
        this.fileInputRef = React.createRef();
        this.state = { highlight: false };
    }
    componentDidMount() {

    }
    openFileDialog() {
        if (this.props.disabled) {
            return;
        }
        this.fileInputRef.current.click();
    }
    onFilesAdded(evt) {
        console.log('file being added');
        console.log(evt);
        if (this.props.disabled) {
            return;
        }
        const files = evt.target.files;
        if (this.props.onFileAdded) {
            // only take first file
            const firstFile = this.fileListToOne(files);
            this.props.onFileAdded(firstFile);
        }
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
        if (this.props.onFileAdded) {
            const firstFile = this.fileListToOne(files);
            this.props.onFileAdded(firstFile);
        }
        this.setState({ highlight: false });
    }
    render() {
        return (
            <div 
                className={`Dropzone-container ${this.state.highlight ? "Dropzone-highlight" : ""}`}
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
                className="Dropzone-icon"
                src={require("../../public/file-upload.png")}
                />
                <input
                    ref={this.fileInputRef}
                    className="Dropzone-fileInput"
                    type="file"
                    accept='.csv'
                    onChange={(evt) => {
                        this.onFilesAdded(evt);
                    }}
                    on
                />
                <span className='Dropzone-instructions'>Upload CSV File</span>
            </div>
        );
    }
}

export default Dropzone;
