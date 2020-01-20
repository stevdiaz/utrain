import React, { Component } from 'react';
import './ImageUpload.css';
import WebcamView from './WebcamView';
import ImageDropzone from './ImageDropzone';
import { select } from 'd3';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWebcam: true,
        }
    }
    componentDidMount() {

    }
    onCapture(imageSrc, selectedClassIndex) {
        this.props.onCapture(imageSrc, selectedClassIndex);
    }
    onFilesAdded(files, selectedClassIndex) {
        let objectURLs = files.map(file => window.URL.createObjectURL(file));
        this.props.onFilesAdded(objectURLs, selectedClassIndex);
    }
    toggleWebcam(isWebcam) {
        this.setState({
            isWebcam: isWebcam,
        });
    }
    render() {
        // return different views depending on webcam / upload 
        let submitType = this.state.isWebcam ? 
        (<WebcamView onCapture={(imageSrc, selectedClassIndex) => this.onCapture(imageSrc, selectedClassIndex)} classes={this.props.classes} />) :
        (<ImageDropzone onFilesAdded={(files, selectedClassIndex) => this.onFilesAdded(files, selectedClassIndex)} classes={this.props.classes} />);
        return(
            <div className='ImageUpload-container'>
                <div className='ImageUpload-tabs'>
                    <button className={`ImageUpload-tab ${this.state.isWebcam ? 'ImageUpload-active' : ''}`} onClick={() => this.toggleWebcam(true)}>Take Photos</button>
                    <button className={`ImageUpload-tab ${!this.state.isWebcam ? 'ImageUpload-active' : ''}`} onClick={() => this.toggleWebcam(false)}>Upload Photos</button>
                </div>
                {submitType}
            </div>
        )
    }
}

export default ImageUpload;