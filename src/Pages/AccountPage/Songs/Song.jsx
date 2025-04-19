import editIcon from '../../../Images/account-page/edit-icon.svg';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import message from '../../../Images/controller/Chat_Dots.png';
import statsIcon from '../../../Images/account-page/stats-icon.svg';
import { api, axiosAuthorized, axiosUnauthorized } from '../../../Components/App/App';
import cover from '../../../Images/main-placeholder.png';
import { shortenText, statusColor, statusType } from '../../../Tools/Tools';

export default function Song ({id, artist, featured=[], status}) {
    const [songName, setSongName] = useState('');
    const [duration, setDuration] = useState(0);
    const [songId, setSongId] = useState(undefined); 
    const [auditionCount, setAuditionCount] = useState(0);
    const [coverLink, setCoverLink] = useState(cover);
    const [artistNames, setArtistNames] = useState('');

    const formatTime = (miliseconds) => {
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
        axiosAuthorized.get(`api/song/upload-request/${id}`)
        .then(response => {
            setSongName(response.data.songName);
            setDuration(response.data?.durationMs);
            setSongId(response.data.publishedSongId);
            getCoverLink();
            if (response.data.publishedSongId) {
                axiosUnauthorized.get(`api/song/${response.data.publishedSongId}/audition/count`)
                .then(response => {
                    setAuditionCount(response.data.auditionCount);
                })
            }
        })
        setDuration(formatTime(0));
    }, []);

    useEffect(() => {
        let names = artist;
        featured.map(el =>  names += ', ' + el);
        setArtistNames(names);
    }, [featured]);

    async function getCoverLink() {
        await axiosUnauthorized.get(`api/song/upload-request/${id}/logo/link`).then(response => {
            setCoverLink(response.data.presignedLink);
        })
        .catch(err => {setCoverLink(cover)});
    }

    return (
        <div className='track'>
            <img draggable='false' className='song-img' alt='cover' src={coverLink}/>
            <p className='song-title-t'>{shortenText(songName, 15)}<p className='songAuthor'>{shortenText(artistNames, 20)}</p></p>
            <p className='track-statistic'><img alt='stats' src={statsIcon}/>{auditionCount}</p>
            <p className='song-status' style={{width: '100%'}}>
                <div className={'song-status-dot ' + statusColor[status]}></div>
                {statusType[status]}
            </p>
            <p className='song-duration'>{formatTime(duration)}</p>
            <div className='track-buttons'>
                {songId ? 
                    <Link draggable='false' to={`/commentaries/${songId}`}><img draggable='false' alt='comment' src={message}/></Link> : 
                    <Link draggable='false' to={`/account`}><img alt='comment' draggable='false' src={message} style={{opacity: 0.2}}/></Link>
                }
                <a href={`/uploadmusic/${id}`}><img alt='list' src={editIcon} /></a>
            </div>
            
        </div>
    )
}