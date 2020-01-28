import React, { Component } from 'react';
import './ImagePredict.css';
import ImagePredictUpload from './ImagePredictUpload';
import BarGraph from './BarGraph';
import * as ml5 from 'ml5';
import { post } from '../../utilities';
import SketchUpload from './SketchUpload';

class ImagePredict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confidences: [],
            isWebcam: true,
            imageSrc: null,
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.neuralNetwork === null && this.props.neuralNetwork !== null) {
            let videoElement = document.getElementById('ImagePredictWebcam');
            this.props.neuralNetwork.classify(videoElement, (error, results) => this.onPrediction(error, results));
        }
    }
    onChangeWebcam(isWebcam) {
        console.log(`Changing webcam to ${isWebcam}`)
        this.setState({
            isWebcam: isWebcam,
        }, () => this.makeWebcamPrediction());
    }
    makeWebcamPrediction() {
        if (this.state.isWebcam) {
            let videoElement = document.getElementById('ImagePredictWebcam');
            this.props.neuralNetwork.classify(videoElement, (error, results) => this.onPrediction(error, results, true));
        }
        else {
            // clear bar graph
            this.setState({
                confidences: [],
            });
        }
    }
    onPrediction(error, results, isWebcam) {
        if (error) {
            console.log(error);
        }
        else {
            const classes = results.map(result => result.label);
            const resultsConfidences = results.map(result => Math.round(result.confidence*100));
            let confidences = this.props.classes.map(classification => {
                let confidenceIndex = classes.indexOf(classification);
                return resultsConfidences[confidenceIndex];
            })
            // handle case where users select just one class
            if (confidences.length === 1) {
                confidences = confidences.concat([100 - confidences[0]])
            }
            this.setState({
                confidences: confidences,
            });
            // continue looping
            if (isWebcam) {
                this.makeWebcamPrediction();
            }
        }
    }
    onFileAdded(imageSrc) {
        if (imageSrc === null) {
            // clear bar graph
            this.setState({
                confidences: [],
            });
        }
        else {
            let image = document.getElementById(imageSrc);
            this.makeFilePrediction(image);
        }
    }
    makeFilePrediction(image) {
        this.props.neuralNetwork.classify(image, (error, results) => this.onPrediction(error, results, false));
    }
    render() {
        let predictions;
        if (this.props.neuralNetwork === null) {
            predictions = (
                <div className="ImagePredict-instructions">
                    Finish training your model to make predictions!
                </div>
            )
        }
        else {
            predictions = (
                <div className='ImagePredict-container'>
                    <ImagePredictUpload neuralNetwork={this.props.neuralNetwork} onChangeWebcam={(isWebcam) => this.onChangeWebcam(isWebcam)}
                    onFileAdded={(imageSrc) => this.onFileAdded(imageSrc)}/>
                    <BarGraph classes={this.props.classes.length === 1 ? this.props.classes.concat(['Other']) : this.props.classes} 
                    percentages={this.state.confidences} isImage={true}/>
                </div>
            )
        }
        return predictions;
    }
}

export default ImagePredict;