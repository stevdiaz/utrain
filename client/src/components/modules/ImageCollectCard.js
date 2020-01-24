import React, { Component } from 'react';
import './ImageCollectCard.css';
import ImageUpload from './ImageUpload';
import ImageSettings from './ImageSettings';

class ImageCollectCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null,
            imageSrcs: null,
            selectedClassIndex: null,
            classes: [],
            fileURL: null,
            options: null,
            types: null,
        }
    }
    componentDidMount() {

    }
    onCapture(imageSrc, selectedClassIndex) {
        this.setState({
            imageSrc: imageSrc,
            selectedClassIndex: selectedClassIndex,
        });
    }
    onNewClass(newClassName) {
        this.setState(prevState => ({
            classes: prevState.classes.concat([newClassName]),
        }));
    }
    onRenameClass(newClassName, classIndex) {
        let classes = this.state.classes;
        classes[classIndex] = newClassName;
        this.setState({
            classes: classes,
        });
    }
    onDeleteClass(classIndex) {
        this.setState(prevState => ({
            classes: prevState.classes.filter((classification, index) => index !== classIndex),
        }));
    }
    onFilesAdded(imageSrcs, selectedClassIndex) {
        this.setState({
            imageSrcs: imageSrcs,
            selectedClassIndex: selectedClassIndex,
        });
    }
    onChangeImages(classes, images) {
        this.props.onChangeImages(classes, images);
    }
    render() {
        return (
            <div className="ImageCollectCard-container">
                <div className='ImageCollectCard-step'>
                    Step 1: Collect Data
                </div>
                <div className='ImageCollectCard-components'>
                    <ImageUpload onCapture={(imageSrc, selectedClassIndex) => this.onCapture(imageSrc, selectedClassIndex)} classes={this.state.classes}
                    onFilesAdded={(imageSrcs, selectedClassIndex) => this.onFilesAdded(imageSrcs, selectedClassIndex)}/>
                    <ImageSettings savedData={this.props.savedData} imageSrc={this.state.imageSrc} imageSrcs={this.state.imageSrcs} selectedClassIndex={this.state.selectedClassIndex}
                    onNewClass={(newClassName) => this.onNewClass(newClassName)} onRenameClass={(newClassName, classIndex) => this.onRenameClass(newClassName, classIndex)}
                    onDeleteClass={(classIndex) => this.onDeleteClass(classIndex)} onChangeImages={(classes, images) => this.onChangeImages(classes, images)}/>
                </div>
            </div>
        )
    }
}

export default ImageCollectCard;