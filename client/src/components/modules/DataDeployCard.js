import React, { Component } from 'react';
import './DataDeployCard.css';
import Predict from './Predict';
import Options from './Options';
import { _ } from 'core-js';

class DataDeployCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegression : false,
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        if (prevProps.neuralNetwork === null && this.props.neuralNetwork !== null) {
            this.setState({
                isRegression: this.props.neuralNetwork.config.architecture.task === 'regression',
            });
        }
        else if (prevProps.neuralNetwork !== null && this.props.neuralNetwork === null) {
            this.setState({
                isRegression: false,
            });
        }
    }
    render() {
        return (
            <div className={`DataDeployCard-container ${this.state.isRegression ? 'DataDeployCard-regression' : 'DataDeployCard-classification'}`}>
                <div className='DataDeployCard-step'>
                    Step 3: Use Your Model
                </div>
                <div className='DataDeployCard-components'>
                    <Predict inputs={this.props.inputs} outputs={this.props.outputs} neuralNetwork={this.props.neuralNetwork} types={this.props.types}/>
                    <Options />
                </div>
            </div>
        )
    }
}

export default DataDeployCard;