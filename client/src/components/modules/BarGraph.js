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
                    backgroundColor: '#C1C9FF',
                    borderColor: '#DA63FF',
                    borderWidth: 2,
                    data: this.props.percentages,
                }
            ]
        };
        const formatter = (value, context) => {
            const data = context.dataset.data;
            const maxValue = Math.max(...data);
            const maxValueCount = data.filter(value => value === maxValue).length
            let percentage = value + '%';
            if (maxValueCount > 1 && value === maxValue) {
                // non-unique max value
                percentage = percentage + " (Tied)";
            }
            else if (value === maxValue) {
                // unique max value
                percentage = percentage + " (Most Likely)";
            }
            else if (value < 3) {
                // too small to show
                percentage = '';
            }
            return percentage;
        }
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
            tooltips: {
                enabled: false,
            },
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
                   formatter: formatter,
                },
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