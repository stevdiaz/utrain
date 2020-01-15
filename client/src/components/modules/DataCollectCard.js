import React, { Component } from 'react';
import './DataCollectCard.css';
import FileUpload from './FileUpload';
import DataSettings from './DataSettings';

class DataCollectCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileURL: null,
            options: [],
        }
    }
    componentDidMount() {

    }
    onFileAdded(fileURL, options) {
        this.setState({
            fileURL: fileURL,
            options: options,
        });
    }
    onSelection(inputs, outputs, isRegression) {
        this.props.onSelection(isRegression, inputs, outputs, this.state.fileURL);
    }
    render() {
        return (
            <div className="DataCollectCard-container">
                <FileUpload onFileAdded={(fileURL, options) => this.onFileAdded(fileURL, options)}/>
                <DataSettings fileURL={this.state.fileURL} options={this.state.options} 
                    onSelection={(inputs, outputs, isRegression) => this.onSelection(inputs, outputs, isRegression)}/>
            </div>
        )
    }
}

export default DataCollectCard;