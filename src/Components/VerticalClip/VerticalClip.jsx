import { useState } from 'react'
import './VerticalClip.css'
import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import { handleVideoEnter, handleVideoHover, handleVideoLeave, handleVideoMove } from '../Clip/handlers/ClipHandlers';
import { useDispatch } from 'react-redux'
import { updateVertVideoInfoValue } from '../../Redux/slices/vertVideoInfoSlice'
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice'
import { useSearchParams } from 'react-router-dom'
import { shortenText, statusColor, statusType } from '../../Tools/Tools'
import { getSongInfo, getSongLogo } from '../../Api/Song'
import { getAuthorInfo, getAuthorLogo } from '../../Api/Author'
import { getClipFile, getClipInfo, getClipPreview, getClipViews } from '../../Api/Clip'
import { getClipRequestFile, getClipRequestInfo, getClipRequestPreview } from '../../Api/ClipPublish'
import viewsIcon from '../../Images/account-page/stats-icon.svg';
import editIcon from '../../Images/account-page/edit-icon.svg';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';

function VerticalClip({clipId, clipRequestId=undefined, status=0, authorId, authorName}) {
    const [dataFetched, setDataFetched] = useState(false);
    const [vertData, setVertData] = useState(undefined);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [clipLink, setClipLink] = useState(undefined);
    const [previewLink, setPreviewLink] = useState(undefined);
    const [views, setViews] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const previewRef = useRef(undefined);
    const videoPreviewRef = useRef(undefined);

    const dispatch = useDispatch()

    useEffect(()=>{
        getVertData()
        .then(res=>{
            setVertData(res);
            setDataFetched(true);
        })
        .catch(err=>console.log(err));
    },[]);

    useEffect(() => {
        if (clipId) {
            getClipPreview(clipId, true)
                .then(response => setPreviewLink(response));
            getClipFile(clipId, true)
                .then(response => setClipLink(response));
        } else {
            getClipRequestPreview(clipRequestId, true)
                .then(response => setPreviewLink(response));
            getClipRequestFile(clipRequestId, true)
                .then(response => setClipLink(response));
            // getClipViews(clipRequestId, true)
            // .then(response => setViews(response));
        }
    }, []);

    const getVertData = async () =>{
        let result = undefined;
        if (clipId) {
            result = await getClipInfo(clipId, true);
        } else {
            result = await getClipRequestInfo(clipRequestId, true);
        }
        result.authorAvatar = await getAuthorLogo(authorId);
        result.songLogo =  await getSongLogo(result.relatedSongId);
        let songInfo = await getSongInfo(result.relatedSongId);
        result.songName = songInfo?.name;

        result.authorName = authorName;

        return result;
    }

    const handleVertClick = () =>{
        if (clipId) {
            dispatch(updateMusicIsPlayingValue(false));
            // setSearchParams({'short_view':clipLink})
            setSearchParams({'short_view':vertData.id})
            dispatch(updateVertVideoInfoValue(vertData));
        }
        else 
            dispatch(updateVideoPlayerValue(clipLink));
    }

    return ( 
        <div className='vertical-clip-wrapper'>
            <div className="vertical-clip">
                {videoLoaded ? <></>:  <>  
                    <Skeleton baseColor='#0F141D' highlightColor="#2C323D"  height={700}/>
                </>}
                {!dataFetched? <></> :
                <div className="vert-video" 
                    onClick={handleVertClick}
                    onMouseOver={() => handleVideoHover(videoPreviewRef, clipLink)}
                    onMouseEnter={() => handleVideoEnter(previewRef)}
                    onMouseMove={() => handleVideoMove(videoPreviewRef)}
                    onMouseLeave={() => handleVideoLeave(previewRef, videoPreviewRef)} >
                    <img
                        ref={previewRef}
                        draggable='false'
                        className='vert-cover' 
                        src={previewLink}
                        onLoad={()=>{setVideoLoaded(true)}}
                        alt="" 
                        style={{ objectFit:'cover', pointerEvents:'none'}} />
                    <video
                        ref={videoPreviewRef}
                        className='clip-video' 
                        muted={true}
                        preload="auto"
                        >
                        Sorry, your browser doesn't support embedded videos
                    </video>
                    <div className="vert-data-label" style={videoLoaded?{display:'block'}:{display:'none'}}>
                        <h2>{shortenText(vertData.title, 13)}</h2>
                        <span>{shortenText(vertData.description, 25)}</span>
                    </div>
                </div>
                }
            </div>

            {clipRequestId ? (
                <div className='clip-artist-info'>
                    <p className='song-status'>
                        <div className={'song-status-dot ' + statusColor[status]}></div>
                        {statusType[status]}
                    </p>
                    <p className='clip-views'><img src={viewsIcon} alt=''/>{views}</p>
                    <a href={`/uploadvertvideo/${clipRequestId}`}><img alt='list' src={editIcon} /></a>
                </div>
            ) : (<></>)}
        </div>
    );
}

export default VerticalClip;