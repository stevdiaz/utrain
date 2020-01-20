import React, { Component } from 'react';
import './ImageTrainCard.css';
import ImageTrain from './ImageTrain';
import DisplayProgress from './DisplayProgress';

class ImageTrainCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            epoch: null,
            loss: null,
        }
    }
    componentDidMount() {

    }
    onFinishTraining(neuralNetwork) {
        this.props.onFinishTraining(neuralNetwork);
    }
    onRestartTraining(neuralNetwork) {
        this.props.onRestartTraining();
        this.setState({
            epoch: null,
            loss: null,
        });
    }
    onEpochEnd(epoch, loss) {
        this.setState({
            epoch: epoch,
            loss: loss,
        });
    }
    render() {
        return (
            <div className='ImageTrainCard-container'>
                <div className='ImageTrainCard-step'>
                    Step 2: Train Model
                </div>
                <div className='ImageTrainCard-components'>
                    <ImageTrain onFinishTraining={neuralNetwork => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                    onEpochEnd={(epoch, loss) => this.onEpochEnd(epoch, loss)} classes={this.props.classes} images={this.props.images}/>
                    <DisplayProgress epoch={this.state.epoch} loss={this.state.loss}/>
                </div>
            </div>
        )
    }
}

export default ImageTrainCard;