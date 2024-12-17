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
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

function ClipPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const videoRef = useRef(null)
    const videoWrapperRef = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [canPlay, setCanPlay] = useState(false)
    const [link, setLink] = useState(null)
    
    const [isPlaying, setIsPlaying] = useState((videoRef.current?.currentTime >= 0 && !videoRef.current?.paused && !videoRef.current?.ended && videoRef.current?.readyState > 2))

    const [clipId, setClipId] = useState(searchParams.get('clip_id'))
    const [author, setAuthor] = useState(null)
    const [authorId, setAuthorId] = useState(null)
    const [title, setTitle] = useState(null)

    const getClipInfo = async () => {
        await axiosUnauthorized.get(api + `api/music-clip/${clipId}`)
            .then(response => {
                const data = response.data

                setTitle(data.title)
                setAuthorId(data.uploaderId)
                getAuthorName(data.uploaderId)
            })
            .catch(error => {
                console.log(`Can't fetch clip info. ${error}`)
            })
    }

    useEffect(()=>{
        getClipInfo()
    },[])

    const getAuthorName = async (id) => {
        await axiosUnauthorized.get(api+`api/author/${id}`)
            .then(response=>{
                setAuthor(response.data.name)
            })
            .catch(error =>{
                console.log(`Can't fetch author name. ${error}`)
            })
    }

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
        isPlaying ? videoRef.current?.pause() : videoRef.current?.play()
        setIsPlaying(!isPlaying)
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
                    <h2 className="clip-page-song-name">{title}</h2>
                    {author ?                 
                        <Link to={`/artist/${authorId}`} className="clip-page-author-wrapper">
                            <img src={api+`api/author/${authorId}/logo`} alt="" className="clip-page-author-avatar" />
                            <span className="clip-page-author-name">{author}</span>
                        </Link> 
                            :
                        <Skeleton baseColor='#0F141D' highlightColor="#2C323D"  height={200}/>
                    }
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