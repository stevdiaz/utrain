import React, { Component } from 'react';
import './DataCollectCard.css';
import FileUpload from './FileUpload';
import DataSettings from './DataSettings';

class DataCollectCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileName: null,
            fileURL: null,
            options: [],
            types: {},
        }
    }
    componentDidMount() {
        
    }
    onFileAdded(fileName, fileURL, options, types) {
        this.setState({
            fileName: fileName,
            fileURL: fileURL,
            options: options,
            types: types
        });
    }
    onFileRemoved() {
        this.setState({
            fileName: null,
            fileURL: null,
            options: [],
            types: {},
        });
        this.props.onRemoval();
    }
    onSelection(inputs, outputs, isRegression) {
        this.props.onSelection(isRegression, inputs, outputs, this.state.fileName, this.state.fileURL, this.state.types);
    }
    render() {
        return (
            <div className="DataCollectCard-container">
                <div className='DataCollectCard-step'>
                    Step 1: Collect Data
                </div>
                <div className='DataCollectCard-components'>
                    <FileUpload savedData={this.props.savedData} onFileAdded={(fileName, fileURL, options, types) => this.onFileAdded(fileName, fileURL, options, types)} onFileRemoved={() => this.onFileRemoved()}/>
                    <DataSettings savedData={this.props.savedData} fileURL={this.state.fileURL} options={this.state.options} types={this.state.types}
                        onSelection={(inputs, outputs, isRegression) => this.onSelection(inputs, outputs, isRegression)}/>
                </div>
            </div>
        )
    }
}

export default DataCollectCard;