import React, { Component } from 'react';
import './Options.css';
import { post, get } from '../../utilities';
import { socket } from '../../client-socket';

class Options extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSave: false,
            isSaved: false,
            saveTitle: "",
            saveDescription: "",
            isExport: false,
            isExported: false,
            exportTitle: "",
            isShare: false,
            isShared: false,
            titles: [],
            titleError: 'None',
            descriptionError: 'None',
            success: null,
            hover: null,
        }
        this.ERROR_UNIQUE = 'Unique';
        this.ERROR_TITLE_LONG = 'Title Long';
        this.ERROR_DESCRIPTION_LONG = 'Description Long';
        this.ERROR_NONE = 'None';
        this.ERROR_TITLE_EMPTY = 'Title Empty';
        this.TITLE_LIMIT = 25;
        this.DESCRIPTION_LIMIT = 70;
        this.SAVE = 'save';
        this.EXPORT = 'export';
        this.SHARE = 'share';
        this.SAVED = 'saved';
        this.EXPORTED = 'exported';
        this.SHARED = 'shared';
        this.DELETED = 'deleted';
    }
    componentDidMount() {
        get('/api/models/names').then((metas) => {
            console.log(metas);
            this.setState({
                titles: metas.map(meta => meta.title),
            });
        });
        // catch any other titles the user uses after this call is made
        socket.on('create-meta', (meta) => {
            if (!this.state.titles.includes(meta.title)) {
                this.setState(prevState => ({
                    titles: prevState.titles.concat([meta.title]),
                }));
            }
        });
        socket.on('delete-meta', (meta) => {
            console.log('delete title ' + meta.title);
            if (this.state.isSaved && meta.title === this.state.saveTitle) {
                // we have deleted ourselves
                this.setState(prevState => ({
                    titles: prevState.titles.filter(title => title !== meta.title),
                    isSaved: false,
                    saveTitle: "",
                }));
            }
            else {
                this.setState(prevState => ({
                    titles: prevState.titles.filter(title => title !== meta.title),
                }));
            }
        });
    }
    componentDidUpdate(prevProps) {
        if (this.props.savedData !== null && !this.state.isSaved) {
            this.setState({
                isSaved: true,
                saveTitle: this.props.savedData.title,
            });
        }
        else if (prevProps.neuralNetwork !== null && this.props.neuralNetwork === null) {
            // new training session
            this.setState({
                isSaved: false,
                saveTitle: "",
            });
        }
    }
    onSave() {
        this.setState({
            isSave: true,
            success: null,
        });
    }
    onExport() {
        this.setState({
            isExport: true,
            success: null,
        });
    }
    onConfirmDelete() {
        if (this.state.isSaved) {
            const body = {
                title: this.state.saveTitle,
                type: this.props.isData ? 'data' : 'image',
            };
            post('/api/delete/model', body).then((meta) => {
                console.log('deleted ' + meta.title);
                this.setSuccess(this.DELETED);
            });
        }
    }
    onConfirmSave() {
        const noError = this.state.titleError === this.ERROR_NONE && this.state.descriptionError === this.ERROR_NONE;
        if (this.state.saveTitle.length === 0) {
            this.setState({
                titleError: this.ERROR_TITLE_EMPTY,
            });
        }
        else if (this.props.isData && noError) {
            this.setState({
                isLoading: true,
            });
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
                fileName: this.props.fileName,
            };
            post('/api/datamodel', body).then((meta) => {
                console.log('everything saved to db');
                console.log(meta);
                this.setSuccess(this.SAVED);
                this.onResetFields();
            });
        }
        else if (!this.props.isData && noError) {
            this.setState({
                isLoading: true,
            });
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
            post('/api/imagemodel', body).then(meta => {
                console.log('everything saved to db');
                console.log(meta);
                this.setSuccess(this.SAVED);
                this.onResetFields();
            });
        }
    }
    onConfirmExport() {
        const exportCallback = () => {
            this.setSuccess(this.EXPORTED);
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
    setSuccess(state) {
        // set success, and then after a while, unset it
        this.setState({
            success: state,
        }, () => setTimeout(() => this.setState({
            success: null,
        }), 3000));
        // remember model has been saved
        if (state === this.SAVED) {
            this.setState({
                isSaved: true,
            });
        }
        else if (state === this.DELETED) {
            this.setState({
                isSaved: false,
                saveTitle: "",
            });
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
        // only clear title if we aren't saved
        if (!this.state.isSaved) {
            this.setState({
                saveTitle: "",
            });
        }
        this.setState({
            isLoading: false,
            isSave: false,
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
        // either we have saved the model here, or parent told us we saved model before
        let isModelSaved = this.state.isSaved;
        let canSave = this.state.titles.length < 6;
        let saveAdditionalClass = '';
        if (isModelSaved) {
            saveAdditionalClass = 'Options-buttonDelete';
        }
        else if (!canSave) {
            saveAdditionalClass = 'Options-buttonDisabled';
        }
        let innerComponents = (
            <> 
                {this.state.success ? (
                    <div className='Options-question Options-success'>
                        Your model has been {this.state.success}!
                    </div>

                ) : (
                    <div className='Options-question'>
                        How would you like to use your model?
                    </div>
                )}
                <div className={`Options-button Options-save ${saveAdditionalClass}`} 
                onClick={() => {
                    if (isModelSaved) {
                        this.onConfirmDelete();
                    }
                    else if (canSave) {
                        this.onSave();
                    }
                }} onMouseEnter={() => this.onEnter(this.SAVE)} onMouseLeave={() => this.onLeaveAny()}>
                    {isModelSaved ? 'Delete' : 'Save'}
                </div>
                {this.state.hover === this.SAVE && !isModelSaved && canSave && (
                    <div className='Options-under'>
                        Save the model's settings and data to your account
                    </div>
                )}
                {this.state.hover === this.SAVE && !isModelSaved && !canSave && (
                    <div className='Options-under'>
                        Your account already has 6 saved models!
                    </div>
                )}
                {this.state.hover === this.SAVE && isModelSaved && (
                    <div className='Options-under'>
                        Delete this model's settings and data from your account
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
                {/* <div className='Options-button Options-share'>
                    Share
                </div> */}
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
                        <div className={`Options-button Options-save Options-secondSave ${this.state.isLoading || !noError ? 'Options-buttonDisabled' : ''}`} 
                        onClick={() => !this.state.isLoading && this.onConfirmSave()}>
                            {this.state.isLoading ? 'Saving' : 'Save'}
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.isExport) {
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
                        <div className={`Options-button Options-export Options-secondExport ${this.state.isLoading ? 'Options-buttonDisabled' : ''}`}
                        onClick={() => !this.state.isLoading && this.onConfirmExport()}>
                            {this.state.isLoading ? 'Exporting' : 'Export'}
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.props.neuralNetwork === null) {
            innerComponents = (
                <> </>
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