import React, { Component } from 'react';
import './DrawTest.css';
import CanvasDraw from "react-canvas-draw";
import * as canvas2image from "canvas2image";
import * as html2canvas from 'html2canvas';
import * as ml5 from 'ml5';

class DrawTest extends Component {
    constructor(props) {
        super(props);
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
        let canvas = document.getElementById('button');
        console.log(canvas);
        // let imgSrc = canvas2image.convertToImage(canvas, 400, 400, 'png')
        // console.log(imgSrc);
        html2canvas(canvas).then(canvasElm => {
            var imageType = 'image/png';
            var imageData = canvasElm.toDataURL(imageType);
            console.log(imageData);
        })
    }
    render() {
        return (
            <>
                <CanvasDraw 
                id='stevendiaz'
                canvasWidth={400}
                canvasHeight={400}
                />
                <button id='button' onClick={() => this.onSave()}>Save</button>
            </>
        )
    }
}
export default DrawTest;