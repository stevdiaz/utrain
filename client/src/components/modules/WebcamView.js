import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './WebcamView.css'

class WebcamView extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef();
        this.state = {
            selectedClassIndex: 0,
        }
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
    onCapture() {
        const imageSrc = this.webcamRef.current.getScreenshot();
        console.log(this.state.selectedClassIndex);
        this.props.onCapture(imageSrc, this.state.selectedClassIndex);
    }
    onSelectClass(evt) {
        let selectedClassIndex = evt.target.selectedIndex;
        this.setState({
            selectedClassIndex: selectedClassIndex,
        });
    } 
    render() {
        const videoConstraints = {
            width: 260,
            height: 260,
            facingMode: 'user',
        };
        const classOptions = this.props.classes.map((classification, classIndex) => {return (
            <option value={classification} key={classification + classIndex} selected={this.state.selectedClassIndex === classIndex}>{classification}</option>
        )});
        // add feature where users can make their own class
        return (
            <div className='WebcamView-container'>
                <Webcam
                audio={false}
                height={260}
                width={260}
                ref={this.webcamRef}
                screenshotFormat='image/jpeg'
                videoConstraints={videoConstraints}
                />
                <div className='WebcamView-captureAndSend'>
                    <div className='WebcamView-captureButton' onClick={() => this.onCapture()}>Capture</div>
                    <span> to </span> 
                    <select className='WebcamView-captureSelect' onChange={(evt) => this.onSelectClass(evt)}>
                        {classOptions}
                    </select>
                </div>
            </div>
        )
    }
}

export default WebcamView;