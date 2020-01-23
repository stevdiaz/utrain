import React, { Component } from 'react';
import './Profile.css';
import { post, get } from '../../utilities';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            titles: null,
        }
    }
    componentDidMount() {
        get('/api/user', { userid: this.props.userId }).then((user) => this.setState({ user: user }));
        get('/api/models/names').then((titles) => this.setState({titles: titles}));
    }
    render() {
        if (this.state.user === null || this.state.titles === null) {
            return (
                <div className='Profile-container'>
                    Loading...
                </div>
            )
        }
        else {
            console.log(this.state.titles);
            let models = this.state.titles.map(title => {
                let modelType;
                if (title.type === 'image') {
                    modelType = 'Image Model'
                }
                else {
                    modelType = 'Data Model'
                } 
                return (
                    <div className='Profile-savedCard'>
                        <div className='Profile-title'>
                            {title.title}
                        </div>
                        <div className='Profile-type'>
                            {modelType}
                        </div>
                        <textarea className={`Profile-description ${title.description === '' ? 'Profile-descriptionEmpty' : ''}`}
                        type='text' value={title.description === '' ? 'No description available' : title.description} readOnly />
                    </div>
                );
            })
            return (
                <div className='Profile-container'>
                    <div className='Profile-name'>
                        Welcome, {this.state.user.name}
                    </div>
                    <div className='Profile-saved'>
                        Saved Models
                    </div>
                    <div className='Profile-explanation'>
                        You have {this.state.titles.length} saved models. You can have at most 6 saved models at a time.
                    </div>
                    <div className='Profile-titles'>
                        {models}
                    </div>
                </div>
            )
        }
    }

}

export default Profile;