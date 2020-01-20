import React, { Component } from 'react';
import './ImageModel.css';
import ImageCollectCard from '../modules/ImageCollectCard';
import ImageTrainCard from '../modules/ImageTrainCard';
import DataTrainCard from '../modules/DataTrainCard';
import DataDeployCard from '../modules/DataDeployCard';

class ImageModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: null,
            images: null,
            neuralNetwork: null,
        };
    }
    componentDidMount() {

    }
    onChangeImages(classes, images) {
        this.setState({
            classes: classes,
            images: images,
        });
    }
    onFinishTraining(neuralNetwork) {
        console.log('updating neural network');
        this.setState({
            neuralNetwork: neuralNetwork,
        });
    }
    onRestartTraining() {
        this.setState({
            neuralNetwork: null,
        });
    }
    render() {
        return (
            <div className='ImageModel-container'>
                <ImageCollectCard onChangeImages={(classes, images) => this.onChangeImages(classes, images)}/>
                <ImageTrainCard classes={this.state.classes} images={this.state.images}
                onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}/>
                {/* <DataTrainCard isRegression={this.state.isRegression} inputs={this.state.inputs} outputs={this.state.outputs} fileURL={this.state.fileURL}
                    onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}
                    types={this.state.types}/>
                <DataDeployCard inputs={this.state.inputs} outputs={this.state.outputs} neuralNetwork={this.state.neuralNetwork} types={this.state.types}/> */}
            </div>
        )
    }
}

export default ImageModel;