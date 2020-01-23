import React, { Component } from 'react';
import './ImageDeployCard.css';
import ImagePredict from './ImagePredict';
import Options from './Options';
import { _ } from 'core-js';

class ImageDeployCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        
    }
    render() {
        return (
            <div className={'ImageDeployCard-container'}>
                <div className='ImageDeployCard-step'>
                    Step 3: Use Your Model
                </div>
                <div className='ImageDeployCard-components'>
                    <ImagePredict neuralNetwork={this.props.neuralNetwork} classes={this.props.classes} />
                    <Options neuralNetwork={this.props.neuralNetwork} classes={this.props.classes} images={this.props.images}/>
                </div>
            </div>
        )
    }
}

export default ImageDeployCard;