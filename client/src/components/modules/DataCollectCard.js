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
            types: {},
        }
    }
    componentDidMount() {

    }
    onFileAdded(fileURL, options, types) {
        this.setState({
            fileURL: fileURL,
            options: options,
            types: types
        });
    }
    onFileRemoved() {
        this.setState({
            fileURL: null,
            options: [],
            types: {},
        });
        this.props.onRemoval();
    }
    onSelection(inputs, outputs, isRegression) {
        this.props.onSelection(isRegression, inputs, outputs, this.state.fileURL, this.state.types);
    }
    render() {
        return (
            <div className="DataCollectCard-container">
                <div className='DataCollectCard-step'>
                    Step 1: Collect Data
                </div>
                <div className='DataCollectCard-components'>
                    <FileUpload onFileAdded={(fileURL, options, types) => this.onFileAdded(fileURL, options, types)} onFileRemoved={() => this.onFileRemoved()}/>
                    <DataSettings fileURL={this.state.fileURL} options={this.state.options} types={this.state.types}
                        onSelection={(inputs, outputs, isRegression) => this.onSelection(inputs, outputs, isRegression)}/>
                </div>
            </div>
        )
    }
}

export default DataCollectCard;