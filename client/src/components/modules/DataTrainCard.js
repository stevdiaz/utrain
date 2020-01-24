import React, { Component } from 'react';
import './DataTrainCard.css';
import Train from './Train';
import DisplayProgress from './DisplayProgress';

class DataTrainCard extends Component {
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
    onRestartTraining() {
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
            <div className='DataTrainCard-container'>
                <div className='DataTrainCard-step'>
                    Step 2: Train Model
                </div>
                <div className='DataTrainCard-components'>
                    <Train savedData={this.props.savedData} fileURL={this.props.fileURL} inputs={this.props.inputs} outputs={this.props.outputs} isRegression={this.props.isRegression}
                        onFinishTraining={neuralNetwork => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                        types={this.props.types} onEpochEnd={(epoch, loss) => this.onEpochEnd(epoch, loss)}/>
                    <DisplayProgress epoch={this.state.epoch} loss={this.state.loss}/>
                </div>
            </div>
        )
    }
}

export default DataTrainCard;