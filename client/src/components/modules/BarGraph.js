import React, { Component } from 'react';
import './BarGraph.css';
import { HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

class BarGraph extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        const data = {
            labels: this.props.classes,
            datasets: [
                {
                    backgroundColor: 'rgb(214, 190, 241)',
                    borderColor: 'rgb(156, 51, 255)',
                    borderWidth: 2,
                    data: this.props.percentages,
                }
            ]
        };
        const options = {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Classification',
                fontSize: 18,
                fontFamily: 'Poppins',
                fontColor: '#000000'
            },
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                   display: true,
                   color: 'black',
                   font: {
                       family: 'Poppins',
                       fontSize: 18,
                       
                   },
                   anchor: 'end',
                   align: 'left',
                }
             },
             scales: {
                 xAxes: [{
                     ticks: {
                         fontFamily: 'Poppins',
                         max: 100,
                         min: 0,
                     },
                     scaleLabel: {
                        display: true,
                        labelString: 'Confidence',
                        fontFamily: 'Poppins',
                        fontColor: '#000000',
                        fontSize: 15,
                    },
                 }],

             }
        };
        return (
            <div className='BarGraph-container'>
                <HorizontalBar height={300} width={700} data={data} options={options}/>
            </div>
        )
    }
}
export default BarGraph;