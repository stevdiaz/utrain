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
                label: 'Loss',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgb(156, 51, 255)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1.5,
                data: this.props.losses
              }
            ]
        };
        let options = {
            legend: {
                display: false,
            },
            title:{
                display: true,
                text: 'Model Loss',
                fontSize: 20,
                fontFamily: 'Poppins',
                fontColor: '#000000'
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Epochs',
                        fontFamily: 'Poppins',
                        fontColor: '#000000',
                        fontSize: 15,
                    },
                    ticks: {
                        fontFamily: 'Poppins',
                        fontColor: '#000000',
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Loss',
                        fontFamily: 'Poppins',
                        fontColor: '#000000',
                        fontSize: 15,
                    },
                    ticks: {
                        fontFamily: 'Poppins',
                        fontColor: '#000000',
                    },
                }]
            },
            plugins: {
                datalabels: {
                   display: false,
                }
             },
        };

        return (
            <div className='LineGraph-container'>
                <Line height={500} width={700} data={data} options={options} />
            </div>
        )
    }
}

export default LineGraph;