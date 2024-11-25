import React, { useEffect, useState} from 'react';
import { useNavigate, redirect } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Playlist from '../../Components/Playlist';
import Song from '../../Components/Song/Song';
import newPlaylist from '../../Images/featured/newplaylist.png';
import Subscription from '../../Components/Subscription';
import { api, axiosAuthorized, axiosUnauthorized} from '../../Components/App/App';
import { useCookies } from 'react-cookie';

import heartIcon from '../../Images/featured/Heart_01.svg'
import copyIcon from '../../Images/featured/Copy.svg'
import tracksIcon from '../../Images/featured/Vector.svg'
import subsIcon from '../../Images/featured/Subs.svg'

import { useSelector, useDispatch } from 'react-redux'
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';

import './Featured.css';
import Loader from '../../Components/Loader/Loader';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import arrowRight from '../../Images/artist-card/Chevron_Right.svg'
import { updatePlayerQueueName } from '../../Redux/slices/playerQueueSlice';

export default function Featured() {
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();

    const playlists = useSelector((state) => state.playlists.value);
    const featured = useSelector((state) => state.featured.value);
    const playableList = useSelector((state) => state.songs.value);
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
            await axiosUnauthorized.get(api + `api/song/${id}`)
            .then(response => {
                array.push(response.data);
            })
            .catch(err => {console.log(err)});
        }
        setSongs(array);
        setIsLoaded(true);
    }

    async function addNewPlaylist() {
        let id = 0
        let formData = new FormData();
        formData.append('Name', 'Новый плейлист')
        await axiosAuthorized.post(api + 'api/playlist', formData, { headers: {
            "Content-Type": "multipart/form-data",
        }})
        .then (
            response => {
                id = response.data.id
                dispatch(updatePlaylistsValue([...playlists, id]))
            }
        )
        navigate(`/playlist/${id}`)
    };

    function updatePlayableList (startId) {
        // Обновить текущий список вопроизведения
        let arr = featured.slice(featured.findIndex(e => e === startId));
        dispatch(updateSongsValue(arr));
        dispatch(updateMusicIsPlayingValue(true));
        dispatch(updatePlayerQueueName('Избранные треки'));
    }

    const tabs = [
        {id:'main', label: 'Главная', image: heartIcon},
        {id:'playlists', label: 'Плейлисты', image: copyIcon},
        {id:'tracks', label: 'Треки', image: tracksIcon},
        {id:'subscriptions', label: 'Подписки', image: subsIcon}
    ]


    const [activeTab, setActiveTab] = useState('main')


    const ShowMoreBtn = ({collection, redirect, maxValue}) => {
        console.log(collection?.length,maxValue, collection?.length > maxValue)
        return(
            <button className='featured-show-more' onClick={() => setActiveTab(redirect)}>
                {collection?.length > maxValue && activeTab=='main' ?
                        <>
                            <span>Смотреть все</span>
                            <img src={arrowRight} alt="" />
                        </>
                        : <></>
                }
            </button>
        )
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

    const Playlists = () =>{
        const playlistsToShow = playlists?.length>5 && activeTab=='main' ? playlists.slice(0,5) : playlists
        return(
            <section className='featured-section'>
                <div className="featured-section__title_wrapper">
                    <h2 className='featured-section__title'>Плейлисты</h2>
                    <ShowMoreBtn collection={playlists} redirect={'playlists'} maxValue={5}/>
                </div>
                <div className="playlists">
                    {playlistsToShow?.map(el => (
                        <Playlist id={el}/>
                    ))}
                    <div draggable='false' className='playlist'>
                        <img draggable='false' className='new-playlist' alt='add new playlist' src={newPlaylist} onClick={addNewPlaylist}/>
                    </div>
                </div>
            </section>
        )
    }


    const Tracks = () =>{
        const songsToShow = songs?.length>5 && activeTab=='main' ? songs.slice(0,5) : songs
        return(
            <section className='featured-section'>
                <div className="featured-section__title_wrapper">
                    <h2 className='featured-section__title'>Треки</h2>
                    <ShowMoreBtn collection={songs} redirect={'tracks'} maxValue={5}/>
                </div>
                <div className='tracks'>
                    {songsToShow.map(el => (
                        <Song 
                            id={el.id} 
                            name={el.name} 
                            duration={el.durationMs} 
                            artist={el.authorName} 
                            genres={el.genreList}
                            onClick={updatePlayableList}
                        />
                    ))}
                    {songs.length === 0 ? <p style={{color: '#FE1170'}}>Список пуст</p> : <></>}
                </div>
            </section>
        )
    }
    const Subscriptions = () =>{
        const subscriptionsToShow = subscriptions?.length>5 && activeTab=='main' ? subscriptions.slice(0,5) : subscriptions
        return(
            <section className='featured-section'>
                <div className="featured-section__title_wrapper">
                    <h2 className='featured-section__title'>Подписки</h2>
                    <ShowMoreBtn collection={subscriptions} redirect={'subscriptions'} maxValue={5}/>
                </div>
                <div>
                    {subscriptionsToShow.map((id) =>
                        <Subscription authorId={id}/>
                    )}
                </div>
            </section>
        )
    }

    const Main = () =>{
        return(
            <>
                <Playlists/>
                <Tracks/>
                <Subscriptions/>
            </>
        )
    }

    const FeaturedContent = ({tab}) =>{
        switch(tab){
            case 'main':
                return(<Main/>)
            case 'playlists':
                return(<Playlists/>)
            case 'tracks':
                return(<Tracks/>)
            case 'subscriptions':
                return(<Subscriptions/>)
            default:
                return(<Main/>)
        }
    }

    if (!isLoaded) {
        return(
            <div className='comment-page-wrapper'>
                <div className='featured'>
                    <BackButton/>
                    <Loader/>
                </div>
            </div>
        )
    }
    return (
        <div className='comment-page-wrapper'>
            <div className='featured'>
                <BackButton/>
                <TabSelector/>
                <FeaturedContent tab={activeTab}/>
            </div>
        </div>
    )
}