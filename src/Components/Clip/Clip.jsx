import './Clip.css';
import viewsIcon from '../../Images/account-page/stats-icon.svg';
import editIcon from '../../Images/pencil.svg';
import { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';
import { handleVideoEnter, handleVideoHover, handleVideoLeave, handleVideoMove } from './handlers/ClipHandlers';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { shortenText, statusColor, statusType } from '../../Tools/Tools';
import { getSongLogo } from '../../Api/Song';
import { getAuthorInfo } from '../../Api/Author';
import { getClipFile, getClipPreview, getClipViews } from '../../Api/Clip';
import { getClipRequestFile, getClipRequestPreview } from '../../Api/ClipPublish';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';

function Clip({
    clipId=undefined, 
    clipRequestId=undefined,
    authorId, 
    songId, 
    name,
    isArtist=false, 
    status=0
}) {
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [authorName, setAuthorName] = useState('')
    const videoPreviewRef = useRef(undefined)
    const previewRef = useRef(undefined)
    const {cleanQuery} = useSearchClean()
    const navigate = useNavigate()

    const [views, setViews] = useState(0); 
    
    const songs = useSelector((state)=>state.songs.value)
    const [clipLink, setClipLink] = useState(undefined);
    const [previewLink, setPreviewLink] = useState(undefined);
    const [coverLink, setCoverLink] = useState(undefined);
    const dispatch = useDispatch()

    useEffect(() => {
        if (clipId) {
            getClipPreview(clipId)
                .then(response => setPreviewLink(response));
            getClipFile(clipId)
                .then(response => setClipLink(response));
            getClipViews(clipId)
                .then(response => setViews(response));
        } else {
            getClipRequestPreview(clipRequestId)
                .then(response => setPreviewLink(response));
            getClipRequestFile(clipRequestId)
                .then(response => setClipLink(response));
        }
        
        getSongLogo(songId)
            .then(response => setCoverLink(response));
        getAuthorInfo(authorId, undefined)
            .then(res => setAuthorName(res.name));
    }, [clipId, clipRequestId]);

    const handleSongClick = () =>{
        dispatch(updateSongsValue([...songs, songId]))
        dispatch(updateCurrentSongValue(songId))
    }

    return ( 
        <div className="clip-wrapper">
            {videoLoaded ? <></>:  <>  
                <Skeleton baseColor='#0F141D' highlightColor="#2C323D"  height={200}/>
                <Skeleton baseColor='#0F141D' highlightColor="#2C323D" count={2} />
            </>}
            <div className="cover-wrapper" style={videoLoaded?{display:'block'}:{display:'none'}}>
                <div className="clip-video" onClick={()=>{
                    cleanQuery();
                    if (clipId)
                        navigate(`/clipview?clip_id=${clipId}`);
                    else 
                        dispatch(updateVideoPlayerValue(clipLink));
                }} 
                        onMouseOver={() => handleVideoHover(videoPreviewRef, clipLink)}
                        onMouseEnter={() => handleVideoEnter(previewRef)}
                        onMouseMove={() => handleVideoMove(videoPreviewRef)}
                        onMouseLeave={() => handleVideoLeave(previewRef, videoPreviewRef)}>
                    <img ref={previewRef}
                        draggable='false'
                        className='clip-cover'
                        onLoad={()=>{setVideoLoaded(true)}}
                        src={previewLink} 
                        alt="" 
                        style={{width:'100%', objectFit:'cover', pointerEvents:'none'}} />
                    <video ref={videoPreviewRef}
                        className='clip-video' 
                        muted={true}
                        preload="auto"
                        >
                        Sorry, your browser doesn't support embedded videos
                    </video>
                </div>
            </div>
            <div className="clip-song" onClick={handleSongClick} style={videoLoaded?{display:'flex'}:{display:'none'}}> 
                <div className="song-img-placeholder">
                    <img src={coverLink} alt="" style={{height:'100%'}}/>
                </div>
                <div className="song-info-wrapper">
                    <span className="clip-song-name">{shortenText(name, 25)}</span>
                    <span className="clip-song-author">
                        <NavLink to={`/artist/${authorId}`} onClick={cleanQuery}>
                            {shortenText(authorName, 25)}
                        </NavLink>
                    </span>
                </div>
            </div>
            {isArtist ? (
                <div className='clip-artist-info'>
                    <p className='clip-views'><img src={viewsIcon} alt=''/>{views}</p>
                    <p className='song-status'>
                        <div className={'song-status-dot ' + statusColor[status]}></div>
                        {statusType[status]}
                    </p>
                    <Link to={'/uploadvideo/' + clipRequestId}>
                        <img alt='list' src={editIcon} />
                    </Link>
                </div>
            ) : (<></>)}
        </div>
    );
}
export default Clip;