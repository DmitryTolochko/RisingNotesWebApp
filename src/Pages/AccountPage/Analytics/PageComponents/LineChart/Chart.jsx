import { LineChart } from "@mui/x-charts"
import { useState } from "react"
import './Chart.css'

import ChartGradient from "./ChartGradient"
import ChartPeriodSelector from "./ChartPeriodSelector"

const Chart = ({
    id,
    title,
    dataset,
    height,
    colorFrom,
    colorTo,
    defaultRangeDays
}) =>{
    const [selectedPeriod, setSelectedPeriod] = useState([7,30,180,365].includes(defaultRangeDays) ? defaultRangeDays : 7)
    const defaultMargin = { left: 25, right: 25, top: 25, bottom: 25 }
    const defaultGrid = { vertical: false, horizontal: true }
    const series = [{
        data: dataset.data ,
        color: colorFrom,
        area: true,
        id: id
    }]
    const xLabels = dataset.labels

    const css =`.MuiAreaElement-series-${id}{
        fill:url(#ChartGradient-id-${id}) !important;
    }`

    return(
        <>
            <div className="chart-wrapper">
                <h2>{title}</h2>
                <ChartPeriodSelector currentPeriod={selectedPeriod} setNewPeriod={setSelectedPeriod}/>
                <LineChart
                    margin={defaultMargin}
                    grid={defaultGrid}
                    xAxis={xLabels}
                    series={series}
                    height={height}
                />
                <ChartGradient id={id} from={colorFrom} to={colorTo}/>
            </div>
            <style>{css}</style>
        </>
    )
    

}

export default Chart