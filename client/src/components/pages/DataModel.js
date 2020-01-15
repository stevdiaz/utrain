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
            types: {},
        };
    }
    componentDidMount() {

    }
    onSelection(isRegression, inputs, outputs, fileURL, types) {
        this.setState({
            isRegression: isRegression,
            inputs: inputs,
            outputs: outputs,
            fileURL: fileURL,
            types: types,
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
                <DataCollectCard onSelection={(isRegression, inputs, outputs, fileURL, types) => this.onSelection(isRegression, inputs, outputs, fileURL, types)}/>
                <DataTrainCard isRegression={this.state.isRegression} inputs={this.state.inputs} outputs={this.state.outputs} fileURL={this.state.fileURL}
                    onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                    types={this.state.types}/>
                <DataDeployCard inputs={this.state.inputs} outputs={this.state.outputs} neuralNetwork={this.state.neuralNetwork} types={this.state.types}/>
            </div>
        )
    }
}

export default DataModel;