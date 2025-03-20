import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Playlists from './Playlists';
import Subscriptions from './Subscriptions';
import Tracks from './Tracks';
import heartIcon from '../../Images/featured/Heart_01.svg'
import copyIcon from '../../Images/featured/Copy.svg'
import tracksIcon from '../../Images/featured/Vector.svg'
import subsIcon from '../../Images/featured/Subs.svg'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../Components/Loader/Loader';
import BackButton from '../../Components/BackButton';
import './Featured.css';
import { getSongInfo } from '../../Api/Song';

export default function Featured() {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('main')
    const tabs = [
        {id:'main', label: 'Главная', image: heartIcon},
        {id:'playlists', label: 'Плейлисты', image: copyIcon},
        {id:'tracks', label: 'Треки', image: tracksIcon},
        {id:'subscriptions', label: 'Подписки', image: subsIcon}
    ]

    const playlists = useSelector((state) => state.playlists.value);
    const featured = useSelector((state) => state.featured.value);
    const subscriptions = useSelector((state) => state.subscriptions.value)
  
    useEffect(() => {
        if (!cookies.role) {
            navigate("/login");
        }
        getSongs();
    }, []);

    async function getSongs() {
        let array = [];
        for (var id of featured) {
            array.push(await getSongInfo(id, undefined));
        }
        setSongs(array);
        setIsLoaded(true);
    }

    const TabSelector = () =>{
        return(
            <>
                <h1 className='featured-title'>Избранное</h1>
                <nav className='featured-nav'>
                    {tabs.map((tab, index)=>(
                        <button 
                            key={index} 
                            className={tab.id == activeTab? "featured-nav__tab-button active" :"featured-nav__tab-button" }
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <img src={tab.image} alt="" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </>
        )
    }

    return (
        <div className='comment-page-wrapper'>
            <div className='featured'>
                <BackButton/>
                {!isLoaded ? 
                    <Loader/> : 
                    <>
                        <TabSelector/>
                        {(activeTab == 'main' || activeTab == 'playlists') && <Playlists playlists={playlists} activeTab={activeTab} setActiveTab={setActiveTab}/>}
                        {(activeTab == 'main' || activeTab == 'tracks') && <Tracks songs={songs} activeTab={activeTab} setActiveTab={setActiveTab} featured={featured}/>}
                        {(activeTab == 'main' || activeTab == 'subscriptions') && <Subscriptions subscriptions={subscriptions} activeTab={activeTab} setActiveTab={setActiveTab}/>}
                    </>
                }
            </div>
        </div>
    )
}