import React, { Component } from 'react';
import './Predict.css';
import * as ml5 from 'ml5';

class Predict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {},
            outputs: {},
            confidence: '0%',
        };
    }
    componentDidMount() {
        
    }
    componentDidUpdate() {
        // this.props.inputs.forEach(input => {
        //     this.state[input] = '0';
        // });
        // this.props.outputs.forEach(output => {
        //     this.state[output] = '0';
        // });
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
                if (this.props.neuralNetwork.config.architecture.task === 'regression') {
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
                console.error(err);
            }
            else {
                console.log(results);
                if (!isRegression) {
                    // classification problem - only one output
                    // results[0] will be the most confident result
                    let outputs = this.state.outputs;
                    outputs[this.props.outputs[0]] = results[0].label;
                    let confidence = (results[0].confidence*100).toString().slice(0, 2) + '%';
                    this.setState({
                        outputs: outputs,
                        confidence: confidence,
                    });
                }
                else {
                    // regression problem - possibly multiple outputs
                    let outputs = this.state.outputs;
                    results.forEach(prediction => {
                        outputs[prediction.label] = prediction.value;
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
                <label className='Predict-input'>
                    {input}: <input type='text' value={this.state.inputs[input]} placeholder='Enter value' onChange={(evt) => this.handleInputChange(evt, input)} key={index}/>
                </label>
            )})
            let outputs = this.props.outputs.map((output, index) => {return (
                <label className='Predict-output'>
                    Predicted {output}: <input type='text' value={this.state.outputs[output]} placeholder="Model's Prediction" readOnly key={index}/>
                </label>
            )})
            let confidence = (<div></div>);
            if (!this.state.isRegression) {
                confidence = (<div>
                    Confidence: {this.state.confidence}
                </div>)
            }
            console.log(this.state);
            predictions = (
                <div className='Predict-inputsOutputs'>
                    <div className='Predict-inputs'>
                        {inputs}
                    </div>
                    <div className='Predict-outputs'>
                        {outputs}
                        {confidence}
                    </div>
                </div>
            )
        }
        return (
            <div className='Predict-container'>
                <div className="Predict-step">Step 3: Use your model</div>
                {predictions}
            </div>
        )
    }
}

export default Predict;