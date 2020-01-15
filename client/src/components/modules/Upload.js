import React, { Component } from 'react';
import './Upload.css';
import Dropzone from './Dropzone.js';
import { post } from '../../utilities';
import Progress from './Progress.js';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false,
        }
    }
    onFilesAdded(files) {
        this.setState({files: this.state.files.concat(files)});
    }
    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfullUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress progress={uploadProgress ?
                        uploadProgress.percentage : 0} />
                    <img
                      className="CheckIcon"
                      alt="done"
                      src={require("../../public/check.svg")}
                      style={{
                          opacity: uploadProgress && uploadProgress.state === "done" ?
                            0.5: 0
                      }}
                    />
                </div>
            )
        }
    }
    renderActions() {
        if (this.state.successfullUploaded) {
            return (
                <button
                    onClick={() => 
                        this.setState({ files: [], successfullUploaded: false})
                    }
                >
                    Clear
                </button>
            );
        }
        else {
            return (
                <button
                    disabled={this.state.files.length < 0 || this.state.uploading}
                    onClick={() => this.uploadFiles()}
                >
                    Upload
                </button>
            );
        }
    }
    uploadFiles() {
        this.state.files.forEach(file => {
            this.sendRequest(file);
        })
    }
    // async uploadFiles() {
    //     this.setState({ uploadProgress: {}, uploading: true });
    //     const promises = [];
    //     this.state.files.forEach(file => {
    //         promises.push(this.sendRequest(file));
    //     });
    //     try {
    //         await Promise.all(promises);
    //         this.setState({successfullUploaded: true, uploading: false});
    //     }
    //     catch (e) {
    //         //do some error handling
    //         this.setState({ successfullUploaded: true, uploading: false});
    //     }
    // }
    sendRequest(file) {
        this.props.onFileAdded(file);
        // return new Promise((resolve, reject) => {
        //  const req = new XMLHttpRequest();
       
        //  req.upload.addEventListener("progress", event => {
        //   if (event.lengthComputable) {
        //    const copy = { ...this.state.uploadProgress };
        //    copy[file.name] = {
        //     state: "pending",
        //     percentage: (event.loaded / event.total) * 100
        //    };
        //    this.setState({ uploadProgress: copy });
        //   }
        //  });
          
        //  req.upload.addEventListener("load", event => {
        //   const copy = { ...this.state.uploadProgress };
        //   copy[file.name] = { state: "done", percentage: 100 };
        //   this.setState({ uploadProgress: copy });
        //   resolve(req.response);
        //  });
          
        //  req.upload.addEventListener("error", event => {
        //   const copy = { ...this.state.uploadProgress };
        //   copy[file.name] = { state: "error", percentage: 0 };
        //   this.setState({ uploadProgress: copy });
        //   reject(req.response);
        //  });
       
        //  const formData = new FormData();
        //  formData.append("file", file, file.name);
       
        //  req.open("POST", "/api/upload");
        //  req.send(formData);
        // });
    }
    render() {
        return (
            <div className="Upload">
              <div className="Content">
                <div>
                  <Dropzone
                    onFilesAdded={(files) => {
                        this.onFilesAdded(files);
                    }}
                    disabled={this.state.uploading || this.state.successfullUploaded}
                  />
                </div>
                <div className="Files">
                  {this.state.files.map(file => {
                    return (
                      <div key={file.name} className="Row">
                        <span className="Filename">{file.name}</span>
                        {this.renderProgress(file)}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="Actions">{this.renderActions()}</div>
            </div>
        );
    }
}

export default Upload;