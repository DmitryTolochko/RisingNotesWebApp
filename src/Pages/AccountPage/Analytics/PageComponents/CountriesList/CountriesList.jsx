import './CountriesList.css'

function CountriesList({
    data
}) {
    return(
        <div className="pie-chart-wrapper">
            <h2>Страна</h2>

            <ul className="countries-ul">
                {data.map((datarow, index)=>(
                    <li key={index} className="countries-li">
                        <span className="countries-label">
                            {datarow.label}
                        </span>
                        <hr style={{borderTop:`1px dashed #787885`}}/>
                        <span className="countries-value">
                            {datarow.value}
                        </span>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default CountriesList;