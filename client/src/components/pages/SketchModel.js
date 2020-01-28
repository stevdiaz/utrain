import React, { Component } from 'react';
import './SketchModel.css';
import ImageCollectCard from '../modules/ImageCollectCard';
import ImageTrainCard from '../modules/ImageTrainCard';
import ImageDeployCard from '../modules/ImageDeployCard';
import { get } from '../../utilities';
import { Redirect } from '@reach/router';

class SketchModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: null,
            images: null,
            savedData: null,
            neuralNetwork: null,
        }
    }
    componentDidMount() {
        if (this.props.name) {
            const body = {
                title: this.props.name,
                type: 'sketch',
            };
            get('/api/model', body).then((savedData) => {
                console.log('retreived model with name ' + this.props.name);
                this.setState({
                    savedData: savedData,
                })
            }).catch(() => {
                // proceed as usual
                return;
            });
        }
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
            savedData: null,
            neuralNetwork: neuralNetwork,
        });
    }
    onRestartTraining() {
        this.setState({
            neuralNetwork: null,
        });
    }
    render() {
        if (!this.props.userId) {
            return (
                <Redirect to="/" />
            );
        }
        return (
            <div className='SketchModel-container'>
                <ImageCollectCard savedData={this.state.savedData} onChangeImages={(classes, images) => this.onChangeImages(classes, images)} isImage={false}/>
                <ImageTrainCard savedData={this.state.savedData} classes={this.state.classes} images={this.state.images}
                onFinishTraining={(neuralNetwork) => this.onFinishTraining(neuralNetwork)} onRestartTraining={() => this.onRestartTraining()}/>
                <ImageDeployCard savedData={this.state.savedData} neuralNetwork={this.state.neuralNetwork} classes={this.state.classes} images={this.state.images} isImage={false}/>
            </div>
        )
    }
}

export default SketchModel;
