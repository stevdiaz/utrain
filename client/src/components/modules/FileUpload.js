import React, { Component } from 'react';
import './FileUpload.css';
import Dropzone from './Dropzone';
import 'filepond/dist/filepond.min.css';
import * as d3 from 'd3';

class FileUpload extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fileName: null,
        };
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
        console.log('file upload updated');
        console.log(this.props.savedData);
        if (prevProps.savedData === null && this.props.savedData !== null) {
            this.setState({
                fileName: this.props.savedData.fileName,
            });
            this.readData(this.props.savedData.fileName, this.props.savedData.csv);
        }
    }
    onFileAdded(file) {
        if (this.state.fileName !== null) {
            // first remove any previous file
            this.onFileRemoved();
        }
        this.setState({
            fileName: file.name,
        });
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileSrc = event.target.result;
            this.readData(file.name, fileSrc);
        }
        reader.readAsDataURL(file);
    }
    readData(fileName, fileSrc) {
        d3.csv(fileSrc).then(data => {
            const options = data.columns;
            // classify the types of these options
            const types = {};
            const values = {};
            // assume all numbers
            options.forEach(option => {
                types[option] = 'N';
                values[option] = new Set();
            })
            data.forEach(value => {
                Object.keys(value).forEach(option => {
                    if (isNaN(value[option])) {
                        types[option] = 'C'; // not a number; assume classification
                    }
                    values[option].add(value[option]);
                })
            });
            options.forEach(option => {
                if (types[option] === 'C' && values[option].size > 5) {
                    // can not be classification
                    types[option] = 'S';
                }
            });
            console.log(types);
            // tell parent file has been added
            this.props.onFileAdded(fileName, fileSrc, options, types);
        })
    }
    onFileRemoved() {
        this.setState({
            fileName: null,
        })
        this.props.onFileRemoved();
    }
    render() {
        let fileName = (
            <div></div>
        )
        if (this.state.fileName !== null) {
            fileName = (
                <div className='FileUpload-fileDescription'>
                    Data: 
                    <div className='FileUpload-fileName'>
                        {this.state.fileName}
                    </div>
                </div>
            )
        }
        return (
            <div className='FileUpload-container'>
                <Dropzone onFileAdded={(file) => this.onFileAdded(file)} />
                {fileName}
            </div>
        )
    }

}
export default FileUpload;