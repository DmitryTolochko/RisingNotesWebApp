import timerIcon from '../../../Images/Timer.svg'
import slidersIcon from '../../../Images/sliders.svg'
import checkIcon from '../../../Images/Check_Big.png'
import backIcon from '../../../Images/settings-back.svg'

function SettingsWidget({
    type,
    settingsEnabled,
    setSettingsEnabled,
    setSettingsType,
    curQuality,
    setCurQuality,
    curSpeed,
    setCurSpeed
}) {
        if(type === 'default'){
            return(
                <div className={settingsEnabled? "cc-settings-popup cc-s-p-visible" : "cc-settings-popup"}>
                    <div className="cc-s-top" onClick={()=>setSettingsEnabled(false)}>
                        <span>Настройки</span> 
                        <button>X</button>
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
            <SettingPopupWindow 
                type='quality'
                setSettingsType={setSettingsType}
                settingsEnabled={settingsEnabled} 
                setSettingsEnabled={setSettingsEnabled} 
            >
                    <QualityListElement quality={'1080'} curQuality={curQuality} setCurQuality={setCurQuality} label={'1080p60'}/>
                    <QualityListElement quality={'720'} curQuality={curQuality} setCurQuality={setCurQuality}  label={'720p60'}/>
                    <QualityListElement quality={'480'} curQuality={curQuality} setCurQuality={setCurQuality}  label={'480p'}/>
                    <QualityListElement quality={'360'} curQuality={curQuality} setCurQuality={setCurQuality}  label={'360p'}/>
                    <QualityListElement quality={'144'} curQuality={curQuality} setCurQuality={setCurQuality}  label={'144p'}/>
            </SettingPopupWindow>
        )
    }

    if(type === 'speed'){
        return(
            <SettingPopupWindow
                type='speed'
                setSettingsType={setSettingsType}
                settingsEnabled={settingsEnabled} 
                setSettingsEnabled={setSettingsEnabled} 
            >
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={2} label={'2.0'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={1.75} label={'1.75'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={1.5} label={'1.5'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={1.25} label={'1.25'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={1} label={'Обычная'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={0.75} label={'0.75'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={0.5} label={'0.5'}/>
                    <SpeedListElement curSpeed={curSpeed} setCurSpeed={setCurSpeed} speed={0.25} label={'0.25'}/>
        </SettingPopupWindow>
        )
    }
}
           
    
     const QualityListElement = ({quality, curQuality, setCurQuality, label}) => {
        return(
            <li className={curQuality === quality? 'q-el-active q-el' : 'q-el'} onClick={()=>setCurQuality(quality)}>
                {curQuality === quality && <img src={checkIcon} alt="" />}
                <button>{label}</button>
            </li>
        )
    }

    const SpeedListElement = ({speed, label, curSpeed, setCurSpeed}) => {
        return(
            <li className={curSpeed === speed? 'q-el-active q-el' : 'q-el'} onClick={()=>setCurSpeed(speed)}>
                {curSpeed === speed && <img src={checkIcon} alt="" />}
                <button>{label}</button>
            </li>
        )
    }

    const SettingPopupWindow = ({
        type,
        setSettingsType,
        children,
        settingsEnabled,
        setSettingsEnabled
    }) =>{
        return(
            <div className={settingsEnabled? "cc-settings-popup cc-s-p-visible" : "cc-settings-popup"}>
                <div className="cc-s-top" onClick={() => setSettingsType('default')}>
                    <div className='cc-s-top-wrapper'>
                        <button >
                            <img src={backIcon} alt=""/>
                        </button>
                        <span>{type === 'speed'?'Скорость воспроизведения':'Качество видео'}</span> 
                    </div>
                    <button onClick={()=>setSettingsEnabled(false)}>X</button>
                </div>
                <ul className="quality-list">
                    {children}
                </ul>
            </div>
        )
    }   

export default SettingsWidget;