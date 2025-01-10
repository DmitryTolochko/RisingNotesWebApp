import { PieChart } from '@mui/x-charts/PieChart';
import './PieChart.css'


function Pie({
    data,
    colors
}) {
    var totalValue = 0
    data.forEach(el=> totalValue += el.value)

    return ( 
            <div className="pie-chart-wrapper">
                <h2>Пол слушателей</h2>
                <PieChart
                    colors={colors}
                    series={[
                        {
                            data: data,
                            innerRadius: 85,
                            outerRadius: 140,
                            cy:150,
                            cx:150
                        },
                    ]}
                    height={300}
                    width={300}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                />
                <div className="pie-legend">
                    {data.map((datarow, index)=>(
                        <div className="legend-row" key={index}>
                            <div className="legend-label" style={{backgroundColor: colors[index]}}></div>
                            <span>{datarow.label}</span>
                            <hr className='legend-line' style={{borderTop:`1px dashed ${colors[index]}`}}/>
                            <span>{`${Math.round(datarow.value / totalValue * 100)}%`}</span>
                        </div>
                    ))}
                </div>
            </div>
    );
}

export default Pie;