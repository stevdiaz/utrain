import React, { Component } from 'react';
import './FileUpload.css';
import Upload from './Upload';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import * as d3 from 'd3';

class FileUpload extends Component{
    
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    onFileAdded(file) {
        console.log('file added!');
        const objectURL = window.URL.createObjectURL(file);
        d3.csv(objectURL).then(data => {
            console.log(data.length);
            const options = data.columns;
            // classify the types of these options
            const types = {};
            // assume all numbers
            options.forEach(option => {
                types[option] = 'N';
            })
            data.forEach(value => {
                Object.keys(value).forEach(key => {
                    if (isNaN(value[key])) {
                        types[key] = 'S';
                    }
                })
            });
            console.log(types);
            // tell parent file has been added
            this.props.onFileAdded(objectURL, options, types);
        })
    }
    render() {
        return (
            <div className='FileUpload-container'>
                <div className="FileUpload-step">Step 1: Collect Data</div>
                <div className="FileUpload-select">Select CSV file:</div>
                <Upload onFileAdded={(file) => this.onFileAdded(file)} />
            </div>
        )
    }

}
export default FileUpload;