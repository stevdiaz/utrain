import React, { Component } from 'react';
import { Link } from '@reach/router';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import './NavBar.css';

const GOOGLE_CLIENT_ID = "913047107914-lv5bn822famjelijhv0nipk9q8vqie36.apps.googleusercontent.com";

class NavBar extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <nav className='NavBar-container'>
                <div className='NavBar-title'>
                    <Link to="/" className='NavBar-link NavBar-titleLink'>
                        UTrain
                    </Link>
                </div>
                <div className='NavBar-links'>
                    {this.props.userId && (
                        <>
                            <Link to="/learn" className='NavBar-link'>
                                Learn
                            </Link>
                            <Link to="/create" className='NavBar-link'>
                                Create
                            </Link>
                            <Link to={`/profile/${this.props.userId}`} className="NavBar-link">
                                Profile
                            </Link>
                        </>
                    )}
                    {this.props.userId ? (
                        <GoogleLogout
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Logout"
                        onLogoutSuccess={this.props.handleLogout}
                        onFailure={(err) => console.log(err)}
                        className="NavBar-link NavBar-login"
                        />
                    ) : (
                        <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.props.handleLogin}
                        onFailure={(err) => console.log(err)}
                        className="NavBar-link NavBar-login"
                        />
                    )}
                </div>
            </nav>
        )
    }
}

export default NavBar;