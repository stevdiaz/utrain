import React, { Component } from 'react';
import './Predict.css';
import BarGraph from './BarGraph';
import * as ml5 from 'ml5';

class Predict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {},
            outputs: {},
            confidence: '0%',
            classes: [],
            confidences: [],
            isRegression: false,
        };
    }
    componentDidMount() {
        
    }
    componentDidUpdate(prevProps) {
        if (this.props.neuralNetwork !== null && prevProps.neuralNetwork === null) {
            // neural network coming in
            let isRegression = this.props.neuralNetwork.config.architecture.task === 'regression';
            let classes = [];
            if (!isRegression) {
                classes = Object.keys(this.props.neuralNetwork.data.meta.outputs[this.props.outputs[0]].legend);
            }
            this.setState({
                classes: classes,
                isRegression: isRegression,
            });
        }
        else if (this.props.neuralNetwork === null && prevProps.neuralNetwork !== null) {
            // neural network leaving
            this.setState({
                inputs: {},
                outputs: {},
                confidence: '0%',
                classes: [],
                confidences: [],
                isRegression: false,
            });
        }
    }
    handleInputChange(event, input) {
        // change the input value
        let inputs = this.state.inputs;
        inputs[input] = event.target.value;
        this.setState({
            inputs: inputs,
        }, () => callback());
        if (this.isInvalidType(input, event.target.value)) {
            this.handleInvalidType(input);
        }
        // if all fields filled in, predict
        const callback = () => {
            console.log('in callback');
            const validInputs = Object.keys(this.state.inputs).filter(enteredInput => 
                this.state.inputs[enteredInput] !== '' && !this.isInvalidType(enteredInput, this.state.inputs[enteredInput]));
            console.log(validInputs);
            if (validInputs.length === this.props.inputs.length) {
                console.log('have all entered values!');
                //we have all inputs filled in, make a prediction
                let inputs = this.props.inputs.map(input => {
                    return this.props.types[input] === 'N' ? Number(this.state.inputs[input]) : this.state.inputs[input];
                });
                console.log(inputs);
                if (this.state.isRegression) {
                    console.log('regression');
                    this.props.neuralNetwork.predict(inputs, (err, results) => onPrediction(err, results, true));
                }
                else {
                    console.log('classification');
                    this.props.neuralNetwork.classify(inputs, (err, results) => onPrediction(err, results, false));
                }
            }
            else {
                // make outputs blank
                let outputs = this.state.outputs;
                this.props.outputs.forEach(output => {
                    outputs[output] = "";
                })
                this.setState({
                    outputs: outputs,
                    confidence: '0%',
                });
            }
        }
        const onPrediction = (err, results, isRegression) => {
             console.log('making prediction');
            if (err) {
                // handle errors
                console.error(err);
                console.log('error in user inputs');
            }
            else {
                console.log(results);
                if (!isRegression) {
                    // don't include decimals in percentage
                    const classes = results.map(result => result.label);
                    const confidences = results.map(result => Math.round(result.confidence*100));
                    this.setState(prevState => ({
                        confidences: prevState.classes.map(classification => {
                            let classIndex = classes.indexOf(classification);
                            return confidences[classIndex];
                        }),
                    }));
                }
                else {
                    // regression problem - possibly multiple outputs
                    let outputs = this.state.outputs;
                    results.forEach(prediction => {
                        let predictionValue = prediction.value.toString();
                        let indexOfDot = predictionValue.indexOf('.');
                        if (indexOfDot !== -1 && indexOfDot + 4 <= predictionValue.length) {
                            // leave three decimals
                            predictionValue = predictionValue.slice(0, indexOfDot + 4);
                        }
                        outputs[prediction.label] = predictionValue;
                    });
                    this.setState({
                        outputs: outputs,
                    });
                }
            }
        }
    }
    isInvalidType(input, value) {
        return this.props.types[input] === 'N' && isNaN(value);
    }
    handleInvalidType(input) {
        console.log(`The input ${input} only takes in number values`);
    }
    render() {
        let predictions;
        if (this.props.neuralNetwork === null) {
            predictions = (
                <span>
                    Finish training your model to make predictions!
                </span>
            )
        }
        else {
            let inputs = this.props.inputs.map((input, index) => {return (
                <label className='Predict-inputLabel' htmlFor={input}> {input}: 
                    <input className='Predict-inputValue' type={this.props.types[input] === 'N' ? 'number' : 'text'} value={this.state.inputs[input]} 
                     id={input} onChange={(evt) => this.handleInputChange(evt, input)} key={index+'input'}/>
                </label>
            )})
            let outputs = this.props.outputs.map((output, index) => {return (
                <label className='Predict-outputLabel'> {output}:
                    <input className='Predict-outputValue' type={this.props.types[output] === 'N' ? 'number' : 'text'} value={this.state.outputs[output]} 
                    readOnly key={index+'output'}/>
                </label>
            )})
            if (!this.state.isRegression) {
                outputs = (<div className='Predict-bar'>
                    <BarGraph classes={this.state.classes} percentages={this.state.confidences} />
                </div>)
            }
            console.log(this.state);
            predictions = (
                <div className={this.state.isRegression ? 'Predict-inputsOutputsRegression' : 'Predict-inputsOutputsClassification'}>
                    <span className='Predict-inputsInfo'>Inputs:</span>
                    <div className='Predict-inputs'>
                        {inputs}
                    </div>
                    <span className='Predict-outputsInfo'>Predicted Outputs:</span>
                    <div className='Predict-outputs'>
                        {outputs}
                    </div>
                </div>
            )
        }
        return (
            <div className='Predict-container'>
                {predictions}
            </div>
        )
    }
}

export default Predict;