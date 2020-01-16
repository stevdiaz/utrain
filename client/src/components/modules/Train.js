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
            batchSize: 16,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.inputs !== this.props.inputs || prevProps.outputs !== this.props.outputs ||
            prevProps.fileURL !== this.props.fileURL || prevProps.isRegression !== this.props.isRegression) {
                this.clearFields();
        }
    }

    startModel() {
        let nnOptions = {
            inputs: this.props.inputs,
            outputs: this.props.outputs,
            task: this.props.isRegression ? 'regression' : 'classification',
            debug: false,
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
            this.trainModel();
        })
    }
    startModelAgain() {
        this.clearFields();
        this.startModel();
    }
    whileTraining(epochs, loss) {
        //do something
        console.log("Epochs: " + epochs);
        console.log("Loss: " + loss);
        console.log(loss);
        this.props.onEpochEnd(epochs, loss);
    }
    finishedTraining() {
        console.log('finished training!');
        console.log(this.state.neuralNetwork);
        //do something
        this.setState({isFinishedTraining: true});
        this.props.onFinishTraining(this.state.neuralNetwork);
    }
    trainModel() {
        console.log(this.state.neuralNetwork);
        this.setState({
            isTraining: true,
        });
        let trainOptions = {
            epochs: this.state.epochs,
            batchSize: this.state.batchSize,
        };
        let whileTraining = (epochs, loss) => {
            this.whileTraining(epochs, loss);
        }
        let finishedTraining = () => {
            this.finishedTraining();
        }
        this.setState({isTraining: true})
        this.state.neuralNetwork.train(trainOptions, whileTraining, finishedTraining);
    }
    clearFields() {
        if (this.state.isGettingReady || this.state.isTraining || this.state.isFinishedTraining) {
            this.setState({
                isGettingReady: false,
                isTraining: false,
                isFinishedTraining: false,
            })
            this.props.onRestartTraining();
        }
    }
    render() {
        let trainButton;
        console.log(this.props.fileURL);
        console.log(this.props.inputs);
        console.log(this.props.outputs);
        console.log(this.props.isRegression);
        if (this.props.fileURL === null || this.props.inputs.length === 0 || this.props.outputs.length === 0 || this.props.isRegression === null) {
            trainButton = (
                <span>
                    Finish selecting your data options to train your model!
                </span>
            )
        }
        else if (this.state.isFinishedTraining) {
            trainButton = (
                <div>
                    <button className='Train-buttonDisabled' type='button' onClick={(evt) => this.startModelAgain()}> Finished Training </button>
                </div>
            )
        }
        else if (this.state.isTraining) {
            trainButton = (
                <div>
                    <button className='Train-buttonDisabled' type='button' disabled='disabled'> Train Model </button>
                    <div className='Train-training'>
                        Training the model ...
                    </div>
                </div>
            )
        }
        else if (this.state.isGettingReady) {
            trainButton = (
                <div>
                    <button className='Train-buttonDisabled' type='button' disabled='disabled'> Train Model </button>
                    <div className='Train-training'>
                        Preparing data ...
                    </div>
                </div>
            )
        }
        else {
            trainButton = (
                <div>
                    <button className='Train-button' type='button' onClick={(evt) => this.startModel()} > Train Model </button>
                </div>
            )
        }
        return (
            <div className='Train-container'>
                <div className="Train-step">Step 2: Train your model</div>
                {trainButton}
            </div>
        )
    }
}

export default Train;