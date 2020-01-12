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
        if (this.props.disabled) {
            return;
        }
        const files = evt.target.files;
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
    }
    fileListToArray (fileList) {
        const array = [];
        for (var i = 0; i < fileList.length; i++) {
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
        if (this.props.onFilesAdded) {
            const array = this.fileListToArray(files);
            this.props.onFilesAdded(array);
        }
        this.setState({ highlight: false });
    }
    render() {
        return (
            <div 
                className={`Dropzone ${this.state.highlight ? "Highlight" : ""}`}
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
                className="Icon"
                src={require("../../public/file-upload.png")}
                />
                <input
                    ref={this.fileInputRef}
                    className="FileInput"
                    type="file"
                    multiple
                    onChange={(evt) => {
                        this.onFilesAdded(evt);
                    }}
                />
                <span>Choose a CSV file to use, or drag & drop here</span>
            </div>
        );
    }
}

export default Dropzone;
