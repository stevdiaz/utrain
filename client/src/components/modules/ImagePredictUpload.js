import React, { Component } from 'react';
import './ImagePredictUpload.css';
import ImagePredictWebcam from './ImagePredictWebcam';
import ImagePredictDropzone from './ImagePredictDropzone';
import { select, image } from 'd3';

class ImagePredictUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWebcam: true,
            webcamCount: 2,
        }
    }
    componentDidMount() {
        if (this.state.webcamCount > 0) {
            this.setState(prevState => ({
                isWebcam: !prevState.isWebcam,
                webcamCount: prevState.webcamCount - 1,
            }), () => this.props.onChangeWebcam(this.state.isWebcam));
        }
    }
    componentDidUpdate() {
        if (this.state.webcamCount > 0 && this.props.neuralNetwork !== null) {
            this.setState(prevState => ({
                isWebcam: !prevState.isWebcam,
                webcamCount: prevState.webcamCount - 1,
            }), () => this.props.onChangeWebcam(this.state.isWebcam));
        }
    }
    onFileAdded(imageSrc) {
        this.props.onFileAdded(imageSrc);
    }
    toggleWebcam(isWebcam) {
        this.setState({
            isWebcam: isWebcam,
            webcamCount: isWebcam ? 2 : 0,
        }, () => this.props.onChangeWebcam(this.state.isWebcam));
    }
    render() {
        // return different views depending on webcam / upload 
        let submitType = this.state.isWebcam ? 
        (<ImagePredictWebcam />) :
        (<ImagePredictDropzone onFileAdded={(imageSrc) => this.onFileAdded(imageSrc)} />);
        return(
            <div className='ImagePredictUpload-container'>
                <div className='ImagePredictUpload-tabs'>
                    <button className={`ImagePredictUpload-tab ${this.state.isWebcam ? 'ImagePredictUpload-active' : ''}`} onClick={() => this.toggleWebcam(true)}>Live Photo</button>
                    <button className={`ImagePredictUpload-tab ${!this.state.isWebcam ? 'ImagePredictUpload-active' : ''}`} onClick={() => this.toggleWebcam(false)}>Upload Photo</button>
                </div>
                {submitType}
            </div>
        )
    }
}

export default ImagePredictUpload;