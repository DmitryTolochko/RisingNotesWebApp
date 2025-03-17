import { useEffect, useState } from 'react';
import Filters from '../../Components/MusicExplorerComponents/Filters';
import background from '../../Images/music-explorer/Background.png';
import icon from '../../Images/music-explorer/icon.png';
import { ReactComponent as FilterIcon } from '../../Images/player/FilterBtn.svg';
import './MusicExplorer.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterVisibility } from '../../Redux/slices/filtersSlice';
import songCoverTemplate from '../../Images/main-placeholder.png';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../../Components/App/App';
import rewind_forwrad from '../../Images/controller/rewind.svg';
import rewind_backward from '../../Images/controller/rewind-1.svg';
import ArtistInfo from '../../Components/ArtistCardComponents/ArtistInfo/ArtistInfo';
import { updateSubscriptionsValue } from '../../Redux/slices/subscriptionsSlice';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import FilterNotificationPopup from '../../Components/Player/FilterComponent/FilterElements/FilterNotificationPopup';
import { shortenText } from '../../Tools/Tools';

function MusicExplorer() {
    const [iconColor, setIconColor] = useState('#000000');
    const filters = useSelector((state)=>state.filters.value);
    const currentSong = useSelector((state)=> state.currentSong.value);
    const subscriptions = useSelector((state)=>state.subscriptions.value);
    const songs = useSelector((state)=> state.songs.value);

    const dispatch = useDispatch();

    const [filtersApplied, setFiltersApplied] = useState(false);
    const [musicClipLink, setMusicClipLink] = useState(undefined);
    const [bgImage, setBgImage] = useState(background);
    const [currentTrackInfo, setCurrentTrackInfo] = useState({
        id: '',
        authorId: '',
        trackName:'Нет треков',
        trackCover: songCoverTemplate,
        authors: [],
        tags: [],
        lyrcs: ``
    });
    const [artist, setArtist] = useState({
        artistId: '',
        userId: '',
        artistName: '',
        artistInfoText: '',
        subscribersCount: '',
        socialLinks:{
            site: '',
            vk: '',
            yandex: ''
        }
    });

    useEffect(() => {
        // обновление информации об авторе
        if (currentTrackInfo.authorId !== '') {
            axiosUnauthorized.get(api + `api/subscription/${currentTrackInfo?.authorId}/count`)
            .then(resp => {
                axiosUnauthorized.get(api + `api/author/${currentTrackInfo?.authorId}`)
                .then(response => {
                    setArtist({
                        artistId: currentTrackInfo?.authorId,
                        userId: response.data.userId,
                        artistName: response.data.name,
                        artistInfoText: response.data.about,
                        subscribersCount: resp.data.count,
                        socialLinks:{
                            site: response.data.webSiteLink,
                            vk: response.data.vkLink,
                            yandex:response.data.yaMusicLink
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [currentTrackInfo]);

    const getCurrentTrackInfo = async () => {
        // подгрузка информации о текущем треке
        let imageLink = songCoverTemplate;
        let info = {};

        await axiosUnauthorized.get(`api/song/` + currentSong + `/logo/link`)
        .then(response => {
            imageLink = response.data.presignedLink;
        })
        .catch(err => {imageLink = songCoverTemplate});

        setBgImage(imageLink);

        await axiosUnauthorized.get(`api/song/` + currentSong)
        .then(response => {
            info = {
                id: response.data.id,
                authorId: response.data.authorId,
                trackName: response.data.name,
                authors: [response.data.authorName],
                tags: [...response.data.genreList, ...response.data.languageList, ...response.data.vibeList],
                trackCover: imageLink
            }
        })
        .catch(err => {console.log(err)});

        await axiosPictures.get(`api/author/` + info.authorId + `/logo/link`)
        .then(response => {
            info.authorLogo = response.data.presignedLink
        })
        .catch(err => {
            info.authorLogo = songCoverTemplate
        });

        let thisMusicClipLink = await axiosPictures.get('api/music-clip/by-song/' + currentSong)
        .then(response => {
            return axiosPictures.get('api/music-clip/' + response.data.clipId + '/file/link')
            .then(resp => {return resp.data.presignedLink});
        })
        .catch(err => {return undefined});
        setMusicClipLink(thisMusicClipLink);

        setCurrentTrackInfo(info);
    }

    function handleNextSong() {
        // следующая песня
        let index = songs.indexOf(currentSong);
        if (index === songs.length - 1) {
            dispatch(updateCurrentSongValue(songs[0]));
        } else {
            dispatch(updateCurrentSongValue(songs[index + 1]));
        }
        
    }

    function handlePrevSong() {
        // предыдущая песня
        let index = songs.indexOf(currentSong);
        if (index === 0) {
            dispatch(updateCurrentSongValue(songs[songs.length - 1]));
        } else {
            dispatch(updateCurrentSongValue(songs[index - 1]));
        }
        
    }

    useEffect(() => {
        if(currentSong === '' || currentSong === null)
            return;
        
        getCurrentTrackInfo();
    }, [currentSong, filtersApplied])

    if (!filtersApplied || songs.length === 0)
    return (
        <div className='comment-page-wrapper'>
            <div className='explorer' style={{justifyContent: 'center', marginTop: '0'}}>
                <span className='explorer-start-h'>
                    <img src={icon}/>
                    <h1>Искать новых авторов</h1>
                </span>
                <button className={filters.visibility ? 'filter-button filter-opened' : 'filter-button'}
                    onClick={() => {
                        dispatch(setFilterVisibility(!filters.visibility));
                        setIconColor(iconColor === '#000000' ? '#FE1170' : '#000000');
                    }}>
                    <FilterIcon stroke={iconColor} />
                    Настроить
                </button>
                <img className="player-bg-image bg-loaded" src={bgImage} alt="" />  
                <Filters setFiltersApplied={setFiltersApplied}/>
                
                <div className="filters-notification-popup" style={{display: filtersApplied && songs.length === 0 ? 'flex' : 'none'}}>
                    <h2>Песен по вашему запросу не найдено</h2>
                    <p>Попробуйте изменить фильтры</p>
                </div>
            </div>
        </div>
    )
    else {
        return (
            <div className='comment-page-wrapper'>
                <div className='explorer'>
                    <div className='explorer-song-part'>
                        <button className='explorer-button' onClick={handlePrevSong}>
                            <img alt='previous' src={rewind_backward}/>
                        </button>
                        <div className='song-info'>
                            {musicClipLink === undefined ? (
                                <img alt='song-cover' src={currentTrackInfo.trackCover}/>
                            ) : (
                                <video className='explorer-video' src={musicClipLink} autoPlay={true} muted preload='auto' type='video/mp4' loop={true}/>
                            )}
                            
                            <span className='explorer-start-h'>
                                <img src={icon}/>
                                {shortenText(currentTrackInfo.trackName, 40)}
                            </span>
                            <div className="player-track-tags" style={{marginBottom:24, maxWidth: '100%'}}>
                                {currentTrackInfo?.tags?.map((tag, index)=>(
                                    <div className="player-track-tag" key={index}>{tag}</div>
                                ))}
                            </div>
                        </div>
                        <button className='explorer-button' onClick={handleNextSong}>
                            <img alt='next' src={rewind_forwrad}/>
                        </button>
                    </div>
                    <ArtistInfo artist={artist}/>
                    <img className="player-bg-image bg-loaded" src={bgImage} alt="" />  
                </div>
            </div>
        )
    }
}

export default MusicExplorer;