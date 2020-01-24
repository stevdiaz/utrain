import React, { Component } from 'react';
import './Train.css';
import * as ml5 from 'ml5';
import * as d3 from 'd3';

class Train extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGettingReady: false,
            isTraining: false,
            isFinishedTraining: false,
            epochs: 20,
            batchSize: 32,
            onEpoch: 0,
            isUsingSaved: false,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.inputs !== this.props.inputs || prevProps.outputs !== this.props.outputs ||
            prevProps.fileURL !== this.props.fileURL || prevProps.isRegression !== this.props.isRegression) {
                this.clearFields();
        }
        if (this.props.fileURL !== null && this.props.inputs.length !== 0 && this.props.outputs.length !== 0 && this.props.isRegression !== null &&
            this.props.savedData !== null && !this.state.isUsingSaved) {
                this.setState({
                    epochs: this.props.savedData.epochs,
                    batchSize: this.props.savedData.batchSize,
                    isUsingSaved: true,
                }, () => this.startModel());
        }
    }

    startModel() {
        this.setState({
            isGettingReady: true,
        });
        const epochs = Number(this.state.epochs);
        const batchSize = Number(this.state.batchSize);
        const nnOptions = {
            inputs: this.props.inputs,
            outputs: this.props.outputs,
            task: this.props.isRegression ? 'regression' : 'classification',
            debug: false,
            epochs: epochs,
            batchSize: batchSize,
        }
        // initialize the neural network
        let neuralNetwork = ml5.neuralNetwork(nnOptions);

        this.setState({
            isGettingReady: true,
            neuralNetwork: neuralNetwork,
        });

        //add in data
        d3.csv(this.props.fileURL).then(values => {
            values.forEach(value => {
                const x = this.props.inputs.map(input => {
                    return this.props.types[input] === 'N' ? Number(value[input]) : value[input];
                });
                const y = this.props.outputs.map(output => {
                    return this.props.types[output] === 'N' ? Number(value[output]) : value[output];
                });
                
                neuralNetwork.addData(x, y);
            })
            neuralNetwork.normalizeData();
            this.trainModel(epochs, batchSize);
        })
    }
    startModelAgain() {
        this.clearFields();
        this.startModel();
    }
    whileTraining(epochs, loss) {
        // epochs are zero-indexed, add by 1
        this.setState({
            onEpoch: epochs + 1,
        });
        this.props.onEpochEnd(epochs + 1, loss);
    }
    finishedTraining() {
        console.log('finished training!');
        this.setState({isFinishedTraining: true});
        this.props.onFinishTraining(this.state.neuralNetwork);
    }
    trainModel(epochs, batchSize) {
        console.log(this.state.neuralNetwork);
        this.setState({
            isTraining: true,
        });
        let trainOptions = {
            epochs: epochs,
            batchSize: batchSize,
        };
        let whileTraining = (epochs, loss) => {
            this.whileTraining(epochs, loss.val_loss);
        }
        let finishedTraining = () => {
            this.finishedTraining();
        }
        this.state.neuralNetwork.train(trainOptions, whileTraining, finishedTraining);
    }
    clearFields() {
        if (this.state.isGettingReady || this.state.isTraining || this.state.isFinishedTraining) {
            this.setState({
                isGettingReady: false,
                isTraining: false,
                isFinishedTraining: false,
                onEpoch: 0,
            })
            this.props.onRestartTraining();
        }
    }
    handleEpochChange(evt) {
        this.setState({
            epochs: evt.target.value,
        });
    }
    handleEpochLoseFocus(evt) {
        if (evt.target.value === '') {
            this.setState({
                epochs: 0,
            });
        } 
    }
    handleBatchSizeChange(evt) {
        this.setState({
            batchSize: evt.target.value,
        });
    }
    render() {
        let trainButton;
        let advancedInputs = (
            <div className='Train-advanced'>
                Advanced Features
                <div className='Train-epochs'>
                    Epochs:
                    <input className='Train-epochsInput' type='number' value={this.state.epochs} onChange={(evt) => this.handleEpochChange(evt)} onBlur={(evt) => this.handleEpochLoseFocus(evt)}/>
                </div>
                <div className='Train-batchSize'>
                    Batch Size:
                    <select className='Train-batchSizeInput' id='batchSizeList' onChange={(evt) => this.handleBatchSizeChange(evt)}>
                        <option value='16'>16</option>
                        <option value='32' selected>32</option>
                        <option value='64'>64</option>
                        <option value='128'>128</option>
                        <option value='256'>256</option>
                    </select>
                </div>
            </div>
        )
        if (this.props.fileURL === null || this.props.inputs.length === 0 || this.props.outputs.length === 0 || this.props.isRegression === null) {
            trainButton = (
                <span className='Train-noButton'>
                    Finish selecting your data options to train your model!
                </span>
            )
        }
        else if (this.state.isFinishedTraining) {
            trainButton = (
                <div>
                    <button className='Train-button' type='button' onClick={(evt) => this.startModelAgain()}> Re-Train </button>
                    <div className='Train-trainingHidden'>
                        Finished!
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        else if (this.state.isTraining) {
            trainButton = (
                <div>
                    <button className='Train-buttonDisabled' type='button' disabled='disabled'> Train </button>
                    <div className='Train-training'>
                        Training ... (Epoch {this.state.onEpoch} of {this.state.epochs})
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        else if (this.state.isGettingReady) {
            trainButton = (
                <div>
                    <button className='Train-buttonDisabled' type='button' disabled='disabled'> Train </button>
                    <div className='Train-training'>
                        Preparing data ...
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        else {
            trainButton = (
                <div>
                    <button className='Train-button' type='button' onClick={(evt) => this.startModel()} > Train </button>
                    <div className='Train-trainingHidden'>
                        Training the model ...
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        return (
            <div className='Train-container'>
                {trainButton}
            </div>
        )
    }
}

export default Train;