import React, { Component } from 'react';
import './Create.css';
import { Link, Redirect } from "@reach/router";

class Create extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }
    render() {
        if (!this.props.userId) {
            return (
                <Redirect to="/" />
            );
        }
        return ( 
            <div className='Create-container'>
                <div className='Create-title'> 
                    Create your own <span className='Create-bold'>Machine Learning</span> model
                </div>

                <div className='Create-options'>
                    <Link to='/datamodel/' className='Create-link'>
                        <div className='Create-button Create-dataButton'>
                            Data
                            <div className='Create-buttonExplanation'>
                                Upload a CSV file, and train a model to perform classification or regression on your inputs and outputs.
                            </div>
                        </div>
                    </Link>
                    <Link to='/imagemodel/' className='Create-link'>
                        <div className='Create-button Create-imageButton'>
                            Image
                            <div className='Create-buttonExplanation'>
                                Take or upload images from your computer, and train a model to classify these images into different classes.
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}
export default Create