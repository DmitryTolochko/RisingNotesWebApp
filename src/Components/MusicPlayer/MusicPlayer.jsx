import React, { useEffect, useState, useRef } from 'react';
import {Link, useLocation} from "react-router-dom";

import heart from '../../Images/controller/heart.svg';
import redHeart from '../../Images/red-heart.svg';
import message from '../../Images/controller/Chat_Dots.png';
import play from '../../Images/play.svg';
import pause from '../../Images/Pause.svg';
import rewind_forwrad from '../../Images/controller/rewind.svg';
import rewind_backward from '../../Images/controller/rewind-1.svg';
import dislike from '../../Images/controller/thumbs-down.svg';
import redDislike from '../../Images/controller/dislike-red.svg';
import cover from '../../Images/main-placeholder.png';
import vol from '../../Images/controller/volume-2.svg';
import { ReactComponent as ListIcon } from '../../Images/list.svg';
import playlistIcon from '../../Images/player/plus.svg';

import { api } from '../App/App';
import { axiosAuthorized, axiosUnauthorized } from '../App/App';

import './MusicPlayer.css';
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { updateExcludedValue } from '../../Redux/slices/excludedSlice';
import { updateFeaturedValue } from '../../Redux/slices/featuredSlice';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import PlaylistModalMenu from '../PlaylistModalMenu/PlaylistModalMenu';
import filtersToggle from '../../Hooks/filtersToggle';
import { updatePlayerQueueVisibility } from '../../Redux/slices/playerQueueSlice';
import usePrevious from '../../Hooks/usePrevious/usePrevious';
import { shortenText } from '../ArtistCardComponents/ArtistInfo/ArtistInfo';

const MusicPlayer = () => {
    const [playerQueueButtonColor, setPlayerQueueButtonColor] = useState('#FFFFFF');
    const [currSongIndex, setCurrSongIndex] = useState(0);
    const audioRef = useRef(null);
    const [trackCurrentDuration, setTrackCurrentDuration] = useState(0);
    const [trackDuration, setTrackDuration] = useState(0);
    const [auditionTimer, setAuditionTimer] = useState(null);
    const handleRef = useRef(0);
    const [songName, setSongName] = useState('');
    const [songAuthor, setSongAuthor] = useState('');
    const [authorId, setAuthorId] = useState('');
    const location = useLocation();
    const [hiddenTag, setHiddenTag] = useState('');
    const [coverLink, setCoverLink] = useState(cover);
    
    const {cleanQuery} = useSearchClean();
    
    const volumeJSON = localStorage.getItem('VOL');
    const [volume, setVolume] = useState(volumeJSON ? JSON.parse(volumeJSON) : 1);
    const [cookies, setCookies] = useCookies(['role']);
    const [modalIsHidden, setModalIsHidden] = useState(true);

    const dispatch = useDispatch()
    const excluded = useSelector((state)=>state.excluded.value)
    const featured = useSelector((state)=>state.featured.value)
    const resize = useSelector((state)=> state.resize.value)
    const currentSong = useSelector((state)=> state.currentSong.value)
    const songs = useSelector((state)=> state.songs.value)
    const isPlaying = useSelector((state) => state.musicIsPlaying.value)
    const isPlayerQueueVisible = useSelector((state) => state.playerQueue.isVisible);

    useEffect(() => {
        // скрытие плеера
        if (location.pathname.includes('login') || location.pathname.includes('registration') ||
            location.pathname.includes('uploadmusic') || cookies.role === 'admin' || 
            (resize === 'mobile' && location.pathname.includes('messenger')) ||
            songs.length === 0) {
            setHiddenTag('hidden');
        } 
        else {
            setHiddenTag('');
        }
    }, [location, songs]);

    useEffect(() => {
        // сохранение громкости плеера 
        let audio = document.querySelector('audio');
        audio.volume = volume;
        localStorage.setItem('VOL', JSON.stringify(audio.volume));
    }, [volume])

    useEffect(() => {
        // обновление информации о текущей песне и сброс плеера
        if(currentSong !== '' && currentSong !== null){
            getSongLink();
            getCoverLink();
            stopAuditionTimer();
            axiosUnauthorized.get(`api/song/${currentSong}`)
            .then(response => {
                setSongName(response.data.name);
                setAuthorId(response.data.authorId);
                axiosUnauthorized.get(`api/author/${response.data.authorId}`)
                    .then(resp => {
                        setSongAuthor(resp.data.name);
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch(updateSongsValue(songs.filter(e => e !== currentSong)))
                        dispatch(updateCurrentSongValue(''))
                    })
            })
            .catch(err => {
                console.log(err);
                dispatch(updateSongsValue(songs.filter(e => e !== currentSong)))
                dispatch(updateCurrentSongValue(''))
            })
        }
        else if (songs.length > 0){
            dispatch(updateCurrentSongValue(songs[0]))
        }

    }, [songs, currentSong]);

    const [remainingAuditionTimerTime, setRemainingTime] = useState(20000);
    const [startTime, setStartTime] = useState(null);
    const [isSongAuditionAppended, setIsAuditionAppended] = useState(null);

    useEffect(() => {
        //реагирование на флаг паузы плеера
        let audio = audioRef.current;
      
        if (isPlaying && audioRef.current) {
            audio.play();
            audio.onerror = function() {
                console.error('Error loading audio');
            };
            const intervalId = setInterval(() => {
                setTrackCurrentDuration(t => t = audioRef.current.currentTime);
                setTrackDuration(t => t = audioRef.current.duration);
            }, 1);

            if (!isSongAuditionAppended)
                startAuditionTimer();
          
            return () => {
                clearInterval(intervalId);
            };
        } else if (audioRef.current) {
            audio.pause();
            pauseAuditionTimer();
        }
    }, [isPlaying, currentSong]);

    

    function startAuditionTimer() {
        if (auditionTimer) {
            clearTimeout(auditionTimer);
        }
        let time = remainingAuditionTimerTime;
        if (startTime == null || time > 20000) {
            setStartTime(Date.now());
            time = 20000;
            setRemainingTime(20000);
        }
        const newTimerId = setTimeout(appendAudition, time);
        setAuditionTimer(newTimerId);
    }

    function stopAuditionTimer() {
        setStartTime(Date.now());
        setRemainingTime(20000);
        setIsAuditionAppended(false);
        if (auditionTimer) {
            clearTimeout(auditionTimer);
            setAuditionTimer(null);
        }
    }

    function pauseAuditionTimer() {
        setRemainingTime(Date.now() - startTime);
        if (auditionTimer) {
            clearTimeout(auditionTimer);
            setAuditionTimer(null);
        }
    }

    async function appendAudition() {
        await axiosUnauthorized.patch('api/song/' + currentSong + '/audition/count');
        setIsAuditionAppended(true);
    }

    const handlePlayPause = async (e) => { 
        e.preventDefault();
        dispatch(updateMusicIsPlayingValue(!isPlaying));
    };

    async function getSongLink() {
        // получить прямую ссылку на файл песни 
        await axiosUnauthorized.get(`api/song/${currentSong}/file/link`).then(response => {
            audioRef.current.src = response.data.presignedLink;
        })
        .catch(err => {audioRef.current.src = ''});
    }

    async function getCoverLink() {
        await axiosUnauthorized.get(`api/song/${currentSong}/logo/link`).then(response => {
            setCoverLink(response.data.presignedLink);
        })
        .catch(err => {setCoverLink(cover)});
    }

    const handleNextSong = () => {
        // следующая песня или первая в очереди
        clearInterval(handleRef.current);
        const songsCount = songs.length;
        if (currSongIndex + 1 >= songsCount) {
            setCurrSongIndex(0);
            dispatch(updateCurrentSongValue(songs[0]))
        }
        else {
            setCurrSongIndex(currSongIndex => currSongIndex + 1);
            dispatch(updateCurrentSongValue(songs[currSongIndex + 1]))
        }

        audioRef.current.currentTime = 0;

        handleRef.current = setInterval(() => {
            setTrackCurrentDuration(t => t = audioRef.current.currentTime);
            setTrackDuration(t => t = audioRef.current.duration);
        }, 1);
    };

    const handlePrevSong = () => {
        // предыдущая песня или последняя в очереди
        clearInterval(handleRef.current);
        if (currSongIndex - 1 <= -1) {
            setCurrSongIndex(songs.length - 1);
            dispatch(updateCurrentSongValue(songs[songs.length - 1]))
        }
        else {
            setCurrSongIndex(nextSongIndex => nextSongIndex - 1);
            dispatch(updateCurrentSongValue(songs[currSongIndex - 1]))
        }

        audioRef.current.currentTime = 0;

        handleRef.current = setInterval(() => {
            setTrackCurrentDuration(t => t = audioRef.current.currentTime);
            setTrackDuration(t => t = audioRef.current.duration);
        }, 1);
    };

    const handleCurrentDurationChange = (event) => {
        // привязка времени трека к шкале
        clearInterval(handleRef.current);

        const newTrackDuration = event.target.value;
        setTrackCurrentDuration(newTrackDuration);

        if (audioRef.current) {
            audioRef.current.currentTime = event.target.value;
            handleRef.current = setInterval(() => {
                setTrackCurrentDuration(t => t = audioRef.current.currentTime);
            }, 1);
        }
    };

    const handleVolumeChange = (event) => {
        // изменеие громкости
        let audio = document.querySelector('audio');
        audio.volume = event.target.value*0.01;
        setVolume(audio.volume);
    };

    function formatTime(seconds) {
        // форматирование времени
        if (seconds === undefined || seconds === NaN || seconds === null) {
            return '00:00';
        }
        seconds = Math.round(seconds);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    function showVolumeModal() {
        // отображение окна громкости
        const vl_md = document.getElementById('volume-modal')
        if(vl_md.classList.contains('volume-modal-hidden')){
            vl_md.classList.remove('volume-modal-hidden');
        }
    };

    function hideVolumeModal() {
        // скрытие окна громкости
        const vl_md = document.getElementById('volume-modal')
        if(!vl_md.classList.contains('volume-modal-hidden')){
            vl_md.classList.add('volume-modal-hidden');
        }
    };

    async function changePlaylistModalState () {
        setModalIsHidden(modalIsHidden => modalIsHidden = !modalIsHidden);
    }

    async function handleToFavorite() {
        // добавление в избранное
        if (currentSong !== '' ) {
            
            if (featured.includes(currentSong)) {
                await axiosAuthorized.delete(api + `api/song/favorite/${currentSong}`).then(resp => {
                    dispatch(updateFeaturedValue(featured.filter(el => el != currentSong)))
                });
            }
            else {
                await axiosAuthorized.patch(api + `api/song/favorite/${currentSong}`).then(resp => {
                    dispatch(updateFeaturedValue([...featured, currentSong]))
                });
            }
        }
    };

    async function handleToExcluded() {
        // добавление в исключенное
        if (currentSong !== '' ) {
            if (excluded.includes(currentSong)) {
                await axiosAuthorized.delete(api + `api/excluded-track/${currentSong}`).then(resp => {
                    dispatch(updateExcludedValue(excluded.filter(el => el != currentSong)))
                });
            }
            else {
                await axiosAuthorized.post(api + `api/excluded-track/${currentSong}`).then(resp => {
                    dispatch(updateExcludedValue([...excluded, currentSong]))
                });
            }
        }
    };

    function hideAllModals() {
        dispatch(updatePlayerQueueVisibility(false));
        cleanQuery();
    }


    if (resize === 'standart') {
        return (<div className={"music-player-wrapper " + hiddenTag}>
            <audio ref={audioRef}
                onEnded={handleNextSong} type="audio/mpeg" autoPlay={isPlaying} controls style={{ display: 'none' }}/>
            <div className={`music-player-1 ` + hiddenTag}>
                <img className={isPlaying ? 'music-player-cover rotate' : 'music-player-cover'} draggable='false' src={coverLink} alt='cover'/>

                <span className='music-player-head' onClick={hideAllModals}>
                    <Link to={currentSong === '' ? '' : `/commentaries/${currentSong}`} className='music-player-head-song'>{shortenText(songName, 25)}</Link>
                    <Link to={`/artist/${authorId}`} className='music-player-head-author'>{shortenText(songAuthor, 25)}</Link>
                </span>

                <div className='music-player-buttons'>
                    <button onClick={handlePrevSong} disabled={songs.length < 1}>
                        <img alt='previous track' src={rewind_backward} draggable='false'/></button>
                    <button onClick={handlePlayPause} disabled={currentSong === ''}
                        className='play-button'><img alt='play' src={isPlaying? pause : play} draggable='false'/></button>
                    <button onClick={handleNextSong} disabled={songs.length < 1}>
                        <img alt='next track' src={rewind_forwrad} draggable='false'/></button>
                </div>

                {cookies.role ? (
                    <div className='music-player-buttons'>
                    <a onClick={handleToExcluded}><img alt='dislike' draggable='false' src={excluded.includes(currentSong) ? redDislike : dislike}/></a>
                    <a onClick={changePlaylistModalState}><img src={playlistIcon} draggable='false'/></a>
                    <a onClick={handleToFavorite}><img alt='like' draggable='false' src={featured.includes(currentSong) ? redHeart : heart}/></a>
                </div>
                ) : (<></>)}
                
                {!modalIsHidden ? <div className='playlist-modal-wrapper'><PlaylistModalMenu songAuthor={songAuthor} songName={songName} id={currentSong}/></div> : <></>}
                
                <div className="track-range">
                    <span className="header-text header__track-duration">{formatTime(trackCurrentDuration)}</span>
                    <input className='track-range-input' value={trackCurrentDuration} 
                        onChange={handleCurrentDurationChange}
                        type="range" id="time" name="volume" min="0" max={trackDuration}/>
                    <span className="header-text header__track-duration">{formatTime(trackDuration)}</span>
                </div>

                <div className='music-player-buttons'>
                    <a onClick={() => {
                        dispatch(updatePlayerQueueVisibility(!isPlayerQueueVisible));
                        setPlayerQueueButtonColor(playerQueueButtonColor === '#FFFFFF' ? '#FE1170' : '#FFFFFF');
                    }}>
                        <ListIcon stroke={playerQueueButtonColor}/>
                    </a>

                    <div className="volume-container" onMouseLeave={hideVolumeModal}>
                        <div id='volume-modal' className="volume-modal volume-modal-hidden" >
                            <input type="range" className='track-range-input' min="0" max="100" onChange={handleVolumeChange} value={volume*100}/>
                        </div>
                        <img className="header-volume-btn" src={vol} onMouseOver={showVolumeModal} draggable='false'></img>
                    </div>
                </div>
            </div>
        </div>)
    }
    else {
        return (<div className="music-player-wrapper">
            <audio ref={audioRef}
                onEnded={handleNextSong} type="audio/mpeg" autoPlay={isPlaying} controls style={{ display: 'none' }}/>
            <input className={'track-range-input mobile-player-input ' + hiddenTag} value={trackCurrentDuration} 
                        onChange={handleCurrentDurationChange}
                        type="range" id="time" name="volume" min="0" max={trackDuration}/>
            <div className={`mobile-music-player ` + hiddenTag}>
                <div className='mobile-music-player-song'>
                    <img className={isPlaying ? 'mobile-music-player-img rotate' : 'mobile-music-player-img'} draggable='false' src={coverLink} alt='cover'/>
                    <span>
                        <Link to={currentSong === '' ? '' : `/commentaries/${currentSong}`} className='mobile-music-player-song-name'>{shortenText(songName, 25)}</Link>
                        <Link to={`/artist/${authorId}`} className='mobile-music-player-author'>{shortenText(songAuthor, 25)}</Link>
                    </span>
                    <a onClick={() => {
                        dispatch(updatePlayerQueueVisibility(!isPlayerQueueVisible));
                        setPlayerQueueButtonColor(playerQueueButtonColor === '#FFFFFF' ? '#FE1170' : '#FFFFFF');
                    }}>
                        <ListIcon stroke={playerQueueButtonColor}/>
                    </a>
                </div>
                <div className='mobile-music-player-buttons'>
                    
                    {cookies.role ? (
                    <div className='music-player-buttons'>
                        <a onClick={handleToExcluded}><img alt='dislike' draggable='false' src={excluded.includes(currentSong) ? redDislike : dislike}/></a>
                        <a onClick={changePlaylistModalState}><img src={playlistIcon} draggable='false'/></a>
                        <a onClick={handleToFavorite}><img alt='like' draggable='false' src={featured.includes(currentSong) ? redHeart : heart}/></a>
                    </div>
                    ) : (<></>)}
                    
                    {!modalIsHidden ? <div className='playlist-modal-wrapper-mobile'><PlaylistModalMenu songAuthor={songAuthor} songName={songName} id={currentSong}/></div> : <></>}

                    <div className='music-player-buttons'>
                        <button onClick={handlePrevSong} disabled={songs.length < 1}>
                            <img alt='previous track' src={rewind_backward} draggable='false'/></button>
                        <button onClick={handlePlayPause} disabled={currentSong === ''}
                            ><img alt='play' src={isPlaying? pause : play} draggable='false'/></button>
                        <button onClick={handleNextSong} disabled={songs.length < 1}>
                            <img alt='next track' src={rewind_forwrad} draggable='false'/></button>
                    </div>
                </div>
            </div>
        </div>)
    }
};

export default MusicPlayer;