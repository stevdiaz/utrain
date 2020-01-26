import React, { Component } from 'react';
import './DrawTest.css';
import CanvasDraw from "react-canvas-draw";
import * as canvas2image from "canvas2image";
import * as html2canvas from 'html2canvas';
import * as ml5 from 'ml5';

class DrawTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc : null,
        };
    }
    componentDidMount() {
        const classifier = ml5.imageClassifier('DoodleNet',() => {
            console.log('classifier loaded');
            const featureExtractor = ml5.featureExtractor('DoodleNet', () => {
                console.log('feature extractor loaded');
                const classifier = featureExtractor.classification();
            });
        });
    }
    modelLoaded() {
        console.log('model has loaded!');
    }
    onSave() {
        let canvas = document.getElementById('stevendiaz');
        console.log(canvas);
        // let imgSrc = canvas2image.convertToImage(canvas, 400, 400, 'png')
        // console.log(imgSrc);
        html2canvas(canvas).then(canvasElm => {
            var imageType = 'image/png';
            var imageData = canvasElm.toDataURL(imageType);
            console.log(imageData);
            this.setState({
                imageSrc: imageData,
            });
        })
    }
    render() {
        return (
            <div className='DrawTest-container'>
                <div className='DrawTest-canvas' id='stevendiaz'>
                    <CanvasDraw 
                        canvasWidth={400}
                        canvasHeight={400}
                        hideGrid={true}
                        hideInterface={true}
                    />
                </div>
                <button id='button' onClick={() => this.onSave()}>Save</button>
                {this.state.imageSrc !== null && (
                    <img src={this.state.imageSrc} />
                )}
            </div>
        )
    }
}
export default DrawTest;