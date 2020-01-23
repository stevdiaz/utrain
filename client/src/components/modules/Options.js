import React, { Component } from 'react';
import './Options.css';
import { post, get } from '../../utilities';
import { socket } from '../../client-socket';

class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSave: false,
            saveTitle: "",
            saveDescription: "",
            isExport: false,
            exportTitle: "",
            isShare: false,
            titles: [],
            titleError: 'None',
            descriptionError: 'None',
            hover: null,
        }
        this.ERROR_UNIQUE = 'Unique';
        this.ERROR_TITLE_LONG = 'Title Long';
        this.ERROR_DESCRIPTION_LONG = 'Description Long';
        this.ERROR_NONE = 'None';
        this.ERROR_TITLE_EMPTY = 'Title Empty';
        this.TITLE_LIMIT = 30;
        this.DESCRIPTION_LIMIT = 70;
        this.SAVE = 'save';
        this.EXPORT = 'export';
        this.SHARE = 'share';
    }
    componentDidMount() {
        get('/api/models/names').then((titles) => {
            console.log(titles);
            this.setState({
                titles: titles.map(title => title.title),
            });
        });
        // catch any other titles the user uses after this call is made
        socket.on('title', (title) => {
            if (!this.state.titles.includes(title)) {
                this.setState(prevState => ({
                    titles: prevState.titles.concat([title]),
                }));
            }
        });
    }
    onSave() {
        this.setState({
            isSave: true,
        });
    }
    onExport() {
        this.setState({
            isExport: true,
        });
    }
    onConfirmSave() {
        if (this.state.saveTitle.length === 0) {
            this.setState({
                titleError: this.ERROR_TITLE_EMPTY,
            });
        }
        else if (this.props.isData && this.state.error === this.ERROR_NONE) {
            console.log('saving to db...');
            let isRegression = this.props.neuralNetwork.config.architecture.task === 'regression';
            let epochs = this.props.neuralNetwork.config.training.epochs;
            let batchSize = this.props.neuralNetwork.config.training.batchSize;
            const body = {
                title: this.state.saveTitle,
                description: this.state.saveDescription,
                epochs: epochs,
                batchSize: batchSize,
                inputs: this.props.inputs,
                outputs: this.props.outputs,
                isRegression: isRegression,
                types: this.props.types,
                csv: this.props.fileURL,
            };
            post('/api/datamodel', body).then(title => {
                console.log('everything saved to db');
                console.log(title);
                this.onResetFields();
            });
        }
        else if (!this.props.isData && this.state.error === this.ERROR_NONE) {
            console.log('saving to db...');
            let epochs = this.props.neuralNetwork.config.epochs;
            let batchSize = this.props.neuralNetwork.config.batchSize;
            const body = {
                title: this.state.saveTitle,
                description: this.state.saveDescription,
                epochs: epochs,
                batchSize: batchSize,
                classes: this.props.classes,
                images: this.props.images,
            };
            post('/api/imagemodel', body).then(title => {
                console.log('everything saved to db');
                console.log(title);
                this.onResetFields();
            })
        }
    }
    onConfirmExport() {
        const exportCallback = () => {
            this.onResetFields();
        }
        let exportTitle = this.state.exportTitle.split(' ').join('_');
        if (exportTitle.length === 0) {
            this.props.neuralNetwork.save(exportCallback);
        }
        else {
            this.props.neuralNetwork.save(exportCallback, exportTitle);
        }
    }
    onNewModelSaveName(evt) {
        let errorString = this.ERROR_NONE;
        let title = evt.target.value;
        if (title.length > this.TITLE_LIMIT) {
            errorString = this.ERROR_TITLE_LONG;
        }
        else if (this.state.titles.includes(title)) {
            errorString = this.ERROR_UNIQUE;
        }
        else if (title.length === 0) {
            errorString = this.ERROR_TITLE_EMPTY;
        }
        this.setState({
            saveTitle: evt.target.value,
            titleError: errorString,
        });
    }
    onNewModelExportName(evt) {
        this.setState({
            exportTitle: evt.target.value,
        });
    }
    onNewModelDescription(evt) {
        let errorString = this.ERROR_NONE;
        let description = evt.target.value;
        if (description.length > this.DESCRIPTION_LIMIT) {
            errorString = this.ERROR_DESCRIPTION_LONG;
        }
        this.setState({
            saveDescription: evt.target.value,
            descriptionError: errorString,
        })
    }
    onResetFields() {
        this.setState({
            isSave: false,
            saveTitle: "",
            saveDescription: "",
            isExport: false,
            exportTitle: "",
            isShare: false,
            titleError: this.ERROR_NONE,
            descriptionError: this.ERROR_NONE,
            hover: null,
        });
    }
    onBackArrow() {
        this.onResetFields();
    }
    onEnter(state) {
        this.setState({
            hover: state,
        });
    }
    onLeaveAny() {
        this.setState({
            hover: null,
        });
    }
    render() {
        let innerComponents = (
            <> 
                <div className='Options-question'>
                    How would you like to use your model?
                </div>
                <div className='Options-button Options-save' onClick={() => this.onSave()} onMouseEnter={() => this.onEnter(this.SAVE)} onMouseLeave={() => this.onLeaveAny()}>
                    Save
                </div>
                {this.state.hover === this.SAVE && (
                    <div className='Options-under'>
                        Save the model's settings and data to your account
                    </div>
                )}
                <div className='Options-button Options-export' onClick={() => this.onExport()} onMouseEnter={() => this.onEnter(this.EXPORT)} onMouseLeave={() => this.onLeaveAny()}>
                    Export
                </div>
                {this.state.hover === this.EXPORT && (
                    <div className='Options-under'>
                        Export the model to use in your personal project
                    </div>
                )}
                <div className='Options-button Options-share'>
                    Share
                </div>
            </>
        );
        if (this.state.isSave) {
            let titleUniqueError = this.state.titleError === this.ERROR_UNIQUE;
            let titleLongError = this.state.titleError === this.ERROR_TITLE_LONG;
            let titleEmptyError = this.state.titleError === this.ERROR_TITLE_EMPTY;
            let descriptionError = this.state.descriptionError === this.ERROR_DESCRIPTION_LONG;
            let noError = this.state.titleError === this.ERROR_NONE && this.state.descriptionError === this.ERROR_NONE;
            innerComponents = (
                <div className='Options-saveOptions'>
                    <div className='Options-saveDescription'>
                        Give your model a unique title and a short description to remember it
                    </div>
                    <input className={`Options-modelTitle ${titleUniqueError || titleLongError || titleEmptyError ? 'Options-modelTitleError' : ''}`} type='text'
                    onChange={(evt) => this.onNewModelSaveName(evt)} placeholder='Title (required)' value={this.state.saveTitle}/>
                    {titleUniqueError && (
                        <div className='Options-titleError'>
                            You have used this title already
                        </div>
                    )}
                    {titleLongError && (
                        <div className='Options-titleError'>
                            This title is too long
                        </div>
                    )}
                    {titleEmptyError && (
                        <div className='Options-titleError'>
                            Title cannot be empty
                        </div>
                    )}
                    <textarea className={`Options-modelDescription ${descriptionError ? 'Options-modelDescriptionError' : ''}`} type='text'
                    onChange={(evt) => this.onNewModelDescription(evt)} placeholder='Description' value={this.state.saveDescription}/>
                    {descriptionError && (
                        <div className='Options-descriptionError'>
                            This description is too long
                        </div>
                    )}
                    <div className='Options-backRow'>
                        <img className='Options-backImage' src={require('../../public/back_arrow.png')} onClick={(evt) => this.onBackArrow()}/>
                        <div className={`Options-button Options-save Options-secondSave ${!noError ? 'Options-buttonDisabled' : ''}`} 
                        onClick={() => this.onConfirmSave()}>
                            Save
                        </div>
                    </div>
                </div>
            )
        }
        if (this.state.isExport) {
            const exportTitle = this.state.exportTitle.length === 0 ? 'model' : this.state.exportTitle.split(' ').join('_');
            const textFileValue = `Once exported, you'll find the two files ${exportTitle}.json and ${exportTitle}.weights.bin added to your downloads. \n For help on loading these files into your project, visit the ml5.js documentation.`;
            innerComponents = (
                <div className='Options-exportOptions'>
                    <div className='Options-exportDescription'>
                        Give your model a title to export it to your machine
                    </div>
                    <input className='Options-modelTitle' type='text'
                    onChange={(evt) => this.onNewModelExportName(evt)} placeholder='model' value={this.state.exportTitle}/>
                    <textarea className={'Options-exportExplanation'} type='text' readOnly value={textFileValue} />
                    <div className='Options-backRow'>
                        <img className='Options-backImage' src={require('../../public/back_arrow.png')} onClick={(evt) => this.onBackArrow()}/>
                        <div className='Options-button Options-export Options-secondExport' 
                        onClick={() => this.onConfirmExport()}>
                            Export
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className='Options-container'>
                {innerComponents}
            </div>
        )
    }
}

export default Options;