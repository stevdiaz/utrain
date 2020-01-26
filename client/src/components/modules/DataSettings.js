import React, { Component } from "react";
import './DataSettings.css';

class DataSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: [], 
            outputs: [], 
            isRegression: false,
            isHovered: false,
            isUsingSaved: false,
        };
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        // check if file was removed
        if (this.props.fileURL === null && prevProps.fileURL !== null) {
            this.setState({
                inputs: [],
                outputs: [],
                isRegression: false,
            });
        }
        if (this.props.savedData !== null && this.props.fileURL !== null && !this.state.isUsingSaved) {
            this.setState({
                inputs: this.props.savedData.inputs,
                outputs: this.props.savedData.outputs,
                isRegression: this.props.savedData.isRegression,
                isUsingSaved: true,
            }, () => this.callback());
        }
    }
    taskChanged(isRegression) {
        console.log('task changed!');
        // set isRegression, and reset inputs/outputs
        this.setState({
            isRegression: isRegression,
            inputs: [],
            outputs: [],
        }, () => this.callback());
    }
    inputChanged(cb, input) {
        const checked = this.state.inputs.includes(input);
        if (!checked) {
            //include input
            console.log('Including input ' + input);
            this.setState(prevState => ({
                inputs: prevState.inputs.concat(input),
            }), () => this.callback())
        }
        else {
            //remove input
            console.log('Removing input ' + input);
            this.setState(prevState => ({
                inputs: prevState.inputs.filter(preInput => preInput !== input),
            }), () => this.callback())
        }
    }
    outputChanged(cb, output) {
        const checked = this.state.outputs.includes(output);
        if (!checked) {
            //include output
            console.log('Including output ' + output);
            this.setState(prevState => {
                if (this.state.isRegression) {
                    return {
                        outputs: prevState.outputs.concat(output),
                    };
                } 
                else {
                    return {
                        outputs: [output],
                    };
                }
            }, () => this.callback())
        }
        else {
            //remove input
            console.log('Removing output ' + output);
            this.setState(prevState => ({
                outputs: prevState.outputs.filter(preOutput => preOutput !== output),
            }), () => this.callback())
        }
    }
    callback() {
        this.props.onSelection(this.state.inputs, this.state.outputs, this.state.isRegression)
    }
    handleMouseEnter() {
        this.setState({
            isHovered: true
        });
    }
    handleMouseLeave() {
        this.setState({
            isHovered: false,
        });
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
                let isFade = this.state.outputs.includes(option);
                return (
                    <>
                    <input className='DataSettings-input' type='checkbox' id={option+'input'} name={option+'input'} key={index+'inputInput'} 
                            onClick={(cb) => this.inputChanged(cb, option)} disabled={isFade} checked={this.state.inputs.includes(option)}/>
                    <label className={`${isFade ? 'DataSettings-labelNoHover DataSettings-fadeOption' : 'DataSettings-label'}`} 
                    htmlFor={option+'input'} key={index+'labelInput'}>{option}</label>
                    </>
                )
            })
            const selectedInputCheckBoxes = this.state.inputs.length === 0 || this.state.outputs.length === 0 ? inputCheckBoxes : 
                this.state.inputs.map((input, index) => {
                    return (
                        <>
                            <input className='DataSettings-input' type='checkbox' id={input+'input'} name={input+'input'} key={index+'inputInput'} 
                                     checked={true}/>
                            <label className='DataSettings-label' htmlFor={input+'input'} key={index+'labelInput'}>{input}</label>
                        </>
                    )
                })
            let outputCheckBoxes = this.props.options.filter(option => {
                // if regression, only allow number outputs; else, allow classification types
                return this.state.isRegression ? this.props.types[option] === 'N' : this.props.types[option] === 'C';
            }).map((option, index) => {
                let isFade = this.state.inputs.includes(option);
                return (
                    <>
                    <input className='DataSettings-input' type='checkbox' id={option+'output'} name={option+'output'} key={index+'inputOutput'} 
                        onClick={(cb) => this.outputChanged(cb, option)} disabled={isFade} checked={this.state.outputs.includes(option)}/>
                    <label className={`${isFade ? 'DataSettings-labelNoHover DataSettings-fadeOption' : 'DataSettings-label'}`} 
                    htmlFor={option+'output'} key={index+'labelOutput'}>{option}</label>
                    </>
                )
            })
            if (outputCheckBoxes.length === 0) {
                outputCheckBoxes = (
                    <div className='DataSettings-noOutputs'>
                        No Valid Outputs for {this.state.isRegression ? 'Regression' : 'Classification'}
                    </div>
                )
            }
            const selectedOutputCheckBoxes = this.state.outputs.length === 0 || this.state.inputs.length === 0 ? outputCheckBoxes :
                this.state.outputs.map((output, index) => {
                    return (
                        <>
                            <input className='DataSettings-input' type='checkbox' id={output+'output'} name={output+'output'} key={index+'inputOutput'} 
                                 checked={true}/>
                            <label className='DataSettings-label' htmlFor={output+'output'} key={index+'labelOutput'}>{output}</label>
                        </>
                    )
                })
            const taskForm = (
                <form>
                    <input className='DataSettings-input' type='radio' name='task' id='classification' value='classification' defaultChecked={this.state.isRegression ? '' : 'checked'} 
                    onClick={(radio) => this.taskChanged(false)}/>
                    <label className='DataSettings-label DataSettings-taskLabel' htmlFor='classification'>Classification</label>
                    <input className='DataSettings-input' type='radio' name='task' id='regression' value='regression' defaultChecked={this.state.isRegression ? 'checked': ''} 
                    onClick={(radio) => this.taskChanged(true)}/>
                    <label className='DataSettings-label DataSettings-taskLabel' htmlFor='regression'>Regression</label>
                </form>
            )
            const awayTaskForm = this.state.isRegression ? 
                (
                    <div>
                        <input className='DataSettings-input' type='radio' name='task' id='regression' value='regression' defaultChecked={this.state.isRegression ? 'checked': ''} 
                        onClick={(radio) => this.taskChanged(true)}/>
                        <label className='DataSettings-label DataSettings-taskLabel' htmlFor='regression'>Regression</label>
                    </div>
                ) :
                (
                    <div>
                        <input className='DataSettings-input' type='radio' name='task' id='classification' value='classification' defaultChecked={this.state.isRegression ? '' : 'checked'} 
                        onClick={(radio) => this.taskChanged(false)}/>
                        <label className='DataSettings-label DataSettings-taskLabel' htmlFor='classification'>Classification</label>
                    </div>
                );
            return (
                <div className='DataSettings-container' onMouseEnter={() => this.handleMouseEnter()} onMouseLeave={() => this.handleMouseLeave()}>
                    <div className='DataSettings-task'>
                        {this.state.isHovered ? taskForm : awayTaskForm}
                    </div>
                    <div className='DataSettings-inputsOutputs'>
                        <span className='DataSettings-inputsInfo'>Inputs:</span>
                        <div className='DataSettings-inputs'>
                            {this.state.isHovered ? inputCheckBoxes : selectedInputCheckBoxes}
                        </div>
                        <span className='DataSettings-outputsInfo'>Outputs:</span>
                        <div className='DataSettings-outputs'>
                            {this.state.isHovered ? outputCheckBoxes : selectedOutputCheckBoxes}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default DataSettings;