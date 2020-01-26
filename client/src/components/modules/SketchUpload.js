import React, { Component } from 'react';
import './SketchUpload.css';
import * as html2canvas from 'html2canvas';
import CanvasDraw from "react-canvas-draw";

class SketchUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedClassIndex: 0,
        }
        this.canvasRef = React.createRef();
    }
    componentDidMount() {
        
    }
    componentDidUpdate(prevProps) {
        if (!this.isPredicting && prevProps.classes && this.props.classes && this.state.selectedClassIndex < prevProps.classes.length && this.state.selectedClassIndex >= this.props.classes.length) {
            // our selected class has been deleted
            this.setState({
                selectedClassIndex: this.props.classes.length - 1,
            });
        }
    }
    onCapture() {
        console.log('on capture');
        let canvas = document.getElementById('canvas');
        let canvasdraw = document.getElementsByClassName('canvas-draw')[0];
        console.log(canvasdraw);
        html2canvas(canvasdraw).then(canvasElm => {
            var imageType = 'image/png';
            var imageSrc = canvasElm.toDataURL(imageType);
            console.log(imageSrc);
            this.props.onCapture(imageSrc, this.state.selectedClassIndex);
            this.canvasRef.current.clear();
        });
    }
    onPredict() {
        console.log(document.getElementsByClassName('canvas-draw'));
        let canvasdraw = document.getElementsByClassName('canvas-draw')[0];
        console.log(canvasdraw);
        html2canvas(canvasdraw).then(canvasElm => {
            var imageType = 'image/png';
            var imageSrc = canvasElm.toDataURL(imageType);
            console.log(imageSrc);
            this.props.onPredict(imageSrc);
            this.canvasRef.current.clear();
        });
    }
    onSelectClass(evt) {
        let selectedClassIndex = evt.target.selectedIndex;
        this.setState({
            selectedClassIndex: selectedClassIndex,
        });
    }
    onClearImage() {
        this.canvasRef.current.clear();
    }
    render() {
        let classOptions;
        if (!this.props.isPredicting) {
            classOptions = this.props.classes.map((classification, classIndex) => {return (
                <option value={classification} key={classification + classIndex} selected={this.state.selectedClassIndex === classIndex}>{classification}</option>
            )});
        }
        let trash = (
            <img className='SketchUpload-trash' src={require('../../public/trash.png')} onClick={() => this.onClearImage()} />
        );
        return (
            <div className='SketchUpload-container'>
                {trash}
                <div className='SketchUpload-canvas' id='canvas'>
                    <CanvasDraw
                        brushRadius={4} 
                        lazyRadius={0}
                        canvasWidth={260}
                        canvasHeight={280}
                        hideGrid={true}
                        hideInterface={true}
                        ref={this.canvasRef}
                        id={'canvas-draw'}
                        className={'canvas-draw'}
                    />
                </div>
                {this.props.isPredicting ? (
                    <div className='SketchUpload-captureAndSend'>
                        <div className='SketchUpload-captureButton' onClick={() => this.onPredict()}>Predict</div>
                    </div>
                ):(
                    <div className='SketchUpload-captureAndSend'>
                        <div className='SketchUpload-captureButton' onClick={() => this.onCapture()}>Capture</div>
                        <span> to </span> 
                        <select className='SketchUpload-captureSelect' onChange={(evt) => this.onSelectClass(evt)}>
                            {classOptions}
                        </select>
                    </div>
                )}
            </div>
        )
    }
}
export default SketchUpload;