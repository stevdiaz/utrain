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
    onSelection(inputs, outputs, isRegression) {
        this.props.onSelection(isRegression, inputs, outputs, this.state.fileURL, this.state.types);
    }
    render() {
        return (
            <div className="DataCollectCard-container">
                <FileUpload onFileAdded={(fileURL, options, types) => this.onFileAdded(fileURL, options, types)}/>
                <DataSettings fileURL={this.state.fileURL} options={this.state.options} types={this.state.types}
                    onSelection={(inputs, outputs, isRegression) => this.onSelection(inputs, outputs, isRegression)}/>
            </div>
        )
    }
}

export default DataCollectCard;