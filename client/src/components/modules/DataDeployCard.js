import React, { Component } from 'react';
import './DataDeployCard.css';
import Predict from './Predict';
import Options from './Options';

class DataDeployCard extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className='DataDeployCard-container'>
                <Predict inputs={this.props.inputs} outputs={this.props.outputs} neuralNetwork={this.props.neuralNetwork}/>
                <Options />
            </div>
        )
    }
}

export default DataDeployCard;