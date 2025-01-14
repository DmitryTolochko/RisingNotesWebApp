import { LineChart } from "@mui/x-charts"
import { useEffect, useState } from "react"
import ChartGradient from "./ChartGradient"
import ChartPeriodSelector from "./ChartPeriodSelector"
import './Chart.css'

const Chart = ({
    id,
    title,
    dataset,
    height,
    colorFrom,
    colorTo,
    defaultRangeDays,
    onRangeUpdate=null
}) =>{
    const [selectedPeriod, setSelectedPeriod] = useState([7,30,180,365].includes(defaultRangeDays) ? defaultRangeDays : 7)
    const [xLabels, setXLabels] = useState(null)
    const [yValues, setYValues] = useState(null)
    const options = {
        margin: { left: 25, right: 25, top: 25, bottom: 25 },
        grid: { vertical: false, horizontal: true },
        series:[{
            data: yValues,
            color: colorFrom,
            area: true,
            id: id
        }],
        xAxis:[{
            data:xLabels
        }]
    }

    const css =`.MuiAreaElement-series-${id}{
        fill:url(#ChartGradient-id-${id}) !important;
    }`

    useEffect(()=>{
        if(onRangeUpdate)
            onRangeUpdate(selectedPeriod)
    },[selectedPeriod])

    useEffect(()=>{
        setXLabels(dataset? dataset.labels[0].data : null)
        setYValues(dataset? dataset.data : null)
    },[dataset])

    return(
        <>
            <div className="chart-wrapper">
                <h2>{title}</h2>
                <ChartPeriodSelector currentPeriod={selectedPeriod} setNewPeriod={setSelectedPeriod}/>
                {xLabels && yValues &&
                    <>
                        <LineChart
                            margin={options.margin}
                            grid={options.grid}
                            xAxis={options.xAxis}
                            series={options.series}
                            height={height}
                        />
                        <ChartGradient id={id} from={colorFrom} to={colorTo}/>
                    </>
                }
    
                
            </div>
            <style>{css}</style>
        </>
    )
    

}

export default Chart