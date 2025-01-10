import { useEffect } from 'react';
import './BarChart.css'
import { BarChart } from '@mui/x-charts/BarChart';


function Bar({
    dataValues,
    dataLabels,
    label,
    color
}) {

    return ( 
        <div className="bar-chart-wrapper">
            <h2>{label}</h2>
            <BarChart
                width={1220}
                grid={{horizontal:true}}
                height={300}
                series={[
                    { data: dataValues, id: 'uvId',color:color },
                ]}
                xAxis={[{ data: dataLabels, scaleType: 'band' }]}
            />
        </div>
    );
}

export default Bar;