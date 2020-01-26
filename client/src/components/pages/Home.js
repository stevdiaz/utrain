import React, { Component } from 'react';
import './Home.css';
import { Link } from "@reach/router";
import GoogleLogin from 'react-google-login';

const GOOGLE_CLIENT_ID = "913047107914-lv5bn822famjelijhv0nipk9q8vqie36.apps.googleusercontent.com";


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
                    Machine Learning, Meet <span className='Home-bold'>UTrain</span>.
                </div>
                <div className='Home-description'>
                    An easy and fun way to train your machine learning models through the web. <div>No Tensors. No Torches. All you.</div>
                </div>
                <div className='Home-getStarted'>
                {this.props.userId ? (
                    <>
                        <Link to='/learn/' className='Home-link'>
                            <div className='Home-button Home-learn'>
                                Learn
                            </div>
                        </Link>
                        <Link to='/create/' className='Home-link'>
                            <div className='Home-button Home-create'>
                                Create
                            </div>
                        </Link>
                        <Link to={`/profile/${this.props.userId}`} className='Home-link'>
                            <div className='Home-button Home-Profile'>
                                Profile
                            </div>
                        </Link>
                    </>
                ) : (
                    <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.props.handleLogin}
                    onFailure={(err) => console.log(err)}
                    render={(renderProps) => (
                        <div className='Home-button Home-learn' onClick={renderProps.onClick}>
                            Login
                        </div>
                    )}
                    className="Home-link Home-login"
                    icon={false}
                    />
                )}
                </div>
            </div>
        )
    }
}

export default Home;