import { useNavigate, useParams } from "react-router-dom"
import ArtistImage from '../../Images/main-placeholder.png';
import TrackTemplate from '../../Images/main-placeholder.png';

import ArtistInfo from "../../Components/ArtistCardComponents/ArtistInfo/ArtistInfo.jsx"
import { useEffect, useState } from "react"
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from "../../Components/App/App.jsx"
import BackButton from "../../Components/BackButton.jsx";
import Songs from "../../Components/ArtistCardComponents/Songs/Songs.jsx"
import Blog from "../../Components/Blog/Blog.jsx"
import Clips from "../../Components/ArtistCardComponents/Clips/Clips.jsx";
import arrowRight from '../../Images/artist-card/Chevron_Right.svg'

import { useDispatch, useSelector } from "react-redux";
import { updateSubscriptionsValue } from "../../Redux/slices/subscriptionsSlice.js";

import './ArtistCard.css';
import Loader from "../../Components/Loader/Loader.jsx";
import Playlists from "../Featured/Playlists.jsx";
import { getPublicPlaylists } from "../../Api/Playlist.jsx";
import Playlist from "../../Components/Playlist/Playlist.jsx";
import { getAuthorLogo } from "../../Api/Author.jsx";

function ArtistCard(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [artist, setArtist] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currPage, setCurrPage] = useState(0);
    const [avatar, setAvatar] = useState(ArtistImage);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (artist?.userId !== undefined)
            getArtistInfo();
    }, [artist])

    useEffect(() => {
        // обновление информации об авторе
        axiosUnauthorized.get(api + `api/subscription/${params.id}/count`)
        .then(resp => {
            axiosUnauthorized.get(api + `api/author/${params.id}`)
            .then(response => {
                setArtist({
                    artistId: params.id,
                    userId: response.data.userId,
                    artistName: response.data.name,
                    artistImage: ArtistImage,
                    artistInfoText: response.data.about,
                    subscribersCount: resp.data.count,
                    socialLinks:{
                        site: response.data.webSiteLink,
                        vk: response.data.vkLink,
                        yandex:response.data.yaMusicLink
                    }
                });
                setIsLoaded(true);
            })
            .catch(err => {
                console.log(err);
                navigate(-1);
            })
        })
        .catch(err => {
            console.log(err);
            navigate(-1);
        })

    }, [isLoaded, params])   

    const handleChangePage = (id) => {
        // смена страницы в лк
        setCurrPage(id);
    };

    async function getPlaylists(id, count, offset) {
        let arr = await getPublicPlaylists(id, count, offset);
        setPlaylists(arr);
    }

    async function getArtistInfo() {
        let logo = await getAuthorLogo(artist?.artistId);
        setAvatar(logo);
        await getPlaylists(artist?.userId, 5, 0);
    }

    if (isLoaded || artist?.userId)
        return(
            <section className="comment-page-wrapper">
                <div className="comment-page">
                    <BackButton/>
                    <ArtistInfo artist={artist}/>

                    <div className="artist-card-menu">
                        <a onClick={() => handleChangePage(0)} 
                            className={currPage === 0 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Главная
                        </a>
                        <a onClick={() => handleChangePage(1)} 
                            className={currPage === 1 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Треки
                        </a>
                        <a onClick={() => handleChangePage(4)} 
                            className={currPage === 4 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Плейлисты
                        </a>
                        <a onClick={() => handleChangePage(2)} 
                            className={currPage === 2 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Клипы
                        </a>
                        <a onClick={() => handleChangePage(3)} 
                            className={currPage === 3 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Блог
                        </a>
                    </div>

                    {currPage === 0 ? 
                    <>
                        <p className='top-tracks-title'>Плейлисты и альбомы
                        <button className='search-show-more' onClick={async () => {
                                await getPlaylists(artist?.userId, 100, 0)
                                handleChangePage(4);
                            }}>
                            <span>Смотреть все</span>
                            <img src={arrowRight} alt="" />
                        </button>
                        </p>
                        <div className="playlists" style={{marginBottom: '24px'}}>
                            {playlists?.map(el => (
                                <Playlist id={el.id}/>
                            ))}                            
                        </div>
                        <p className='top-tracks-title'>Треки
                        <button className='search-show-more' onClick={() => handleChangePage(1)}>
                            <span>Смотреть все</span>
                            <img src={arrowRight} alt="" />
                        </button>
                        </p>
                        <Songs artist={artist} count={3}/> 
                        <p className='top-tracks-title'>Клипы
                        <button className='search-show-more' onClick={() => handleChangePage(2)}>
                            <span>Смотреть все</span>
                            <img src={arrowRight} alt="" />
                        </button>
                        </p>
                        <Clips artistId={params.id} count={3}/> 
                        <p className='top-tracks-title'>Блог
                        <button className='search-show-more' onClick={() => handleChangePage(3)}>
                            <span>Смотреть все</span>
                            <img src={arrowRight} alt="" />
                        </button>
                        </p>
                        <Blog artistId={params.id} count={5}/>
                    </>: <></>}
                    {currPage === 1 ? <Songs artist={artist}/> : <></>}
                    {currPage === 2 ? <Clips artistId={params.id}/> : <></>}
                    {currPage === 3 ? <Blog artistId={params.id}/> : <></>}
                    {currPage === 4 ? (
                        <div className="playlists">
                            {playlists?.map(el => (
                                <Playlist id={el.id}/>
                            ))}                            
                        </div>
                    ) : <></>}
                    
                </div>
                <img className="artist-bg-image" src={avatar} />
            </section>
        )
        else {
            return (
                <section className="comment-page-wrapper">
                <div className="comment-page">
                    <BackButton/>
                    <Loader/>
                </div>
                </section>
            )
        }
}

export default ArtistCard