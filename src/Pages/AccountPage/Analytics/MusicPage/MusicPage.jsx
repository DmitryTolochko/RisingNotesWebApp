import './MusicPage.css'
import { useState, useEffect } from 'react';
import ChartPeriodSelector from '../PageComponents/LineChart/ChartPeriodSelector';
import TopTracksList from './TopTracksList/TopTracksList';
import TrackAnalytics from './TrackAnalytics/TrackAnalytics';
import Skeleton from 'react-loading-skeleton';
import { axiosAuthorized } from '../../../../Components/App/App';
import moment from 'moment/moment';

function MusicPage() {
    const [popularTracks, setPopularTracks] = useState([])
    const [selectedPeriod, setSelectedPeriod] = useState(30)

    const fetchTopTracks = async () => {
        const fromDate = moment().subtract(selectedPeriod, 'days').format('YYYY-MM-DD')
        await axiosAuthorized.get(`/api/analytics/song/top5?FromDate=${fromDate}`).then(
            response => {
                if(!response) return
                
                const list = response.data.songList 
                setPopularTracks(list)
            }
        )
    }

    useEffect(()=>{
        fetchTopTracks()
    },[])

    useEffect(()=>{
        fetchTopTracks()
    },[selectedPeriod])

    return ( 
        <>
            <div className="top-tracks">
                <h2>Популярные треки</h2>
                <ChartPeriodSelector  currentPeriod={selectedPeriod} setNewPeriod={setSelectedPeriod} style={{marginTop:15}}/>

                {popularTracks == null ? 
                    <Skeleton style={{ height:25, marginBottom:15}} baseColor='#0F141D' highlightColor="#2C323D" count={5}/> :
                    <TopTracksList data={popularTracks}/>
                }
            </div>
                {!popularTracks ? 
                    <Skeleton style={{marginTop:40, borderRadius:8}} baseColor='#0F141D' highlightColor="#2C323D" height={70} />:
                    <TrackAnalytics data={popularTracks}/>
                }
            
        </>
    );
}

export default MusicPage;