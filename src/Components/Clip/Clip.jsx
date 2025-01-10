import './Clip.css';
import viewsIcon from '../../Images/account-page/stats-icon.svg';
import editIcon from '../../Images/account-page/edit-icon.svg';
import trashIcon from '../../Images/trash.svg'
import { api } from '../App/App';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';
import { handleVideoEnter, handleVideoHover, handleVideoLeave, handleVideoMove } from './handlers/ClipHandlers';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';
import { axiosUnauthorized } from '../App/App';

const statusType = {
    0: 'Неизвестно',
    1: 'На модерации',
    2: 'На доработке',
    3: 'Опубликовано',
    4: 'Отклонено',
    5: 'Отозвано'
};

const statusColor = {
    0: 'yellow',
    1: 'yellow',
    2: 'yellow',
    3: 'green',
    4: 'red',
    5: 'red'
}

function Clip({key, clipId, authorId, songId, name, deleteFunc=undefined, isArtist=false}) {
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [authorName, setAuthorName] = useState('')
    const [deletePopupVisible, setDeletePopupVisible] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const videoPreviewRef = useRef(undefined)
    const previewRef = useRef(undefined)
    const {cleanQuery} = useSearchClean()
    const navigate = useNavigate()

    let status = 0, views=0;
    
    const songs = useSelector((state)=>state.songs.value)
    const [clipLink, setClipLink] = useState(undefined);
    const [previewLink, setPreviewLink] = useState(undefined);
    const dispatch = useDispatch()

    useEffect(() => {
        getClipLink()
            .then(response => setClipLink(response));
        getPreviewLink()
            .then(response => setPreviewLink(response));
    }, []);

    async function getClipLink() {
        let response = await axiosUnauthorized.get('api/music-clip/' + clipId + '/file/link')
        .catch(err => Promise.reject(err));

        return response?.data?.presignedLink;
    }

    async function getPreviewLink() {
        let response = await axiosUnauthorized.get('api/music-clip/' + clipId + '/preview/link')
        .catch(err => Promise.reject(err));

        return response?.data?.presignedLink;
    }
    
    const getAuthorName = async (id) =>{
        try{
            const response = await axios({
                method:'GET',
                url: api + 'api/author/' + id,
                responseType: 'application/json'
            })
            let result = JSON.parse(response.data)
            return result.name
        }
        catch(err){
            return Promise.reject(err);
        }
    }

    const handleSongClick = () =>{
        dispatch(updateSongsValue([...songs, songId]))
        dispatch(updateCurrentSongValue(songId))
    }

    useEffect(()=>{
        getAuthorName(authorId)
            .then(res=>setAuthorName(res))
            .catch(err=>console.log(err))
    },[])


    // () =>dispatch(updateVideoPlayerValue(api + `api/music-clip/${clipId}/file`))

    return ( 
        <div key={key} className="clip-wrapper">
            {videoLoaded ? <></>:  <>  
                <Skeleton baseColor='#0F141D' highlightColor="#2C323D"  height={200}/>
                <Skeleton baseColor='#0F141D' highlightColor="#2C323D" count={2} />
            </>}
            <div className="cover-wrapper" style={videoLoaded?{display:'block'}:{display:'none'}}>
                <div className="clip-video" onClick={()=>{
                    cleanQuery()
                    navigate(`/clipview?clip_id=${clipId}`)
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
                    <img src={api + `api/song/${songId}/logo`} alt="" style={{height:'100%'}}/>
                </div>
                <div className="song-info-wrapper">
                    <span className="clip-song-name">{name}</span>
                    <span className="clip-song-author">
                        <NavLink to={`/artist/${authorId}`} onClick={cleanQuery}>
                            {authorName}
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
                    <button title='Удалить клип' onClick={()=>setDeletePopupVisible(true)}>
                        <img alt='list' src={trashIcon} />
                    </button>

                    <div className={deletePopupVisible ? "delete-popup" : "delete-popup hidden-popup"}>
                        <p>Вы действительно хотите удалить этот клип?</p>
                        <div className="popup-actions">
                            <button onClick={() => {if(deleteFunc) deleteFunc(clipId)}}>
                                <img src={trashIcon} alt=""/>
                                <span>Да</span>
                            </button>
                            <button className='primary' onClick={()=>setDeletePopupVisible(false)}>
                                <span>Нет</span>
                            </button>
                        </div>
                    </div>

                </div>
            ) : (<></>)}
        </div>
    );
}
export default Clip;