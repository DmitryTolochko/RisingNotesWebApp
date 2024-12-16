import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import backIcon from '../../Images/back.svg'
import { updateMusicIsPlayingValue } from "../../Redux/slices/musicIsPlayingSlice";
import Commentaries from "../Commentaries/Commentaries";
import './ClipPage.css'
import { axiosUnauthorized } from "../../Components/App/App"
import { api } from "../../Components/App/App";
import CustomControls from "./CustomControl/CustomControls";

function ClipPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const videoRef = useRef(null)
    const videoWrapperRef = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [link, setLink] = useState(null)
    const [name, setName] = useState(searchParams.get('clip_name'))
    const [author, setAuthor] = useState(searchParams.get('author_name'))
    const [clipId, setClipId] = useState(searchParams.get('clip_id'))
    const [canPlay, setCanPlay] = useState(false)
    const [isPlaying, setIsPlaying] = useState((videoRef.current?.currentTime >= 0 && !videoRef.current?.paused && !videoRef.current?.ended && videoRef.current?.readyState > 2))


    const getClipLink = async () =>{
        await axiosUnauthorized.get(api + `api/music-clip/${clipId}/file/link`)
            .then(res=>setLink(res.data.presignedLink))
            .catch(err=>console.log(err))
    }

    useEffect(() => {
        getClipLink()
        handlePlayVideo();
    }, [link])

    function handlePlayVideo() {
        // плеер видео
        if (!link) {
            videoRef?.current?.pause();
        }
        else if (typeof link === "string" && link.includes('api/music-clip')) {
            videoRef.current.src = link;
            dispatch(updateMusicIsPlayingValue(false));
        }
        else {
            videoRef.current.src = link;
            dispatch(updateMusicIsPlayingValue(false));
        }
    }

    function handleVideoClick(){
        if(videoRef.current)
           return 
    }

    return (
        <>
            <div className="clip-page-wrapper">
                <div className="clip-page-top">
                    <button className="clip-back-btn" onClick={()=>navigate(-1)}>
                        <img src={backIcon} alt=""/> Назад
                    </button>
                </div>
                <div ref={videoWrapperRef} className="video-wrapper">
                    <video 
                        className='video-player' 
                        ref={videoRef} 
                        type="video/mp4" 
                        preload="auto" 
                        autoPlay={false}

                        onCanPlay={()=>setCanPlay(true)} 
                        onClick={handleVideoClick}
                    />
                    <CustomControls 
                        video={videoRef.current} 
                        wrapper={videoWrapperRef} 
                        canPlay={canPlay}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                    />
                    <h2 className="clip-page-song-name">{name}</h2>
                    <span className="clip-page-author-name">{author}</span>
                </div>
            </div>

            <hr className="clip-hr"/>

            <div className="clip-page-wrapper" style={{marginTop:0}}>
                <Commentaries clip={clipId}/>
            </div>
        </>

    );
}

export default ClipPage;