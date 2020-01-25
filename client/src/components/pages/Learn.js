import React, { Component } from 'react';
import './Learn.css';
import ImagePredictDropzone from '../modules/ImagePredictDropzone';
import * as ml5 from 'ml5';

class Learn extends Component {
    constructor(props) {
        super(props);
        let animals = ['lion', 'computer', 'penguin', 'basketball', 'dog', 'shoe', 'octopus', 'phone', 'cat'];
        this.state = {
            animals: animals,
            index: 0,
            classifier: null,
            predictedOutput: null,
        }
    }
    componentDidMount() {
        const classifier = ml5.imageClassifier('MobileNet', () => {
            console.log('model loaded!');
            this.setState({
                classifier: classifier
            })
        });
        setTimeout(() => this.changeAnimal(), 5000);
    }
    changeAnimal() {
        if (this.state.index === 8) {
            this.setState({
                index: 0,
            })
        }
        else {
            this.setState(prevState => ({
                index: prevState.index + 1,
            }));
        }
        setTimeout(() => this.changeAnimal(), 5000);
    }
    onFileAdded(fileSrc) {
        if (fileSrc === null) {
            this.setState({
                predictedOutput: null,
            });
        }
        else {
            let image = document.getElementById(fileSrc);
            this.state.classifier.classify(image, (err, results) => {
                this.setState({
                    predictedOutput: results.length > 0 ? results[0].label : null,
                });
            });
        }
    }
    render() {
        return (
            <div className='Learn-container'>
                <div className='Learn-header'>
                    <div className='Learn-title'>
                        How to use?
                    </div>
                    <div className='Learn-description'>
                        Learn about machine learning with UTrain so you can get started!
                    </div>
                </div>
                <div className='Learn-body'>
                    As complex as it is, machine learning is not magic. UTrain has broken down the training process into 3 simple steps. 
                    Here, we'll go over these 3 steps when creating an image classification model.
                </div>
                <div className='Learn-steps'>
                    <div className='Learn-step'>
                        Step 1. Collect Data
                        <div className='Learn-stepDescription'>
                            In order to train a machine learning model, we must give it data. Usually, the data is made up of inputs and outputs. The inputs are
                            what the trained model will be given. The outputs are what the trained model will try to predict. 
                        </div>
                    </div>
                    {this.state.animals[this.state.index] === 'lion' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/lion.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Lion
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'computer' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/computer.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Computer
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'penguin' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/penguin.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Penguin
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'basketball' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/basketball.png')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Basketball
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'dog' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/dog.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Dog
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'shoe' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/shoe.png')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Shoe
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'octopus' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/octopus.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Octopus
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'phone' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/phone.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Phone
                            </div>
                        </div>
                    )}
                    {this.state.animals[this.state.index] === 'cat' && (
                        <div className='Learn-step'>
                            <div className='Learn-input'>
                                Input:
                                <img className='Learn-animal' src={require('../../public/cat.jpg')} />
                            </div>
                            <div className='Learn-output'>
                                Output: Cat
                            </div>
                        </div>
                    )}
                    <div className='Learn-step'>
                        Step 2. Train model
                        <div className='Learn-stepDescription'>
                            Here, the model will pass through the given inputs and try to produce
                            the correct corresponding outputs. One pass through the entire data is called an epoch. Each epoch, the model will split the data into
                            different batches, or groups, depending on the batch size. At the end of each epoch, the model will have loss, a value which
                            encapsulates how far away the model's predictions were from the given outputs, and it will tweak itself to lower this loss.
                        </div>
                    </div>
                    <div className='Learn-step'>
                        <div className='Learn-graph'>
                            <img className='Learn-graphImage' src={require('../../public/loss_graph.png')} />
                        </div>
                    </div>
                    <div className='Learn-step'>
                        Step 3. Use Your Model
                        <div className='Learn-stepDescription'>
                            Once the model finishes training, it is ready to take inputs and make predictions! If you're happy with the model at this point, you
                            can save it's data to your account or export it to use on your machine. Otherwise, you can experiment with the epoch value and train again!
                        </div>
                    </div>
                    <div className='Learn-step'>
                        <div className='Learn-input'>
                            Input: 
                            <ImagePredictDropzone onFileAdded={(fileSrc) => this.onFileAdded(fileSrc)} />
                        </div>
                        <div className='Learn-output'>
                            Predicted Output: <span className={`${this.state.predictedOutput === null ? 'Learn-outputNone' : ''}`}>
                                {this.state.predictedOutput === null ? 'No ouput' : this.state.predictedOutput }
                            </span>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Learn;