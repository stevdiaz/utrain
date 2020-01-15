import React, { Component } from 'react';
import './DataModel.css';
import DataCollectCard from '../modules/DataCollectCard';
import DataTrainCard from '../modules/DataTrainCard';
import DataDeployCard from '../modules/DataDeployCard';

class DataModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegression: null,
            inputs: [],
            outputs: [],
            fileURL: null,
            neuralNetwork: null,
        };
    }
    componentDidMount() {

    }
    onSelection(isRegression, inputs, outputs, fileURL) {
        this.setState({
            isRegression: isRegression,
            inputs: inputs,
            outputs: outputs,
            fileURL: fileURL,
        });
    }
    onFinishTraining(neuralNetwork) {
        console.log('updating neural network');
        this.setState({
            neuralNetwork: neuralNetwork,
        });
    }
    onRestartTraining() {
        this.setState({
            neuralNetwork: null,
        });
    }
    render() {
        return (
            <div className='DataModel-container'>
                <DataCollectCard onSelection={(isRegression, inputs, outputs, fileURL) => this.onSelection(isRegression, inputs, outputs, fileURL)}/>
                <DataTrainCard isRegression={this.state.isRegression} inputs={this.state.inputs} outputs={this.state.outputs} fileURL={this.state.fileURL}
                    onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}/>
                <DataDeployCard inputs={this.state.inputs} outputs={this.state.outputs} neuralNetwork={this.state.neuralNetwork} />
            </div>
        )
    }
}

export default DataModel;