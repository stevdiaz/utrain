import React, { Component } from 'react';
import './Predict.css';
import BarGraph from './BarGraph';
import * as ml5 from 'ml5';

class Predict extends Component {
    constructor(props) {
        super(props);
        // can get input type from this.props.types object or this.state.typeValues object
        this.state = {
            inputs: {},
            outputs: {},
            confidence: '0%',
            classes: [],
            confidences: [],
            isRegression: false,
            typeValues: {},
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
            let typeValues = {};
            let inputs = {};
            Object.keys(this.props.neuralNetwork.data.meta.inputs).forEach(input => {
                let value = this.props.neuralNetwork.data.meta.inputs[input];
                let type = value.dtype === 'number' ? 'N' : 'S';
                let values = [];
                if (type === 'S' && value.uniqueValues !== undefined && value.uniqueValues !== null) {
                    values = value.uniqueValues;
                    // set inputs to the default checked value
                    inputs[input] = values[0];
                }
                typeValues[input] = {
                    type,
                    values,
                };
            });
            this.setState({
                classes: classes,
                isRegression: isRegression,
                typeValues: typeValues,
                inputs: inputs,
            }, () => this.onSetInputState());
            
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
                typeValues: {},
            });
        }
    }
    handleInputChange(event, input) {
        // change the input value
        let inputs = this.state.inputs;
        inputs[input] = event.target.value;
        this.setState({
            inputs: inputs,
        }, () => this.onSetInputState());
        if (this.isInvalidType(input, event.target.value)) {
            this.handleInvalidType(input);
        }
    }
    onSetInputState() {
        const validInputs = Object.keys(this.state.inputs).filter(enteredInput => 
            this.state.inputs[enteredInput] !== '' && !this.isInvalidType(enteredInput, this.state.inputs[enteredInput]));
        if (validInputs.length === this.props.inputs.length) {
            console.log('have all entered values!');
            //we have all inputs filled in, make a prediction
            let inputs = this.props.inputs.map(input => {
                return this.props.types[input] === 'N' ? Number(this.state.inputs[input]) : this.state.inputs[input];
            });
            if (this.state.isRegression) {
                this.props.neuralNetwork.predict(inputs, (err, results) => this.onPrediction(err, results, true));
            }
            else {
                this.props.neuralNetwork.classify(inputs, (err, results) => this.onPrediction(err, results, false));
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
    onPrediction(err, results, isRegression) {
       if (err) {
           // handle errors
           console.error(err);
       }
       else {
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
                <div className='Predict-instructions'>
                    Finish training your model to make predictions!
                </div>
            )
        }
        else {
            let inputs = this.props.inputs.map((input, index) => {
                let innerValue = (
                    <div></div>
                )
                if (this.props.types[input] === 'N') {
                    // number, so take in number input
                    innerValue = (
                        <input className='Predict-inputValue' type='number' value={this.state.inputs[input]} 
                     id={input} onChange={(evt) => this.handleInputChange(evt, input)} key={index+'input'}/>
                    )
                }
                else {
                    if (this.state.typeValues[input] === undefined) {
                        // first render
                        innerValue = (
                            <div>
                                Loading
                            </div>
                        );
                    }
                    else if (this.state.typeValues[input].values.length === 0) {
                        // no possible values, so just take in all strings
                        innerValue = (
                            <input className='Predict-inputValue' type='text' value={this.state.inputs[input]} 
                     id={input} onChange={(evt) => this.handleInputChange(evt, input)} key={index+'input'}/>
                        )
                    }
                    else {
                        // there exists unique values this input allows
                        let options = this.state.typeValues[input].values.map(value => {return (
                            <option value={value} key={value}>{value}</option>
                        )});
                        innerValue = (
                            <select className='Predict-inputValue Predict-inputSelect' id={input} onChange={(evt) => this.handleInputChange(evt, input)} key={index+'input'}>
                                {options}
                            </select>
                        );
                    }
                }
                return (
                    <label className='Predict-inputLabel' htmlFor={input}> {input}: 
                        {innerValue}
                    </label>
                );
            });
            let outputs = this.props.outputs.map((output, index) => {return (
                <label className='Predict-outputLabel'> {output}:
                    <input className='Predict-outputValue' type={this.props.types[output].includes('N') ? 'number' : 'text'} value={this.state.outputs[output]} 
                    readOnly key={index+'output'}/>
                </label>
            )})
            if (!this.state.isRegression) {
                outputs = (<div className='Predict-bar'>
                    <BarGraph classes={this.state.classes} percentages={this.state.confidences} />
                </div>)
            }
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