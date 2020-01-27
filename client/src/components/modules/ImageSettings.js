import React, { Component } from 'react';
import './ImageSettings.css';

class ImageSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: ['Class 1'],
            images: {
                0 : [],
            },
            deleteImage: {
                classification: null,
                index: null,
            },
            classID: 1,
        };
    }
    componentDidMount() {
        // pass the first classes up to parent 
        this.props.onNewClass(this.state.classes[0]);
    }
    componentDidUpdate(prevProps) {
        // make sure passed down image is different from before
        if (this.props.imageSrc !== prevProps.imageSrc && this.props.imageSrc !== null && this.props.selectedClassIndex !== null) {
            // add image to the selected class through webrowser
            let images = this.state.images;
            images[this.props.selectedClassIndex].push(this.props.imageSrc);
            this.setState({
                images: images,
            }, () => this.onChangeImageState());
        }
        else if (this.props.imageSrcs !== prevProps.imageSrcs && this.props.imageSrcs !== null && this.props.selectedClassIndex !== null) {
            // add image to the selected class through upload
            let images = this.state.images;
            images[this.props.selectedClassIndex] = images[this.props.selectedClassIndex].concat(this.props.imageSrcs);
            this.setState({
                images: images,
            }, () => this.onChangeImageState());
        }
        else if (prevProps.savedData === null && this.props.savedData !== null) {
            let images = this.props.savedData.images;
            let classes = this.props.savedData.classes;
            this.setState({
                images: images,
                classes: classes,
            }, () => this.onChangeImageState());
        }
    }
    onChangeImageState() {
        // call this function when change the images in state
        this.props.onChangeImages(this.state.classes, this.state.images);
    }
    onCreateNewClass() {
        let newClassName = `Class ${this.state.classID + 1}`
        let images = this.state.images;
        images[this.state.classes.length] = [];
        this.setState(prevState => ({
            classes: prevState.classes.concat([newClassName]),
            images: images,
            classID: prevState.classID + 1,
        }), () => this.onChangeImageState());
        this.props.onNewClass(newClassName);
    }
    onNewClassName(classIndex, evt) {
        let classes = this.state.classes;
        let newClassName = evt.target.value;
        classes[classIndex] = newClassName;
        this.setState({
            classes: classes,
        });
        this.props.onRenameClass(newClassName, classIndex);
    }
    onDeleteClass(classIndex) {
        // shift all the above ones down
        let images = this.state.images;
        for (let i = classIndex; i < this.state.classes.length; i++) {
            if (i === this.state.classes.length - 1) {
                delete images[i];
            }
            else {
                images[i] = images[i + 1];
            }
        }
        this.setState(prevState => ({
            classes: prevState.classes.filter((prevClassification, index) => index !== classIndex),
            images: images,
        }), () => this.onChangeImageState());
        this.props.onDeleteClass(classIndex);
    }
    onClearClass(classIndex) {
        let images = this.state.images;
        images[classIndex] = [];
        this.setState({
            images: images,
        }, () => this.onChangeImageState());
    }
    onEnterImage(classIndex, imageIndex) {
        console.log('entering index ' + imageIndex);
        this.setState({
            deleteImage: {
                classIndex: classIndex,
                imageIndex: imageIndex,
            },
        });
    }
    onLeaveImage(classIndex, imageIndex) {
        console.log('leaving index ' + imageIndex);
        if (imageIndex === this.state.deleteImage.imageIndex && classIndex === this.state.deleteImage.classIndex) {
            this.setState({
                deleteImage: {
                    classIndex: null,
                    imageIndex: null,
                },
            });
        }
    }
    onDeleteImage(classIndex, imageIndex) {
        console.log('deleting index ' + imageIndex);
        let images = this.state.images;
        images[classIndex] = images[classIndex].filter((img, index) => index !== imageIndex);
        this.setState({
            images: images,
        }, () => this.onChangeImageState());
    }
    onLeaveImages() {
        this.setState({
            deleteImage: {
                classIndex: null,
                imageIndex: null,
            },
        });
    }
    render() {
        console.log('on ' + this.state.deleteImage.index);
        let classes = this.state.classes.map((classification, classIndex) => {
            let images = this.state.images[classIndex].map((imageSrc, imageIndex) => {

                let trash = this.state.deleteImage.imageIndex === imageIndex && this.state.deleteImage.classIndex === classIndex ? (
                    <img className='ImageSettings-deleteImage' src={require('../../public/trash.png')} onClick={() => this.onDeleteImage(classIndex, imageIndex)} 
                    onMouseEnter={() => this.onEnterImage(classIndex, imageIndex)} onMouseLeave={() => this.onLeaveImage(classIndex, imageIndex)}/>
                ) : (<div> </div>);
                return (
                    <div>
                        <img className='ImageSettings-image' id={imageSrc} src={imageSrc} key={imageIndex} onMouseEnter={() => this.onEnterImage(classIndex, imageIndex)}
                        onMouseLeave={() => this.onLeaveImage(classIndex, imageIndex)}/>
                        {trash}
                    </div>
                );
            });
            if (images.length === 0) {
                images = (
                    <div className='ImageSettings-noImages'>
                        Add images to this class!
                    </div>
                )
            }
            let classificationName = (
                <input className='ImageSettings-classNameEditing' type='text' key={'editing' + classIndex}
                onChange={(evt) => this.onNewClassName(classIndex, evt)} value={classification}/>
            );
            const imagesLength = images.length;
            let amountOfImages = imagesLength > 0 ? (
                <div className='ImageSettings-imageAmount'>
                    {`${this.state.images[classIndex].length} image${imagesLength > 1 ? 's' : ''}`}
                </div>
            ) : (<div></div>);
            let deleteButton = (
                <div className={`ImageSettings-delete`} key={'image' + classIndex}
                onClick={() => this.onDeleteClass(classIndex)}>
                    Delete
                </div>
            );
            let clearButton = (
                <div className={`ImageSettings-clear`} key={'clear' + classIndex}
                onClick={() => this.onClearClass(classIndex)}>
                    Clear
                </div>
            )
            return (
                <div className='ImageSettings-class' key={'class' + classIndex}>
                    <div className='ImageSettings-classRow'>
                        {classificationName}
                        <div className='ImageSettings-buttons'>
                            {imagesLength > 0 && clearButton}
                            {this.state.classes.length > 1 && deleteButton}
                        </div>
                    </div>
                    <div className='ImageSettings-images' key={'image' + classIndex} onMouseLeave={() => this.onLeaveImages()}>
                        {images}
                    </div>
                    {amountOfImages}
                </div>
            )
        });
        let newClass = classes.length === 5 ? (<div></div>) : (
            <div className='ImageSettings-newClass' onClick={() => this.onCreateNewClass()}>
                New Class
            </div>
        );
        classes.push(newClass);
        return (
            <div className='ImageSettings-container'>
                {classes}
            </div>
        );
    }
}

export default ImageSettings;