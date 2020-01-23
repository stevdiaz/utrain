import React, { Component } from 'react';
import './Home.css';
import { Link } from "@reach/router";

class Home extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }
    render() {
        return (
            <div className='Home-container'>
                <div className='Home-title'>
                    Welcome to UTrain
                </div>
                <div className='Home-description'>
                    A friendly place to train your own models. No coding. No tensors. All you.
                </div>
            </div>
        )
    }
}

export default Home;