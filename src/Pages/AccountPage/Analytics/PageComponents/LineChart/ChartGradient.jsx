const ChartGradient = ({id, from, to}) =>{
    return(
        <svg width="100" height="50" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute'}}>
            <defs>
                <linearGradient id={`ChartGradient-id-${id}`} style={{transform:'rotate(90deg)'}}>
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to}/>
                </linearGradient>
            </defs>
        </svg>
    )
}

export default ChartGradient