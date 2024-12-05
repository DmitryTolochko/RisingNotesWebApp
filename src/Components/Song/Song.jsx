import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heart from '../../Images/controller/heart.svg';
import redHeart from '../../Images/red-heart.svg';
import message from '../../Images/controller/Chat_Dots.png';
import dislike from '../../Images/controller/thumbs-down.svg';
import redDislike from '../../Images/controller/dislike-red.svg';
import list from '../../Images/player/plus.svg';
import placeholder from '../../Images/main-placeholder.png';
import selectedIcon from '../../Images/song/Volume.svg';
import hoverIcon from '../../Images/song/Play.svg';

import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../App/App';
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';

import { useSelector, useDispatch } from 'react-redux';
import { updateExcludedValue } from '../../Redux/slices/excludedSlice';
import { updateFeaturedValue } from '../../Redux/slices/featuredSlice';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import './Song.css';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import PlaylistModalMenu from '../PlaylistModalMenu/PlaylistModalMenu';
import { updatePlayerQueueVisibility } from '../../Redux/slices/playerQueueSlice';

function Song({id, onClick=undefined, duration, artist, genres, name}) {
    const [modalIsHidden, setModalIsHidden] = useState(true);
    const [formatedDuration, setDuration] = useState(0);
    const [avatar, setAvatar] = useState(placeholder);
    const {cleanQuery} = useSearchClean();

    const dispatch = useDispatch();
    const excluded = useSelector((state)=>state.excluded.value);
    const resize = useSelector((state)=> state.resize.value);
    const featured = useSelector((state)=>state.featured.value);
    const songs = useSelector((state)=>state.songs.value);
    const currentSong = useSelector((state)=> state.currentSong.value);
    const [isHoverOn, setIsHoverOn] = useState(false);

    function runDelegate() {
        onClick(id);
    };

    async function changeModalState () {
        // показать/скрыть окно с плейлистами
        setModalIsHidden(modalIsHidden => modalIsHidden = !modalIsHidden);
    };

    const formatTime = (miliseconds) => {
        // форматировать длительность песни
        let seconds = miliseconds * 0.001
        if (seconds === undefined || seconds === NaN || seconds === null) {
            return '00:00';
        }
        seconds = Math.round(seconds);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        // установить длительность песни в правильном формате
        setDuration(formatTime(duration));
        getAvatar();
    }, []);

    async function handleToFavorite() {
        // добавление и удаление из избранных
        if (featured.includes(id)) {
            await axiosAuthorized.delete(api + `api/song/favorite/${id}`).then(resp => {
                dispatch(updateFeaturedValue(featured.filter(el => el != id)))
            });
        }
        else {
            await axiosAuthorized.patch(api + `api/song/favorite/${id}`).then(resp => {
                dispatch(updateFeaturedValue([...featured, id]))
            });
        }
    };

    async function handleToExcluded() {
        // добавление и удаление из исключенных
        if (excluded.includes(id)) {
            await axiosAuthorized.delete(api + `api/excluded-track/${id}`).then(resp => {
                dispatch(updateExcludedValue(excluded.filter(el => el != id)))
            });
        }
        else {
            await axiosAuthorized.post(api + `api/excluded-track/${id}`).then(resp => {
                dispatch(updateExcludedValue([...excluded, id]))
            });
        }
    };

    const handleAddToSongs = () => {
        if (onClick !== undefined) {
            runDelegate();
        } else {
            dispatch(updateSongsValue([...songs, id]));
        }
        // добавить песню в конец плеера и включить ее
        dispatch(updateCurrentSongValue(id));
        dispatch(updateMusicIsPlayingValue(true));
    };

    async function getAvatar() {
        await axiosPictures.get(api + `api/song/${id}/logo/link`)
        .then(resp => {setAvatar(resp?.data?.presignedLink)})
        .catch(err => {setAvatar(placeholder)});
    };

    function hideAllModals() {
        dispatch(updatePlayerQueueVisibility(false));
        cleanQuery();
    };

    return (
        <>
            <div className={currentSong === id ? 'track selected-track' : 'track'}>
                <div className='song-img' onMouseOver={() => setIsHoverOn(true)}
                onMouseLeave={() => setIsHoverOn(false)}>
                    {isHoverOn || currentSong === id ? (
                        <>
                            <img onClick={handleAddToSongs} className='song-img-icon' alt='cover' src={currentSong === id ? selectedIcon : hoverIcon} draggable='false'/>
                            <div className='song-img hover'></div>
                        </>
                    ) : (<></>)}
                    <img onClick={handleAddToSongs} className='song-img' alt='cover' src={avatar} draggable='false'/>
                </div>
                <Link to={`/commentaries/${id}`} onClick={hideAllModals} className='song-title-t'>{name}
                    <p className='songAuthor'>{artist}</p>
                </Link>
                
                {resize === 'standart' ? (
                    <>
                        {genres?.length > 0 ? <p className='song-genre'>{genres[0]}</p> : <p className='song-genre'>Без жанра</p>}
                        <p className='song-duration'>{formatedDuration}</p>
                    </>
                ) : (
                    <></>
                )}
                
                {resize === 'standart' ? (
                    <div className='track-buttons'>
                        <a onClick={handleToFavorite}><img alt='like' src={featured.includes(id) ? redHeart : heart}/></a>
                        <a><img alt='list' src={list} onClick={changeModalState}/></a>
                        <a onClick={handleToExcluded}><img alt='dislike' src={excluded.includes(id) ? redDislike : dislike}/></a>
                        {/* <Link to={`/commentaries/${id}`} onClick={hideAllModals}><img alt='comment' src={message}/></Link> */}
                    </div>
                ): (
                    <a onClick={handleToFavorite}><img alt='like' src={featured.includes(id) ? redHeart : heart}/></a>
                )}

                {!modalIsHidden ? (<PlaylistModalMenu songAuthor={artist} songName={name} id={id}/>) : (<></>)}
            </div>
        </>
    )
}

export default Song