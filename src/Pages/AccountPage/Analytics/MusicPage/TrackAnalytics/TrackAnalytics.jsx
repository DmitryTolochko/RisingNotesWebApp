import { useState, useEffect} from "react";
import { axiosAuthorized, axiosUnauthorized } from "../../../../../Components/App/App";
import TrackAnalyticsCharts from "./Charts/TrackAnalyticsCharts";
import './TrackAnalytics.css'


const TrackAnalyticsOption = ({songId, songName}) =>{
    return(
        <option value={songId}>
            {songName ? songName : 'Loading'}
        </option>
    )
}

function TrackAnalytics({data}) {
    const [selectedTrack, setSelectedTrack] = useState(-1)
    const handleOptionChange = (e) =>{
        setSelectedTrack(e.target.value)
    }

    return (    
        <div className="ta-wrapper">
            <h2>Аналитика по треку</h2>
            <select className="wa-select" onChange={handleOptionChange}>
                <option value={-1}>
                    Выберите трек
                </option>
                {data.map((el,index)=>(
                    <TrackAnalyticsOption songId={el.songId} songName={el.songName} key={index}/>
                ))}
            </select>

            {selectedTrack != -1 && <TrackAnalyticsCharts songId={selectedTrack}/>}
        </div>
    );
}





export default TrackAnalytics;