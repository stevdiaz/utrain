import React, { Component } from 'react';
import './LineGraph.css';
import {Line} from 'react-chartjs-2';


class LineGraph extends Component {
    constructor(props) {
        super(props);
        
    }
    componentDidMount() {

    }
    render() {
        const data = {
            labels: this.props.epochs,
            datasets: [
              {
                label: 'Losss',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: this.props.losses
              }
            ]
          }
        let options = {
            // customize chart option
            title:{
                display: true,
                text: 'Model Loss',
                fontSize: 20
              },
            responsive: true,
            maintainAspectRatio: false,
            // layout: {
            //     padding: {
            //         top: 5,
            //         left: 15,
            //         right: 15,
            //         bottom: 15
            //     }
            // },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Epochs',
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Loss',
                    }
                }]
            },
        };

        return (
            <div className='LineGraph-container'>
                <Line data={data} options={options} />
            </div>
        )
    }
}

export default LineGraph;