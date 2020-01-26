import React, { Component } from 'react';
import './Profile.css';
import { Link, Redirect } from '@reach/router';
import { post, get } from '../../utilities';
import { socket } from '../../client-socket';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            metas: null,
            hover: null,
            pathName: null,
            isDeleting: false,
        }
    }
    componentDidMount() {
        get('/api/user', { userid: this.props.userId }).then((user) => this.setState({ user: user }));
        get('/api/models/names').then((metas) => this.setState({metas: metas}));
        // catch any metas the user has deleted on separate browser
        socket.on('delete-meta', (meta) => {
            this.setState(prevState => ({
                metas: prevState.metas.filter((prevMeta) => prevMeta.title != meta.title),
            }));
        });
        socket.on('create-meta', (meta) => {
            this.setState(prevState => ({
                metas: prevState.metas.concat([meta]),
            }));
        });
    }
    onEnterCard(title) {
        this.setState({
            hover: title,
        });
    }
    onLeaveCard() {
        this.setState({
            hover: null,
        });
    }
    onDeleteCard(meta) {
        this.setState({
            isDeleting: true,
        });
        const body = {
            title: meta.title,
            type: meta.type,
        };
        post('/api/delete/model', body).then((meta) => {
            console.log('deleted ' + meta.title);
            this.setState(prevState => ({
                metas: prevState.metas.filter((prevMeta) => prevMeta.title != meta.title),
                isDeleting: false,
            }));
        });
    }
    onLoadSavedModel(pathName) {
        this.setState({
            pathName: pathName,
        });
    }
    render() {
        if (this.state.user === null || this.state.metas === null) {
            return (
                <div className='Profile-container'>
                    Loading...
                </div>
            )
        }
        else if (this.state.pathName) {
            return (
                <Redirect to={this.state.pathName} />
            )
        }
        else {
            let models = this.state.metas.map(meta => {
                let modelType;
                let pathName;
                if (meta.type === 'image') {
                    modelType = 'Image Model';
                    pathName = `/imagemodel/${meta.title}`;
                }
                else {
                    modelType = 'Data Model'
                    pathName = `/datamodel/${meta.title}`;
                } 
                return (
                    <div className='Profile-savedCard' key={meta.title} onMouseEnter={(evt) => this.onEnterCard(meta.title)} onMouseLeave={(evt) => this.onLeaveCard()}>
                        <div className='Profile-title' key={meta.title + 'title'} onClick={(evt) => this.onLoadSavedModel(pathName)}>
                            {meta.title}
                        </div>
                        <div className='Profile-type' key={meta.title + 'type'} onClick={(evt) => this.onLoadSavedModel(pathName)}>
                            {modelType}
                        </div>
                        <textarea className={`Profile-description ${meta.description === '' ? 'Profile-descriptionEmpty' : ''}`}
                        type='text' value={meta.description === '' ? 'No description available' : meta.description} readOnly key={meta.title + 'text'} onClick={(evt) => this.onLoadSavedModel(pathName)}/>
                        {this.state.hover === meta.title && (
                            <div className='Profile-deleteCard' onClick={(evt) => this.onDeleteCard(meta)} key={meta.title + 'delete'}>Delete Model</div>
                        )}
                    </div>
                );
            })
            const numModels = this.state.metas.length;
            let getStarted = (
                <div className='Profile-noModels'>
                    Start Training!
                    <div className='Profile-startButtons'>
                        <Link to='/learn/' className='Profile-link'>
                            <div className='Profile-getStarted'>
                                Learn
                            </div>
                        </Link>
                        <Link to='/create/' className='Profile-link'>
                            <div className='Profile-getStarted'>
                                Create
                            </div>
                        </Link>
                    </div>
                </div>
            )
            return (
                <div className='Profile-container'>
                    <div className='Profile-name'>
                        Welcome, {this.state.user.name}
                    </div>
                    {numModels > 0 && (
                        <>
                            <div className='Profile-saved'>
                                Saved Models
                            </div>
                            <div className='Profile-explanation'>
                                {`You have ${numModels} saved model${numModels !== 1 ? 's' : ''}. You can have up to 6 saved models at a time.`}
                            </div>
                            {this.state.isDeleting && (
                                 <div className='Profile-deleting'>
                                    Deleting Model ...
                                </div>
                            )}
                            <div className='Profile-titles'>
                                {models}
                            </div>
                        </>
                    )}
                    {numModels === 0 && (
                        getStarted
                    )}
                </div>
            )
        }
    }

}

export default Profile;