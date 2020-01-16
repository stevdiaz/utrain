import React, { Component } from 'react';
import './DisplayProgress.css';
import LineGraph from './LineGraph';


class DisplayProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            epochs: [],
            losses: [],
        }
    }
    componentDidMount() {
        
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('in display progress');
        console.log(this.props.epoch);
        if (this.props.epoch === null || this.props.loss === null) {
            if (this.state.epochs.length !== 0 || this.state.losses.length !== 0) {
                // stopped training
                this.setState({
                    epochs: [],
                    losses: [],
                });
            }
        }
        // only update if different data
        else if (this.props.epoch !== prevProps.epoch) {
            console.log(this.props.loss.val_loss);
            this.setState(prevState => ({
                epochs: prevState.epochs.concat([this.props.epoch]),
                losses: prevState.losses.concat([this.props.loss.val_loss]),
            }));
        }
    }
    render() {
        if (this.props.loss === null || this.props.epochs === null) {
            return (
                <div className='DisplayProgress-container'>
                    Training data will go here!
                </div>
            )
        }
        else {
            return (
                <div className='DisplayProgress-container'>
                    <LineGraph epochs={this.state.epochs} losses={this.state.losses} />
                </div>
            )
        }
    }
}

export default DisplayProgress;