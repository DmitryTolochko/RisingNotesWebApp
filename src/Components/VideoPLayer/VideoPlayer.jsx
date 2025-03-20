import { useEffect, useRef } from 'react';
import './VideoPlayer.css';
import closeButton from '../../Images/playerforvideo/closebutton.svg'
import risingnotes from '../../Images/playerforvideo/risingnotes.svg'
import { useSelector, useDispatch } from 'react-redux';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import { useSearchParams } from 'react-router-dom';


function VideoPlayer() {
    const videoRef = useRef();
    const video = useSelector((state)=>state.videoPlayer.value);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        handlePlayVideo();
    }, [video])

    function handlePlayVideo() {
        // плеер видео
        if (!video) {
            videoRef?.current?.pause();
        }
        else if (typeof video === "string" && video.includes('api/music-clip')) {
            // playFunc(video);
            videoRef.current.src = video;
            // videoRef.current.play();
            dispatch(updateMusicIsPlayingValue(false));
        }
        else {
            // const url = URL.createObjectURL(video);
            // playFunc(url);
            videoRef.current.src = video;
            // videoRef.current.play();
            dispatch(updateMusicIsPlayingValue(false));
        }
    }

    return (
        <>
            {video ? 
                <div className='video-player-wrapper'>
                    <img className="rising-notes-forplayer" src={risingnotes}></img>
                    <button className='player-exit-button' onClick={() => {
                        setSearchParams({})
                        dispatch(
                            updateVideoPlayerValue(false)
                            )}
                    }>
                    <img src={closeButton} /></button>
                    <video className='video-player' ref={videoRef} type="video/mp4" preload="auto" autoPlay={true} controls/>
                </div>: <></>
            }
        </>
    )
}


export default VideoPlayer;