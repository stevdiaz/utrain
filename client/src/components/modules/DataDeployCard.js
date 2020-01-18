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