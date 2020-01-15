import React, { Component } from "react";
import './DataSettings.css';

class DataSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {inputs: [], outputs: [], isRegression: false};
    }
    componentDidMount() {

    }
    taskChanged(isRegression) {
        console.log('task changed!');
        this.setState({isRegression: isRegression});
        this.props.onSelection(this.state.inputs, this.state.outputs, isRegression);
    }
    inputChanged(cb, input) {
        const checked = this.state.inputs.includes(input);
        if (!checked) {
            //include input
            console.log('Including input ' + input);
            this.setState(prevState => ({
                inputs: prevState.inputs.concat(input),
            }))
            this.props.onSelection(this.state.inputs.concat(input), this.state.outputs, this.state.isRegression);
        }
        else {
            //remove input
            console.log('Removing input ' + input);
            this.setState(prevState => ({
                inputs: prevState.inputs.filter(preInput => preInput !== input),
            }))
            this.props.onSelection(this.state.inputs.filter(preInput => preInput !==input), this.state.outputs, this.state.isRegression);
        }
    }
    outputChanged(cb, output) {
        const checked = this.state.outputs.includes(output);
        if (!checked) {
            //include output
            console.log('Including output ' + output);
            this.setState(prevState => ({
                outputs: prevState.outputs.concat(output),
            }))
            this.props.onSelection(this.state.inputs, this.state.outputs.concat(output), this.state.isRegression);
        }
        else {
            //remove input
            console.log('Removing output ' + output);
            this.setState(prevState => ({
                outputs: prevState.outputs.filter(preOutput => preOutput !== output),
            }))
            this.props.onSelection(this.state.inputs, this.state.outputs.filter(preOutput => preOutput !==output), this.state.isRegression);
        }
    }
    render() {
        if (this.props.fileURL === null) {
            //nothing to show yet!
            return (
                <div className='DataSettings-noFile'>Please upload a CSV file</div>
            )
        }
        else {
            const inputCheckBoxes = this.props.options.map((option, index) => {
                if (this.state.outputs.includes(option)) {
                    // cannot be both input and output
                    return (
                        <>
                        <input className='DataSettings-fadeOption' type='checkbox' id={option} name={option} key={index+'input'} 
                            onClick={(cb) => this.inputChanged(cb, option)} disabled='disabled'/>
                        <label className='DataSettings-fadeOption' htmlFor={option} key={index+'label'}>{option}</label>
                        </>
                    )
                }
                else {
                    return (
                        <>
                        <input type='checkbox' id={option} name={option} key={index+'input'} onClick={(cb) => this.inputChanged(cb, option)}/>
                        <label htmlFor={option} key={index+'label'}>{option}</label>
                        </>
                    )
                }
            })
            const outputCheckBoxes = this.props.options.map((option, index) => {
                if (this.state.inputs.includes(option)) {
                    // cannot be both input and output
                    return (
                        <>
                        <input className='DataSettings-fadeOption' type='checkbox' id={option} name={option} key={index+'input'} 
                            onClick={(cb) => this.outputChanged(cb, option)} disabled='disabled'/>
                        <label className='DataSettings-fadeOption' htmlFor={option} key={index+'label'}>{option}</label>
                        </>
                    )
                }
                else {
                    return (
                        <>
                        <input type='checkbox' id={option} name={option} key={index+'input'} onClick={(cb) => this.outputChanged(cb, option)}/>
                        <label htmlFor={option} key={index+'label'}>{option}</label>
                        </>
                    )
                }
            })
            return (
                <div className='DataSettings-container'>
                    <div className='DataSettings-task'>
                        <span>Task:</span>
                        <form>
                            <input type='radio' name='task' id='classification' value='classification' onClick={(radio) => this.taskChanged(false)}/>
                            <label htmlFor='classification'>Classification</label>
                            <input type='radio' name='task' id='regression' value='regression' onClick={(radio) => this.taskChanged(true)}/>
                            <label htmlFor='regression'>Regression</label>
                        </form>
                    </div>
                    <div className='DataSettings-inputs'>
                        <span>Inputs:</span>
                        {inputCheckBoxes}
                    </div>
                    <div className='DataSettings-outputs'>
                        <span>Outputs:</span>
                        {outputCheckBoxes}
                    </div>
                </div>
            )
        }
    }
}

export default DataSettings;