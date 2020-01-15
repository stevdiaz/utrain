import React, { Component } from 'react';
import './DataTrainCard.css';
import Train from './Train';
import DisplayProgress from './DisplayProgress';

class DataTrainCard extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    onFinishTraining(neuralNetwork) {
        this.props.onFinishTraining(neuralNetwork);
    }
    onRestartTraining(neuralNetwork) {
        this.props.onRestartTraining();
    }
    render() {
        return (
            <div className='DataTrainCard-container'>
                <Train fileURL={this.props.fileURL} inputs={this.props.inputs} outputs={this.props.outputs} isRegression={this.props.isRegression}
                    onFinishTraining={neuralNetwork => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                    types={this.props.types}/>
                <DisplayProgress />
            </div>
        )
    }
}

export default DataTrainCard;