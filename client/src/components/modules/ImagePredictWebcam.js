import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './ImagePredictWebcam.css'

class ImagePredictWebcam extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            
        }
    }
    componentDidMount() {

    }
    componentDidUpdate() {
        
    }
    render() {
        const videoConstraints = {
            width: 260,
            height: 260,
            facingMode: 'user',
        };
        return (
            <div className='ImagePredictWebcam-container'>
                <Webcam
                id='ImagePredictWebcam'
                audio={false}
                height={260}
                width={260}
                ref={this.webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={videoConstraints}
                mirrored='true'
                />
            </div>
        )
    }
}

export default ImagePredictWebcam;