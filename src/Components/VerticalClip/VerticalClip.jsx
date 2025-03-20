import { useState } from 'react'
import './VerticalClip.css'
import { useEffect, useRef } from 'react'
import { api, axiosUnauthorized } from '../App/App'
import Skeleton from 'react-loading-skeleton'
import { handleVideoEnter, handleVideoHover, handleVideoLeave, handleVideoMove } from '../Clip/handlers/ClipHandlers';
import { useDispatch } from 'react-redux'
import { updateVertVideoInfoValue } from '../../Redux/slices/vertVideoInfoSlice'
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice'
import { useSearchParams } from 'react-router-dom'
import { shortenText } from '../../Tools/Tools'
import { getSongLogo } from '../../Api/Song'
import { getAuthorInfo, getAuthorLogo } from '../../Api/Author'

function VerticalClip(props) {
    const [dataFetched, setDataFetched] = useState(false);
    const [vertData, setVertData] = useState(undefined);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [clipLink, setClipLink] = useState(undefined);
    const [previewLink, setPreviewLink] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams()
    const previewRef = useRef(undefined);
    const videoPreviewRef = useRef(undefined);

    const dispatch = useDispatch()

    useEffect(()=>{
        getVertData()
            .then(res=>{
                setVertData(res)
                setDataFetched(true)
            })
            .catch(err=>console.log(err))
    },[]);

    useEffect(() => {
        getClipLink()
            .then(response => setClipLink(response));
        getPreviewLink()
            .then(response => setPreviewLink(response));
    }, []);

    const getVertData = async () =>{
        let response = await axiosUnauthorized.get(api + `api/short-video/${props.id}`)
        .catch(err => Promise.reject(err));
        let result = response.data;

        await getAuthorLogo(result.uploaderId)
        result.authorAvatar = await getAuthorLogo(result.uploaderId);
        result.songLogo =  await getSongLogo(result.relatedSongId);

        let info = getAuthorInfo(result.uploaderId, undefined);
        result.authorName = info.name;

        return result;
    }

    async function getClipLink() {
        let response = await axiosUnauthorized.get('api/short-video/' + props.id + '/file/link')
        .catch(err => Promise.reject(err));

        return response?.data?.presignedLink;
    }

    async function getPreviewLink() {
        let response = await axiosUnauthorized.get('api/short-video/' + props.id + '/preview/link')
        .catch(err => Promise.reject(err));

        return response?.data?.presignedLink;
    }

    const handleVertClick = () =>{
        dispatch(updateMusicIsPlayingValue(false));
        setSearchParams({'short_view':clipLink})
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
    );




}

export default VerticalClip;