import { useState } from 'react'
import './VerticalClip.css'
import { useEffect, useRef } from 'react'
import { api, axiosPictures, axiosUnauthorized } from '../App/App'
import Skeleton from 'react-loading-skeleton'
import { handleVideoEnter, handleVideoHover, handleVideoLeave, handleVideoMove } from '../Clip/handlers/ClipHandlers';
import { useDispatch } from 'react-redux'
import { updateVertVideoInfoValue } from '../../Redux/slices/vertVideoInfoSlice'
import { updateVertVideoPlayerValue } from '../../Redux/slices/vertVideoPlayerSlice'
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice'
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';

function VerticalClip(props) {
    const [dataFetched, setDataFetched] = useState(false)
    const [vertData, setVertData] = useState(undefined)
    const [videoLoaded, setVideoLoaded] = useState(false)

    const previewRef = useRef(undefined)
    const videoPreviewRef = useRef(undefined)

    const dispatch = useDispatch()

    useEffect(()=>{
        getVertData()
            .then(res=>{
                setVertData(res)
                setDataFetched(true)
            })
            .catch(err=>console.log(err))
    },[])

    const getVertData = async () =>{
        let response = await axiosUnauthorized.get(api + `api/short-video/${props.id}`)
        .catch(err => Promise.reject(err));
        let result = response.data;

        response = await axiosPictures.get(api + 'api/author/' + result.uploaderId + '/logo')
        .catch(err => console.log(err));

        if (response?.status === 200) {
            result.authorAvatar = api + 'api/author/' + result.uploaderId + '/logo';
        } else {
            result.authorAvatar = defaultAvatar;
        }

        response = await axiosPictures.get(api + 'api/song/' + result.relatedSongId + '/logo')
        .catch(err => console.log(err));

        if (response?.status === 200) {
            result.songLogo = api + 'api/song/' + result.relatedSongId + '/logo';
        } else {
            result.songLogo = defaultAvatar;
        }

        response = await axiosUnauthorized.get(api + 'api/author/' + result.uploaderId)
        .catch(err => Promise.reject(err));

        result.authorName = response.data.name;
        return result;
    }

    const handleVertClick = () =>{
        dispatch(updateMusicIsPlayingValue(false));
        dispatch(updateVertVideoPlayerValue(
            api + `api/short-video/${props.id}/file`
        ))
        dispatch(updateVertVideoInfoValue(vertData));
    }

    return ( 
        <div className="vertical-clip">
             {videoLoaded ? <></>:  <>  
                <Skeleton baseColor='#0F141D' highlightColor="#2C323D"  height={700}/>
            </>}
            {!dataFetched? <></> :
             <div className="vert-video" 
                onClick={handleVertClick}
                onMouseOver={() => handleVideoHover(videoPreviewRef, api + `api/short-video/${props.id}/file`)}
                onMouseEnter={() => handleVideoEnter(previewRef)}
                onMouseMove={() => handleVideoMove(videoPreviewRef)}
                onMouseLeave={() => handleVideoLeave(previewRef, videoPreviewRef)} >
                <img
                    ref={previewRef}
                    draggable='false'
                    className='vert-cover' 
                    src={api + `api/short-video/${props.id}/preview`}
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
                    <h2>{vertData.title}</h2>
                    <span>{vertData.description}</span>
                </div>
            </div>
            }
           
        </div>
    );




}

export default VerticalClip;