import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './WebcamTest.css';
import * as ml5 from 'ml5';

class WebcamTest extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            image: null,
            featureExtractor: null,
        }
    }
    componentDidMount() {
        if (this.state.featureExtractor === null) {
            const featureExtractor = ml5.featureExtractor('MobileNet', () => {
                const classifier = featureExtractor.classification(this.webcamRef.current, () => this.videoReady());
                this.setState({
                    featureExtractor: featureExtractor,
                    classifier: classifier,
                });
            });
        }
    }
    videoReady() {
        console.log('video ready!');
    }
    modelLoaded() {
        console.log('model loaded!');
    }
    capture() {
        const imageSrc = this.webcamRef.current.getScreenshot();
        this.setState({
            image: imageSrc,
        });
        // let imgElement = 
        //     <image src={imageSrc} />
        this.state.classifier.addImage('steven', () => this.imageAdded());
        // this.state.classifier.addImage(imgElement, 'steven', () => this.imageAdded());
    }
    imageAdded() {
        console.log('image added!');
        console.log(this.state.classifier);
    }
    train() {
        this.state.classifier.train((lossValue) => {
            console.log(`Loss value is ${lossValue}`);
        });
    }
    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: 'user',
        };
        let image = (<div></div>)
        if (this.state.image === null) {
            image = (
                <div>
                    No image to show!
                </div>
            )
        }
        else {
            image = (
                <img id='image' src={this.state.image} />
            )
        }
        return (
            <div className='WebcamTest-container'>
                <Webcam
                audio={false}
                height={720}
                ref={this.webcamRef}
                screenshotFormat='image/jpeg'
                width={1280}
                videoConstraints={videoConstraints}
                />
                <button onClick={() => this.capture()}>Capture photo</button>
                <button onClick={() => this.train()}>Train </button>
                {image}
            </div>
        )
    }
}
export default WebcamTest;