import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heart from '../../Images/controller/heart.svg';
import redHeart from '../../Images/red-heart.svg';
import message from '../../Images/controller/Chat_Dots.png';
import dislike from '../../Images/controller/thumbs-down.svg';
import redDislike from '../../Images/controller/dislike-red.svg';
import list from '../../Images/list.svg';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../App/App';
import thumb from '../../Images/main-placeholder.png';
import check from '../../Images/check_big.svg';
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';

import { useSelector, useDispatch } from 'react-redux';
import { updateExcludedValue } from '../../Redux/slices/excludedSlice';
import { updateFeaturedValue } from '../../Redux/slices/featuredSlice';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import './Song.css';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import PlaylistModalMenu from '../PlaylistModalMenu/PlaylistModalMenu';

function Song({id, onClick=undefined, duration, artist, genres, name}) {
    const [modalIsHidden, setModalIsHidden] = useState(true);
    const [formatedDuration, setDuration] = useState(0);
    const {cleanQuery} = useSearchClean()

    const dispatch = useDispatch()
    const excluded = useSelector((state)=>state.excluded.value)
    const resize = useSelector((state)=> state.resize.value)
    const featured = useSelector((state)=>state.featured.value)
    const songs = useSelector((state)=>state.songs.value)
    const [playlistsInfo, setPlaylistsInfo] = useState([]);
    const playlists = useSelector((state)=>state.playlists.value);

    function addSongsToPlayableList() {
        onClick(id);
    }

    async function changeModalState () {
        // показать/скрыть окно с плейлистами
        setModalIsHidden(modalIsHidden => modalIsHidden = !modalIsHidden);
    }

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
        setDuration(formatTime(duration))
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
            addSongsToPlayableList();
        } else {
            dispatch(updateSongsValue([...songs, id]));
        }
        // добавить песню в конец плеера и включить ее
        dispatch(updateCurrentSongValue(id));
        dispatch(updateMusicIsPlayingValue(true));
    };

    return (
        <>
            <div className='track'>
                <img onClick={handleAddToSongs} alt='cover' src={api + `api/song/${id}/logo?width=100&height=100`} draggable='false'/>
                <p onClick={handleAddToSongs} className='song-title-t'>{name}
                    <p className='songAuthor'>{artist}</p>
                </p>
                
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
                        <a><img alt='list' src={list} onClick={changeModalState}/></a>
                        <a onClick={handleToExcluded}><img alt='dislike' src={excluded.includes(id) ? redDislike : dislike}/></a>
                        <a onClick={handleToFavorite}><img alt='like' src={featured.includes(id) ? redHeart : heart}/></a>
                        <Link to={`/commentaries/${id}`} onClick={cleanQuery}><img alt='comment' src={message}/></Link>
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