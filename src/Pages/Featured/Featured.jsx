import React, { useEffect, useState} from 'react';
import { useNavigate, redirect } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import Playlist from '../../Components/Playlist';
import Song from '../../Components/Song/Song';
import newPlaylist from '../../Images/featured/newplaylist.png';
import Subscription from '../../Components/Subscription';
import { api, axiosAuthorized, axiosUnauthorized} from '../../Components/App/App';
import { useCookies } from 'react-cookie';

import { useSelector, useDispatch } from 'react-redux'
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';

import './Featured.css';
import Loader from '../../Components/Loader/Loader';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';

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
    }

    function updatePlayableList (startId) {
        // Обновить текущий список вопроизведения
        let arr = featured.slice(featured.findIndex(e => e === startId));
        dispatch(updateSongsValue(arr));
        dispatch(updateMusicIsPlayingValue(true));
    }

    const tabs = [
        {id:'main', label: 'Главная'},
        {id:'playlists', label: 'Плейлисты'},
        {id:'tracks', label: 'Треки'},
        {id:'subscriptions', label: 'Подписки'}
    ]
    const [activeTab, setActiveTab] = useState('main')

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
                        {tab.label}
                    </button>
                ))}
            </nav>
        </>
        )
    }
    const Playlists = () =>{
        return(
            <section className='featured-section'>
                <h2 className='featured-section__title'>Плейлисты</h2>
                <div className="playlists">
                    {playlists?.map(el => (
                        <Playlist key={el} id={el}/>
                    ))}
                    <div draggable='false' className='playlist'>
                        <img draggable='false' className='new-playlist' alt='add new playlist' src={newPlaylist} onClick={addNewPlaylist}/>
                    </div>
                </div>
            </section>
        )
    }
    const Tracks = () =>{
        return(
            <section className='featured-section'>
                <h2 className='featured-section__title'>Треки</h2>
                <div className='tracks'>
                    {songs.map(el => (
                        <Song key={el.id} id={el.id} name={el.name} duration={el.durationMs} artist={el.authorName} genres={el.genreList}/>
                    ))}
                    {songs.length === 0 ? <p style={{color: '#FE1170'}}>Список пуст</p> : <></>}
                </div>
            </section>
        )
    }
    const Subscriptions = () =>{
        return(
            <section className='featured-section'>
                <h2 className='featured-section__title'>Подписки</h2>
                <div>
                    {subscriptions.map((id) =>
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