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
            isShare: false,
            titles: [],
            error: 'None',
        }
        this.ERROR_UNIQUE = 'Unique';
        this.ERROR_TITLE_LONG = 'Title Long';
        this.ERROR_DESCRIPTION_LONG = 'Description Long';
        this.ERROR_NONE = 'None';
        this.TITLE_LIMIT = 30;
        this.DESCRIPTION_LIMIT = 70;
    }
    componentDidMount() {
        get('/api/models/names').then((titles) => {
            console.log(titles);
            this.setState({
                titles: titles,
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
    onConfirmSave() {
        if (this.props.isData && this.state.error === this.ERROR_NONE) {
            console.log('saving to db');
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
    }
    onNewModelName(evt) {
        let errorString = this.ERROR_NONE;
        let title = evt.target.value;
        if (title.length > this.TITLE_LIMIT) {
            errorString = this.ERROR_TITLE_LONG;
        }
        else if (this.state.titles.includes(title)) {
            errorString = this.ERROR_UNIQUE;
        }
        this.setState({
            saveTitle: evt.target.value,
            error: errorString,
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
            error: errorString,
        });
    }
    onResetFields() {
        this.setState({
            isSave: false,
            saveTitle: "",
            saveDescription: "",
            isExport: false,
            isShare: false,
            error: 'None',
        })
    }
    onBackArrow() {
        this.onResetFields();
    }
    render() {
        let innerComponents = (
            <> 
                <div className='Options-question'>
                    How would you like to use your model?
                </div>
                <div className='Options-button Options-save' onClick={() => this.onSave()}>
                    Save
                </div>
                <div className='Options-button Options-exportModel'>
                    Export
                </div>
                <div className='Options-button Options-shareModel'>
                    Share
                </div>
            </>
        );
        if (this.state.isSave) {
            let titleUniqueError = this.state.error === this.ERROR_UNIQUE;
            let titleLongError = this.state.error === this.ERROR_TITLE_LONG;
            let descriptionError = this.state.error === this.ERROR_DESCRIPTION_LONG;
            let noError = this.state.error === this.ERROR_NONE;
            innerComponents = (
                <div className='Options-saveOptions'>
                    <div className='Options-saveDescription'>
                        Give your model a unique title and a short description to remember it
                    </div>
                    <input className={`Options-modelTitle ${titleUniqueError || titleLongError ? 'Options-modelTitleError' : ''}`} type='text'
                    onChange={(evt) => this.onNewModelName(evt)} placeholder='Title (required)' value={this.state.saveTitle}/>
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
        return (
            <div className='Options-container'>
                {innerComponents}
            </div>
        )
    }
}

export default Options;