import { useState, useEffect} from "react";
import { axiosAuthorized, axiosUnauthorized } from "../../../../../Components/App/App";
import './TrackAnalytics.css'
import Chart from "../../PageComponents/LineChart/Chart";

const TrackAnalyticsOption = ({id}) =>{
    const [trackName, setTrackName] = useState(null)
    const [trackImage, setTrackImage] = useState(null)

    async function getTrackData(songId){
        await axiosAuthorized.get(`/api/song/${songId}`).then(response => {
            setTrackName(response.data.name)
        });
    }

    async function getTrackImageLink(songId) {
        await axiosUnauthorized.get(`api/song/${songId}/logo/link`).then(response => {
            setTrackImage(response.data.presignedLink);
        })
    }

    useEffect(()=>{
        getTrackData(id)
        getTrackImageLink(id)
    },[])

    return(
        <option value={id}>
            {/* <img className="tao-img" src={trackImage} alt="" />  
            Img не рендерится внтури option  */} 
            {trackName ? trackName : 'Loading'}
        </option>
    )
}


const TrackAnalyticsCharts = ({id}) =>{
    const datasetListen = {
        labels:[{ data: [1, 2, 3, 5, 8, 10] }],
        data:[2, 5.5, 2, 8.5, 1.5, 5]
    }
    const datasetFavourites = {
        labels:[{ data: [1, 2, 3, 5, 8, 10] }],
        data:[2, 5.5, 2, 8.5, 1.5, 5]
    }

    useEffect(()=>{
        //Fetch data for charts
    },[])

    return(
        <div className="cw-bottom-charts">
                <Chart
                    id={100}
                    title={'Прослушивания'} 
                    dataset={datasetListen}
                    height={300}
                    colorFrom={'rgba(254, 17, 112, 1)'}
                    colorTo={'rgba(254, 17, 112, 0)'}
                    defaultRangeDays={30}
                />
                <Chart
                    id={101}
                    title={'Добавили в избранное'} 
                    dataset={datasetFavourites}
                    height={300}
                    colorFrom={'rgba(1, 179, 255, 1)'}
                    colorTo={'rgba(1, 179, 255, 0)'}
                    defaultRangeDays={30}
                />
        </div>
    )
}

function TrackAnalytics({options}) {
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
                {options.map((id,index)=>(
                    <TrackAnalyticsOption id={id} setSelectedTrack={setSelectedTrack} key={index}/>
                ))}
            </select>

            {selectedTrack != -1 && <TrackAnalyticsCharts id={selectedTrack}/>}
        </div>
    );
}





export default TrackAnalytics;