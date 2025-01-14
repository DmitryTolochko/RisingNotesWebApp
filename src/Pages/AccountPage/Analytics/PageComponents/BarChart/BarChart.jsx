import { useEffect, useState } from 'react';
import ChartPeriodSelector from '../LineChart/ChartPeriodSelector';
import ChartGradient from '../LineChart/ChartGradient';
import './BarChart.css'
import { BarChart } from '@mui/x-charts/BarChart';

function Bar({
    dataValues,
    dataLabels,
    title,
    color,
    colorFrom=null,
    colorTo=null,
    barId=null,
    onRangeUpdate=null,
    height=300
}) {
    const [selectedPeriod, setSelectedPeriod] = useState(30)

    const options = {
        title:title,
        series:[{
            data: dataValues,
            id: barId ? barId : 'uv',
            color: color
        }],
        xAxis:[{ data: dataLabels, scaleType: 'band' }],
        grid:{horizontal:true},
        height: height,

        //Для градиента в столбцах 
        css: barId ? `.MuiBarElement-series-${barId}{
            fill:url(#ChartGradient-id-${barId}) !important;
        }` : ''
    }

    useEffect(()=>{
        if(onRangeUpdate)
            onRangeUpdate(selectedPeriod)

        console.log(options);
        
    },[selectedPeriod])
    
    return ( 
        <div className="bar-chart-wrapper">
            <h2>{options.title}</h2>
            {onRangeUpdate && <ChartPeriodSelector style={{width:'100%', paddingLeft:40}} currentPeriod={selectedPeriod} setNewPeriod={setSelectedPeriod}/>}
            {options.series[0].data.length == 0 && <span style={{marginTop: '25%'}}> Упс, тут пока что пусто</span>}
            {options.series[0].data.length != 0 && 
                <BarChart
                    grid={options.grid}
                    height={options.height}
                    series={options.series}
                    xAxis={options.xAxis}
                    />
            }
            {colorFrom && colorTo && <ChartGradient id={barId} from={colorFrom} to={colorTo}/>}
            <style>{options.css}</style>
        </div>
    );
}

export default Bar;