/**
 * Created by Abdeltif Bouziane on 17/02/2019.
 */
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
// import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import React, {Component} from 'react';

class ChartComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartsData : {},
        };
    }

    getOption = () => {
        return {
            title: {
                text: 'rrr',
                subtext: 'eee'
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        type: ['line', 'bar', 'stack', 'tiled'],
                        title: {
                            line: 'Line Chart',
                            bar: 'Bar Chart',
                            stack: 'Stack',
                            tiled: 'Tiled'
                        },
                        default: {
                            tiled: true
                        }
                    },
                    saveAsImage: {show: true}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.chartsData.xAxis.data
            },
            yAxis: {
                type: 'value'
            },
            series: this.state.chartsData.series
        };
    };


    componentWillMount() {
        this.setState({
            chartsData : this.props.chartsData,
        })
    }


    componentDidUpdate(oldProps) {
        const newProps = this.props
        if(oldProps.chartsData !== newProps.chartsData) {
            this.setState({
                chartsData : this.props.chartsData,
            })

            console.log('state changed')
        }
    }


    render() {
        return (

            <div className='col-12'>
                <div className='parent'>

                    <ReactEcharts option={this.getOption()}  style={{height: '350px', width: '100%'}}   className='react_for_echarts' />

                </div>
            </div>
        );
    }
}

export default ChartComponent;