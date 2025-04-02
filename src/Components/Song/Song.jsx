import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heart from '../../Images/controller/heart.svg';
import redHeart from '../../Images/red-heart.svg';
import dislike from '../../Images/controller/thumbs-down.svg';
import redDislike from '../../Images/controller/dislike-red.svg';
import list from '../../Images/player/plus.svg';
import placeholder from '../../Images/main-placeholder.png';
import selectedIcon from '../../Images/song/Volume.svg';
import hoverIcon from '../../Images/song/Play.svg';
import { ReactComponent as DeleteIcon } from '../../Images/x.svg';

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
import { addSongToExcluded, addSongToFavorite, deleteSongFromExcluded, deleteSongFromFavorite, getSongInfo, getSongLogo } from '../../Api/Song';
import { shortenText } from '../../Tools/Tools';

function Song({
    id, 
    onClick=undefined, 
    // duration, 
    // artist, 
    // genres, 
    // name, 
    isAttachedToMessage=false, 
    isPicked=false,
    deleteFunc=undefined
}) {
    const [modalIsHidden, setModalIsHidden] = useState(true);
    const [formatedDuration, setDuration] = useState(0);
    const [avatar, setAvatar] = useState(placeholder);
    const [songName, setSongName] = useState('');
    const [songAuthors, setSongAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const {cleanQuery} = useSearchClean();

    const dispatch = useDispatch();
    const excluded = useSelector((state)=>state.excluded.value);
    const resize = useSelector((state)=> state.resize.value);
    const featured = useSelector((state)=>state.featured.value);
    const songs = useSelector((state)=>state.songs.value);
    const currentSong = useSelector((state)=> state.currentSong.value);
    const [isHoverOn, setIsHoverOn] = useState(false);

    useEffect(() => {
        getAvatar();
        getSongInfo(id)
        .then(info => {
            setSongName(info.name);
            setGenres(info.genreList);
            setDuration(formatTime(info.durationMs));
            let authors = [info.author, ...info.featuredAuthorList];
            setSongAuthors(authors);
        })
    }, []);

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

    async function handleToFavorite() {
        // добавление и удаление из избранных
        if (featured.includes(id)) {
            await deleteSongFromFavorite(id);
            dispatch(updateFeaturedValue(featured.filter(el => el != id)));
        }
        else {
            await addSongToFavorite(id);
            dispatch(updateFeaturedValue([...featured, id]));
        }
    };

    async function handleToExcluded() {
        // добавление и удаление из исключенных
        if (excluded.includes(id)) {
            await deleteSongFromExcluded(id);
            dispatch(updateExcludedValue(excluded.filter(el => el != id)));
        }
        else {
            await addSongToExcluded(id);
            dispatch(updateExcludedValue([...excluded, id]));
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
        setAvatar(await getSongLogo(id));
    };

    function hideAllModals() {
        dispatch(updatePlayerQueueVisibility(false));
        cleanQuery();
    };

    function getProperArtistName() {
        let names = '';
        songAuthors.map(el =>  names += el.name + ', ');
        return shortenText(names.slice(0, -2), 20);
    }

    if (!isAttachedToMessage)
    return (
        <>
            <div className={currentSong === id ? 'track selected-track' : 'track'}>
                <div className='song-img' onMouseOver={() => setIsHoverOn(true)}
                onMouseLeave={() => setIsHoverOn(false)}>
                    {isHoverOn ? (
                        <>
                            <img onClick={handleAddToSongs} className='song-img-icon' alt='cover' src={currentSong === id ? selectedIcon : hoverIcon} draggable='false'/>
                            <div className='song-img hover'></div>
                        </>
                    ) : (<></>)}
                    <img onClick={handleAddToSongs} className='song-img' alt='cover' src={avatar} draggable='false'/>
                </div>
                <Link to={`/commentaries/${id}`} onClick={hideAllModals} className='song-title-t'>{shortenText(songName, 20)}
                    <p className='songAuthor'>{getProperArtistName()}</p>
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
                    </div>
                ): (
                    <a onClick={handleToFavorite}><img alt='like' src={featured.includes(id) ? redHeart : heart}/></a>
                )}

                {!modalIsHidden ? (<PlaylistModalMenu songAuthor={'Плейлист: '} songName={songName} id={id}/>) : (<></>)}
            </div>
        </>
    )
    else {
        return(
        <div className={isPicked ? 'track selected-track' : 'track'} onClick={onClick}>
            <div className='song-img' onMouseOver={() => setIsHoverOn(true)}
            onMouseLeave={() => setIsHoverOn(false)}>
                {isHoverOn ? (
                    <>
                        <img onClick={handleAddToSongs} className='song-img-icon' alt='cover' src={currentSong === id ? selectedIcon : hoverIcon} draggable='false'/>
                        <div className='song-img hover'></div>
                    </>
                ) : (<></>)}
                <img onClick={handleAddToSongs} className='song-img' alt='cover' src={avatar} draggable='false'/>
            </div>
            <Link className='song-title-t' style={{maxWidth: 'none'}}>{shortenText(songName, 20)}
                <p className='songAuthor'>{getProperArtistName()}</p>
            </Link>
            
            {isPicked && deleteFunc ? (
                <DeleteIcon className="message-input-file-delete" style={{position: 'relative'}} onClick={deleteFunc}/>
            ) : (
                <a onClick={handleToFavorite}><img alt='like' src={featured.includes(id) ? redHeart : heart}/></a>
            )}
        </div>
        ) 
    }
}

export default Song