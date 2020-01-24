import React, { Component } from 'react';
import './DataModel.css';
import DataCollectCard from '../modules/DataCollectCard';
import DataTrainCard from '../modules/DataTrainCard';
import DataDeployCard from '../modules/DataDeployCard';
import LoadingScreen from 'react-loading-screen'
import { post, get } from '../../utilities';

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
            savedData: null,
        };
    }
    componentDidMount() {
        if (this.props.name) {
            const body = {
                title: this.props.name,
                type: 'data',
            }
            get('/api/model', body).then((savedData) => {
                console.log('retreived model with name ' + this.props.name);
                this.setState({
                    savedData: savedData,
                });
            });
        }
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
    onRemoval() {
        this.setState({
            isRegression: null,
            inputs: [],
            outputs: [],
            fileURL: null,
            neuralNetwork: null,
            types: {},
        });
    }
    onFinishTraining(neuralNetwork) {
        console.log('updating neural network');
        // not using savedData anymore
        this.setState({
            neuralNetwork: neuralNetwork,
            savedData: null,
        });
    }
    onRestartTraining() {
        this.setState({
            neuralNetwork: null,
        });
    }
    render() {
        return (
            <LoadingScreen
                loading={false}
                bgColor='#f1f1f1'
                spinnerColor='#9ee5f8'
                textColor='#676767'
                logoSrc='/logo.png'
                text='Here an introduction sentence (Optional)'>
                    <div className='DataModel-container'>
                        <DataCollectCard savedData={this.state.savedData} onSelection={(isRegression, inputs, outputs, fileURL, types) => this.onSelection(isRegression, inputs, outputs, fileURL, types)}
                        onRemoval={() => this.onRemoval()}/>
                        <DataTrainCard savedData={this.state.savedData} isRegression={this.state.isRegression} inputs={this.state.inputs} outputs={this.state.outputs} fileURL={this.state.fileURL}
                            onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                            types={this.state.types}/>
                        <DataDeployCard inputs={this.state.inputs} outputs={this.state.outputs} neuralNetwork={this.state.neuralNetwork} types={this.state.types}
                            fileURL={this.state.fileURL} />
                    </div>
                </LoadingScreen>

        )
    }
}

export default DataModel;