import { useEffect, useState } from 'react';
import songCoverTemplate from '../../Images/main-placeholder.png';

import FilterComponent from './FilterComponent/FilterComponent.jsx'
import SongCover from './PlayerComponents/SongCover.jsx'
import FilterBtn from '../../Images/player/FilterBtn.svg';
import filtersToggle from '../../Hooks/filtersToggle.js';

import './Player.css';
import { api, axiosPictures, axiosUnauthorized } from '../App/App.jsx';
import Loader from '../Loader/Loader.jsx';

import { useSelector } from 'react-redux';


function Player() {
    const [currentTrack, setCurrentTrack] = useState({
        id: '',
        trackName: 'Нет треков',
        trackCover: songCoverTemplate,
        authors: [],
        tags: [],
        lyrcs: ``
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const currentSong = useSelector((state)=> state.currentSong.value)

    const getCurrentTrackInfo = async () => {
        // подгрузка информации о текущем треке
        setIsLoaded(false);
        let imageLink = songCoverTemplate;
        let info = {};

        await axiosUnauthorized.get(`api/song/` + currentSong + `/logo/link`)
        .then(response => {
            imageLink = response.data.presignedLink;
        })
        .catch(err => {imageLink = songCoverTemplate});

        await axiosUnauthorized.get(`api/song/` + currentSong)
        .then(response => {
            info = {
                id: response.data.id,
                authorId: response.data.authorId,
                trackName: response.data.name,
                authors: [response.data.authorName],
                tags: response.data.genreList,
                trackCover: imageLink
            }
        })
        .catch(err => {console.log(err)});

        await axiosPictures.get(`api/author/` + info.authorId + `/logo`)
        .then(response => {
            info.authorLogo = api + `api/author/` + info.authorId + `/logo`
        })
        .catch(err => {
            info.authorLogo = songCoverTemplate
        });

        setCurrentTrack(info);
        setIsLoaded(true);
    }

    useEffect(() => {
        if(currentSong === '' || currentSong === null)
            return
        
        getCurrentTrackInfo();
    }, [currentSong])

    const bgLoaded = () =>{
        const img = document.querySelector('.player-bg-image')
        img.classList.add('bg-loaded')
    }


    // const toggleFilters = () =>{
    //     let filters = document.getElementById('filters-container-id')
    //     let btn = document.getElementById('f-toggle-btn')
    //     if(!filters) return
    //     filters.classList.toggle('filters-toggled')
    //     btn.classList.toggle('f-btn-active')
    // }

    if (isLoaded){
        return (
            <>
                <section className="comment-page-wrapper">           
                    <SongCover track = {currentTrack}/>
                    <div className="player-filters-toggle">
                        <button id='f-toggle-btn' onClick={filtersToggle} className="player-filters-toggle-btn">
                            <span>Настроить волну</span>
                            <img className='player-filters-toggle-img' src={FilterBtn} alt="" />
                        </button>
                        
                    </div>  
                </section>
                <FilterComponent/>
                <img className="player-bg-image" onLoad={bgLoaded} src={currentTrack.trackCover} alt="" />
            </>
        )
    }
    else {
        return (
            <>
                <section className="comment-page-wrapper">           
                    {/* <SongCover track = {currentTrack}/> */}
                    <Loader/>
                    <div className="player-filters-toggle">
                        <button id='f-toggle-btn' onClick={filtersToggle} className="player-filters-toggle-btn">
                        </button>
                        <img className='player-filters-toggle-img' src={FilterBtn} alt="" />
                    </div>  
                </section>
                <FilterComponent/>
                <img className="player-bg-image" onLoad={bgLoaded} src={currentTrack.trackCover} alt="" />
                
            </>
        )
    }
}
export default Player;