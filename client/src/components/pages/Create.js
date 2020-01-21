import React, { Component } from 'react';
import './Create.css';
import { Link } from "@reach/router";

class Create extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }
    render() {
        return ( 
            <div className='Create-container'>
                <div className='Create-title'> 
                    Create your own Machine Learning models!
                </div>

                <div className='Create-options'>
                    <Link to='/datamodel/' className='Create-link'>
                        <div className='Create-button Create-dataButton'>
                            Data Model
                        </div>`
                    </Link>
                    <Link to='/imagemodel/' className='Create-link'>
                        <div className='Create-button Create-imageButton'>
                            Image Model
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}
export default Create