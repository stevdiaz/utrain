import React, { Component } from 'react';
import './ImageModel.css';
import ImageCollectCard from '../modules/ImageCollectCard';
import DataTrainCard from '../modules/DataTrainCard';
import DataDeployCard from '../modules/DataDeployCard';

class ImageModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            neuralNetwork: null,
        };
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className='ImageModel-container'>
                <ImageCollectCard />
                {/* <DataTrainCard isRegression={this.state.isRegression} inputs={this.state.inputs} outputs={this.state.outputs} fileURL={this.state.fileURL}
                    onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                    types={this.state.types}/>
                <DataDeployCard inputs={this.state.inputs} outputs={this.state.outputs} neuralNetwork={this.state.neuralNetwork} types={this.state.types}/> */}
            </div>
        )
    }
}

export default ImageModel;