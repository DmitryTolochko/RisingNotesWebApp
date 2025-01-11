import './MusicPage.css'
import { useState, useEffect } from 'react';
import ChartPeriodSelector from '../PageComponents/LineChart/ChartPeriodSelector';
import TopTracksList from './TopTracksList/TopTracksList';
import TrackAnalytics from './TrackAnalytics/TrackAnalytics';
import Skeleton from 'react-loading-skeleton';


function MusicPage() {
    const [popularTracks, setPopularTracks] = useState(null)
    const [selectedPeriod, setSelectedPeriod] = useState(30)

    const mockTopTracks = [
        "9b6fd832-6b43-445b-aec9-7a6b7f65d054",
        "563bb838-f834-4439-82fc-432adda3a5e5",
        "1224895c-e252-4bab-9ac0-02d7bad92412"
    ]

    useEffect(()=>{
        setTimeout(()=>{setPopularTracks(mockTopTracks)}, 1500 )
    },[])

    return ( 
        <>
            <div className="top-tracks">
                <h2>Популярные треки</h2>
                <ChartPeriodSelector  currentPeriod={selectedPeriod} setNewPeriod={setSelectedPeriod} style={{marginTop:15}}/>

                {!popularTracks ? 
                    <Skeleton style={{ height:25, marginBottom:15}} baseColor='#0F141D' highlightColor="#2C323D" count={5}/> :
                    <TopTracksList tracks={popularTracks}/>
                }
            </div>
                {!popularTracks ? 
                    <Skeleton style={{marginTop:40, borderRadius:8}} baseColor='#0F141D' highlightColor="#2C323D" height={70} />:
                    <TrackAnalytics options={mockTopTracks}/>
                }
            
        </>
    );
}

export default MusicPage;