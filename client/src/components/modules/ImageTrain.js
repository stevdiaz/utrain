import React, { Component } from 'react';
import './ImageTrain.css';
import * as ml5 from 'ml5';

class ImageTrain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGettingReady: false,
            isTraining: false,
            isFinishedTraining: false,
            epochs: 20,
            batchSize: 32,
            onEpoch: 0,
        };
    }
    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps.classes);
        console.log(this.props.classes);
        if (this.props.classes === null || this.props.images === null) {
            // have not received anything yet
            return;
        }
        else if (prevProps.classes === null || prevProps.images === null) {
            // first time receiving values, everything is cleared anyway
            return;
        }
        else if (prevProps.classes !== this.props.classes) {
            // a change in classes
            this.clearFields();
        }
        else if (this.state.isFinishedTraining) {
            // look for change in images
            let totalTrainedImages = this.state.neuralNetwork.xs.shape[0];
            let totalReceivedImages = Object.values(this.props.images).reduce((total, imageArray) => {
                return total + imageArray.length;
            }, 0);
            if (totalTrainedImages !== totalReceivedImages) {
                this.clearFields();
            }
        }
    }

    startModel() {
        this.setState({
            isGettingReady: true,
        });
        const options = {
            epochs: this.state.epochs,
            batchSize: this.state.batchSize,
            numLabels: Math.max(this.props.classes.length, 2),
        };
        // initialize the classifier
        const featureExtractor = ml5.featureExtractor('MobileNet', options, () => {
            console.log('model loaded');
            const classifier = featureExtractor.classification();
            this.setState({
                isGettingReady: true,
                neuralNetwork: classifier,
            });
    
            // add in data
            const imagePromises = [];
            this.props.classes.forEach((classification, classIndex) => {
                console.log('on class ' + classification);
                const label = classification;
                // add in all images for this label
                this.props.images[classIndex].forEach((imageSrc, imageIndex) => {
                    const image = document.getElementById(imageSrc);
                    console.log('on image ' + imageIndex);
                    imagePromises.push(classifier.addImage(image, label));
                });
            });
            Promise.all(imagePromises).then(() => {
                this.trainModel();
            })
        });

    
    }
    startModelAgain() {
        this.clearFields();
        this.startModel();
    }
    whileTraining(epochs, loss) {
        // epochs are zero-indexed, add by 1
        console.log('On epoch ' + epochs);
        console.log('With loss ' + loss);
        this.setState({
            onEpoch: epochs + 1,
        });
        if (epochs >= this.state.epochs) {
            this.finishedTraining();
        }
        else {
            this.props.onEpochEnd(epochs + 1, loss === null ? 0 : loss);
        }
    }
    finishedTraining() {
        console.log('finished training!');
        this.setState({isFinishedTraining: true});
        this.props.onFinishTraining(this.state.neuralNetwork);
        console.log(this.state.neuralNetwork);
    }
    trainModel() {
        this.setState({
            isTraining: true,
        });
        let epoch = 0;
        let whileTraining = (loss) => {
            this.whileTraining(epoch, loss);
            epoch++;
        }
        this.state.neuralNetwork.train(whileTraining);
    }
    clearFields() {
        if (this.state.isGettingReady || this.state.isTraining || this.state.isFinishedTraining) {
            this.setState({
                isGettingReady: false,
                isTraining: false,
                isFinishedTraining: false,
                onEpoch: 0,
            })
            this.props.onRestartTraining();
        }
    }
    handleEpochChange(evt) {
        this.setState({
            epochs: evt.target.value,
        });
    }
    handleEpochLoseFocus(evt) {
        if (evt.target.value === '') {
            this.setState({
                epochs: 0,
            });
        } 
    }
    handleBatchSizeChange(evt) {
        this.setState({
            batchSize: evt.target.value,
        });
    }
    render() {
        let trainButton;
        let advancedInputs = (
            <div className='ImageTrain-advanced'>
                Advanced Features
                <div className='ImageTrain-epochs'>
                    Epochs:
                    <input className='ImageTrain-epochsInput' type='number' value={this.state.epochs} onChange={(evt) => this.handleEpochChange(evt)} onBlur={(evt) => this.handleEpochLoseFocus(evt)}/>
                </div>
                <div className='ImageTrain-batchSize'>
                    Batch Size:
                    <select className='ImageTrain-batchSizeInput' id='batchSizeList' onChange={(evt) => this.handleBatchSizeChange(evt)}>
                        <option value='16'>16</option>
                        <option value='32' selected>32</option>
                        <option value='64'>64</option>
                        <option value='128'>128</option>
                        <option value='256'>256</option>
                    </select>
                </div>
            </div>
        )
        let isClassEmpty = false;
        if (this.props.images !== null) {
            Object.values(this.props.images).forEach(imageArray => {
                if (imageArray.length === 0) {
                    isClassEmpty = true;
                }
            })
        }
        if (this.props.classes === null || this.props.images === null || isClassEmpty) {
            trainButton = (
                <span className='ImageTrain-noButton'>
                    Finish selecting your data options to train your model!
                </span>
            )
        }
        else if (this.state.isFinishedTraining) {
            trainButton = (
                <div>
                    <button className='ImageTrain-button' type='button' onClick={(evt) => this.startModelAgain()}> Re-Train </button>
                    <div className='ImageTrain-trainingHidden'>
                        Finished!
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        else if (this.state.isTraining) {
            trainButton = (
                <div>
                    <button className='ImageTrain-buttonDisabled' type='button' disabled='disabled'> Train </button>
                    <div className='ImageTrain-training'>
                        Training ... (Epoch {this.state.onEpoch} of {this.state.epochs})
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        else if (this.state.isGettingReady) {
            trainButton = (
                <div>
                    <button className='ImageTrain-buttonDisabled' type='button' disabled='disabled'> Train </button>
                    <div className='ImageTrain-training'>
                        Preparing the data ...
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        else {
            trainButton = (
                <div>
                    <button className='ImageTrain-button' type='button' onClick={(evt) => this.startModel()} > Train </button>
                    <div className='ImageTrain-trainingHidden'>
                        Training the model ...
                    </div>
                    {advancedInputs}
                </div>
            )
        }
        return (
            <div className='ImageTrain-container'>
                {trainButton}
            </div>
        )
    }
}

export default ImageTrain;