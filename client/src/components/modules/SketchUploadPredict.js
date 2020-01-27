import React, { Component } from 'react';
import './SketchUploadPredict.css';
import * as html2canvas from 'html2canvas';
import CanvasDraw from "react-canvas-draw";

class SketchUploadPredict extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }
    componentDidMount() {

    }
    onPredict() {
        console.log('on capture');
        let canvas = document.getElementsByClassName('SketchUploadPredict-canvas')[0];
        html2canvas(canvas).then(canvasElm => {
            var imageType = 'image/png';
            var imageSrc = canvasElm.toDataURL(imageType);
            console.log(imageSrc);
            this.props.onPredict(imageSrc);
            this.onClearImage();
        });
    }
    onClearImage() {
        this.canvasRef.current.clear();
    }
    render() {
        let trash = (
            <img className='SketchUploadPredict-trash' src={require('../../public/trash.png')} onClick={() => this.onClearImage()} />
        );
        return (
            <div className='SketchUploadPredict-container'>
                {trash}
                <div className='SketchUploadPredict-canvasOuter' id='canvas'>
                    <CanvasDraw
                        brushRadius={4} 
                        lazyRadius={0}
                        canvasWidth={260}
                        canvasHeight={260}
                        hideGrid={true}
                        hideInterface={true}
                        ref={this.canvasRef}
                        className={'SketchUploadPredict-canvas'}
                    />
                </div>
                <div className='SketchUploadPredict-captureButton' onClick={() => this.onPredict()}>Capture</div>
            </div>
        )
    }
}
export default SketchUploadPredict;
