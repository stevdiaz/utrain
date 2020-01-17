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
    onFileAdded(file) {
        if (this.state.fileName !== null) {
            // first remove any previous file
            this.onFileRemoved();
        }
        console.log('file added!');
        this.setState({
            fileName: file.name,
        });
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