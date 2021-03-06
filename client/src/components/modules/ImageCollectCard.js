import React, { Component } from 'react';
import './ImageCollectCard.css';
import ImageUpload from './ImageUpload';
import ImageSettings from './ImageSettings';
import Canvas from './Canvas';

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
            isUsingSaved: false,
        }
    }
    componentDidMount() {

    }
    componentDidUpdate() {
        if (this.props.savedData && !this.state.isUsingSaved) {
            this.setState({
                classes: this.props.savedData.classes,
                isUsingSaved: true,
            });
        }
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
                <div className='ImageCollectCard-column'>
                    <div className='ImageCollectCard-step'>
                        Step 1: Collect Data
                    </div>
                    {this.props.isImage ? (
                        <ImageUpload onCapture={(imageSrc, selectedClassIndex) => this.onCapture(imageSrc, selectedClassIndex)} classes={this.state.classes}
                        onFilesAdded={(imageSrcs, selectedClassIndex) => this.onFilesAdded(imageSrcs, selectedClassIndex)} />
                    ) : (
                        <Canvas onCapture={(imageSrc, selectedClassIndex) => this.onCapture(imageSrc, selectedClassIndex)} classes={this.state.classes} />
                    )}
                </div>
                <div className='ImageCollectCard-components'>
                    <ImageSettings savedData={this.props.savedData} imageSrc={this.state.imageSrc} imageSrcs={this.state.imageSrcs} selectedClassIndex={this.state.selectedClassIndex}
                    onNewClass={(newClassName) => this.onNewClass(newClassName)} onRenameClass={(newClassName, classIndex) => this.onRenameClass(newClassName, classIndex)}
                    onDeleteClass={(classIndex) => this.onDeleteClass(classIndex)} onChangeImages={(classes, images) => this.onChangeImages(classes, images)}/>
                </div>
            </div>
        )
    }
}

export default ImageCollectCard;