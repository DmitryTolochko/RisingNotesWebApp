import { useEffect, useRef, useState } from 'react';
import playIcon from '../../../Images/play.svg'
import pauseIcon from '../../../Images/Pause.svg'
import volumeIcon from '../../../Images/VolumeIcon.svg'
import settingsIcon from '../../../Images/settings.svg'
import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import SettingsWidget from '../SettingsWidget/SettingsWidget';

import './CustomControls.css'

function CustomControls({video, wrapper, canPlay, isPlaying, setIsPlaying}) {
    const [volume, setVolume] = useState(0.5)
    const [fullscreen, setFullscreen] = useState(false)
    const [currentVideoTime, setCurrentVideoTime] = useState(0)
    const [maxVideoTime, setMaxVideoTime] = useState('')
    const [videoDuration, setVideoDuration] = useState(0)
    const [videoTimeLabel, setVideoTimeLabel] = useState({
        minutes:0,
        seconds:0
    })
    const [settingsEnabled, setSettingsEnabled] = useState(false)
    const [settingsType, setSettingsType] = useState('default')
    const [curQuality, setCurQuality] = useState('720')
    const [curSpeed, setCurSpeed] = useState(1)

    useEffect(()=>{
        //on video load
        if(video){
            video.ontimeupdate = (e) =>{
                setCurrentVideoTime(video.currentTime)
            }
            setVideoDuration(video.duration)

            let minutes = Math.floor(video?.duration / 60);
            let seconds = Math.floor(video?.duration - minutes * 60);
            setMaxVideoTime(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`)
        }
        else{
            setVideoDuration(0)
        }
    },[canPlay])

    useEffect(()=>{
        if(video)
            video.playbackRate = curSpeed
    },[curSpeed])

    useEffect(()=>{
        let minutes = Math.floor(currentVideoTime / 60);
        let seconds = Math.floor(currentVideoTime - minutes * 60);
        setVideoTimeLabel({
            minutes:minutes,
            seconds:seconds < 10? '0' + seconds : seconds
        })
    },[currentVideoTime])

    useEffect(()=>{
        if(video)
            video.volume = volume
    },[volume])

    useEffect(()=>{
        const videoWrapper = wrapper.current
        if(!video || !videoWrapper) return
        
        if(fullscreen){
            if (videoWrapper.requestFullscreen) 
                videoWrapper.requestFullscreen();
            else if (videoWrapper.webkitRequestFullscreen)
                videoWrapper.webkitRequestFullscreen();
            else if (videoWrapper.msRequestFullScreen ) 
                videoWrapper.msRequestFullScreen()
        }
        else{
            if (!window.screenTop && !window.screenY)
                document.exitFullscreen();
        }

    },[fullscreen])

    const onPlayButtonClick = () =>{
        if(isPlaying)
            video?.pause()
        else
            video?.play()
        setIsPlaying(!isPlaying)
    }

    const onVolumeInputChange = (e) =>{
        setVolume(e.target.value / 100)
    }

    const onFullscreenButtonClick = () =>{
        setFullscreen(!fullscreen)
    }

    const onVideoTimeInputChange = (e) =>{
        setCurrentVideoTime(e.target.value)
    }

    const onVideoTimeInputDragEnd = (e) =>{
        video.currentTime = e.target.value
    }


    if(canPlay)
        return ( 
            <div className={fullscreen? "custom-controls cc-fullscreen" : "custom-controls"}>
                <div className="time-tracker">
                    <div className="current-time">
                        {`${videoTimeLabel.minutes}:${videoTimeLabel.seconds}`}
                    </div>
                    <div className="time-track">
                        <input 
                            className='cc-time-input' 
                            type="range"
                            value={currentVideoTime}
                            min="0" 
                            max={videoDuration} 
                            onChange={onVideoTimeInputChange}
                            onMouseUp={onVideoTimeInputDragEnd}
                        />
                        <div className="video-time-track" style={{width: `${currentVideoTime / videoDuration * 100}%`}} />
                    </div>
                    <div className="max-time">
                        {maxVideoTime}
                    </div>
                </div>
                <div className="controls-wrapper">
                    <div className="controls-group-wrapper group-wide">
                        <button className="cc-play" onClick={onPlayButtonClick}>
                            <img src={!isPlaying? playIcon: pauseIcon} alt="" /> 
                        </button>
                        <div className="cc-volume-changer">
                            <img className='cc-volume-icon' src={volumeIcon} alt="" />
                            <input 
                                className='cc-volume-input' 
                                type="range" 
                                defaultValue={50} 
                                min="0" 
                                max="100" 
                                onChange={onVolumeInputChange}
                            />
                            <div className="volume-input-track" style={{width:`${volume*100}%`}}/>
                        </div>
                    </div>
                    <div className="controls-group-wrapper setting-control-group">
                        <button className="cc-settings" onClick={()=> setSettingsEnabled(!settingsEnabled)}>
                            <img src={settingsIcon} alt="" />
                        </button>
                        <SettingsWidget
                            type={settingsType}
                            setSettingsType={setSettingsType}
                            settingsEnabled={settingsEnabled}
                            setSettingsEnabled={setSettingsEnabled}
                            curQuality={curQuality}
                            setCurQuality={setCurQuality}
                            curSpeed={curSpeed}
                            setCurSpeed={setCurSpeed}
                        />
                        <button className="cc-fullscreen" onClick={onFullscreenButtonClick}>
                            { !fullscreen? <BsFullscreen/> : <BsFullscreenExit/>}   
                        </button>
                    </div>
                </div>
            </div>
        )
    else
        return(
            //TODO: надо подумать, какой лоадер показывать 
            
            <div className='video-page-loader'> 
                <Skeleton baseColor='#0F141D' highlightColor="#2C323D" width={'100%'} height={'100%'}/>
            </div>
        )
}

export default CustomControls;