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
            webcamCount: 0,
        }
    }
    componentDidMount() {

    }
    componentDidUpdate() {
        if (this.state.webcamCount > 0 && this.props.neuralNetwork !== null) {
            this.setState(prevState => ({
                isWebcam: !prevState.isWebcam,
                webcamCount: prevState.webcamCount - 1,
            }));
        }
    }
    onCapture(imageSrc, selectedClassIndex) {
        this.props.onCapture(imageSrc, selectedClassIndex);
    }
    onFilesAdded(files, selectedClassIndex) {
        var readers = files.map(file => {
            let reader = new FileReader();
            reader.onload = (event) => {
                const imageSrc = event.target.result;
                this.props.onFilesAdded([imageSrc], selectedClassIndex);
            }
            return reader;
        });
        files.forEach((file, fileIndex) => readers[fileIndex].readAsDataURL(file));
    }
    toggleWebcam(isWebcam) {
        this.setState({
            isWebcam: isWebcam,
            webcamCount: isWebcam ? 2 : 0,
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