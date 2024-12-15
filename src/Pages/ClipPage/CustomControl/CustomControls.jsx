import { useEffect, useRef, useState } from 'react';
import playIcon from '../../../Images/play.svg'
import pauseIcon from '../../../Images/Pause.svg'
import volumeIcon from '../../../Images/VolumeIcon.svg'
import settingsIcon from '../../../Images/settings.svg'
import timerIcon from '../../../Images/Timer.svg'
import slidersIcon from '../../../Images/sliders.svg'
import checkIcon from '../../../Images/Check_Big.png'
import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import backIcon from '../../../Images/settings-back.svg'
import './CustomControls.css'

function CustomControls({video, wrapper}) {
    const currentVideo = video.current
    const [isPlaying, setIsPlaying] = useState((video.current?.currentTime >= 0 && !video.current?.paused && !video.current?.ended && video.current?.readyState > 2)) 
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
        if(currentVideo){
            currentVideo.ontimeupdate = (e) =>{
                setCurrentVideoTime(currentVideo.currentTime)
            }
            setVideoDuration(currentVideo.duration)

            let minutes = Math.floor(currentVideo?.duration / 60);
            let seconds = Math.floor(currentVideo?.duration - minutes * 60);
            setMaxVideoTime(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`)
        }
    },[currentVideo])

    useEffect(()=>{
        if(currentVideo)
            currentVideo.playbackRate = curSpeed
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
        if(currentVideo)
            currentVideo.volume = volume
    },[volume])

    useEffect(()=>{
        const videoWrapper = wrapper.current
        if(!currentVideo || !videoWrapper) return
        
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
            currentVideo?.pause()
        else
            currentVideo?.play()
        setIsPlaying(!isPlaying)
    }

    const onVolumeInputChange = (e) =>{
        setVolume(e.target.value / 100)
    }

    const onFullscreenButtonClick = () =>{
        setFullscreen(!fullscreen)
    }

    const onVideoTimeInputChange = (e) =>{
        currentVideo.currentTime = e.target.value
    }

    const SettingsPopup = ({type}) =>{ 
        const QualityListElement = ({quality, label}) => {
            return(
                <li className={curQuality === quality? 'q-el-active q-el' : 'q-el'}>
                    {curQuality === quality && <img src={checkIcon} alt="" />}
                    <button onClick={()=>setCurQuality(quality)}>{label}</button>
                </li>
            )
        }

        const SpeedListElement = ({speed, label}) => {
            return(
                <li className={curSpeed === speed? 'q-el-active q-el' : 'q-el'}>
                    {curSpeed === speed && <img src={checkIcon} alt="" />}
                    <button onClick={()=>setCurSpeed(speed)}>{label}</button>
                </li>
            )
        }

        if(type === 'default'){
            return(
                <div className={settingsEnabled? "cc-settings-popup cc-s-p-visible" : "cc-settings-popup"}>
                    <div className="cc-s-top">
                        <span>Настройки</span> 
                        <button onClick={()=>setSettingsEnabled(false)}>X</button>
                    </div>
                    <button className='cc-s-option' onClick={()=>setSettingsType('quality')}>
                        <img src={slidersIcon} alt="" draggable='false'/>
                        Качество видео
                    </button>
                    <button className='cc-s-option cc-s-o-last'  onClick={()=>setSettingsType('speed')}>
                        <img src={timerIcon} alt="" draggable='false'/>
                        Скорость воспроизведения
                    </button>
                </div>
            )
        }

        if(type === 'quality'){
            return(
                <div className={settingsEnabled? "cc-settings-popup cc-s-p-visible" : "cc-settings-popup"}>
                    <div className="cc-s-top">
                        <div className='cc-s-top-wrapper'>
                            <button onClick={() => setSettingsType('default')}>
                                <img src={backIcon} alt=""/>
                            </button>
                            <span>Качество видео</span> 
                        </div>
                        <button onClick={()=>setSettingsEnabled(false)}>X</button>
                    </div>
                    <ul className="quality-list">
                        <QualityListElement quality={'1080'} label={'1080p60'}/>
                        <QualityListElement quality={'720'} label={'720p60'}/>
                        <QualityListElement quality={'480'} label={'480p'}/>
                        <QualityListElement quality={'360'} label={'360p'}/>
                        <QualityListElement quality={'144'} label={'144p'}/>
                    </ul>
                </div>
            )
        }


        if(type === 'speed'){
            return(
                <div className={settingsEnabled? "cc-settings-popup cc-s-p-visible" : "cc-settings-popup"}>
                    <div className="cc-s-top">
                        <div className='cc-s-top-wrapper'>
                            <button onClick={() => setSettingsType('default')}>
                                <img src={backIcon} alt=""/>
                            </button>
                            <span>Скорость воспроизведения</span> 
                        </div>
                        <button onClick={()=>setSettingsEnabled(false)}>X</button>
                    </div>
                    <ul className="quality-list">
                        <SpeedListElement speed={2} label={'2.0'}/>
                        <SpeedListElement speed={1.75} label={'1.75'}/>
                        <SpeedListElement speed={1.5} label={'1.5'}/>
                        <SpeedListElement speed={1.25} label={'1.25'}/>
                        <SpeedListElement speed={1} label={'Обычная'}/>
                        <SpeedListElement speed={0.75} label={'0.75'}/>
                        <SpeedListElement speed={0.5} label={'0.5'}/>
                        <SpeedListElement speed={0.25} label={'0.25'}/>
                    </ul>
                </div>
            )
        }
    }

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
                    <SettingsPopup type={settingsType}/>
                    <button className="cc-fullscreen" onClick={onFullscreenButtonClick}>
                        { !fullscreen? <BsFullscreen/> : <BsFullscreenExit/>}   
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomControls;