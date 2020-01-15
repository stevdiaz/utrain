import React, { Component } from 'react';
import './Predict.css';
import * as ml5 from 'ml5';

class Predict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {},
            outputs: {},
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
        let inputs = this.state.inputs;
        inputs[input] = event.target.value;
        this.setState({
            inputs: inputs,
        }, () => callback());
        const callback = () => {
            console.log('in callback');
            const values = Object.values(this.state.inputs).filter(value => value !== "");
            if (values.length === this.props.inputs.length) {
                console.log('have all values');
                //we have all inputs filled in, make a prediction
                let inputs = this.props.inputs.map(input => this.state.inputs[input]);
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
                    outputs: outputs
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
                    //classification problem - only one output
                    let outputs = this.state.outputs;
                    outputs[this.props.outputs[0]] = results[0].label;
                    this.setState({
                        outputs: outputs,
                    });
                }
                else {
                    //regression problem - possibly multiple outputs
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
            console.log(this.state);
            predictions = (
                <div className='Predict-inputsOutputs'>
                    <div className='Predict-inputs'>
                        {inputs}
                    </div>
                    <div className='Predict-outputs'>
                        {outputs}
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