
const ChartPeriodSelector = ({currentPeriod, setNewPeriod, style=null}) => {
    const periods = [7, 30, 180, 365]
    return(
        <div className="period-selector" style={style}>
            {periods.map((count, index)=>(
                <button
                    key={index} 
                    onClick={() => setNewPeriod(count) }
                    className={currentPeriod===count ? "period-selector-btn psb-active" : "period-selector-btn"}>
                        {count} дней
                </button>
            ))}
        </div>
    )
}

export default ChartPeriodSelector