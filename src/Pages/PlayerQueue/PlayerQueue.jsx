import { useEffect, useState } from "react";
import BackButton from "../../Components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import queueIcon from '../../Images/List_Ordered.svg';
import warningIcon from '../../Images/sidebar/warning.svg';
import Excluded from "../../Components/Excluded/Excluded";
import { axiosUnauthorized } from "../../Components/App/App";
import Song from "../../Components/Song/Song";
import './PlayerQueue.css';
import { updatePlayerQueueVisibility } from "../../Redux/slices/playerQueueSlice";
import { shortenText } from "../../Components/ArtistCardComponents/ArtistInfo/ArtistInfo";

export default function PlayerQueue () {
    const dispatch = useDispatch();

    const [currPage, setCurrPage] = useState(0);
    const [songsInfo, setSongsInfo] = useState([]);

    const resize = useSelector((state)=> state.resize.value);
    const songs = useSelector((state)=>state.songs.value);
    const currentSong = useSelector((state) => state.currentSong.value);
    const isPlayerQueueVisible = useSelector((state) => state.playerQueue.isVisible);
    const queueName = useSelector((state) => state.playerQueue.currentQueue);

    useEffect(() => {
        getSongs();
    }, [currentSong, queueName, isPlayerQueueVisible]);

    async function getSongs() {
        let array = [];
        for (var id of songs) {
            await axiosUnauthorized.get(`api/song/${id}`)
            .then(response => {
                array.push(response.data);
            })
            .catch(err => {console.log(err)});
        }
        setSongsInfo(array);
    };

    const handleChangePage = (id) => {
        // смена страницы в лк
        setCurrPage(id);
    };

    return (
        <div className={isPlayerQueueVisible? 'player-queue' : 'player-queue invisible'} >
            <div className='featured'>
                <BackButton onClick={() => dispatch(updatePlayerQueueVisibility(false))}/>
                <div className="account-page-menu">
                    <a onClick={() => handleChangePage(0)} 
                        className={currPage === 0 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}
                        style={{maxWidth: 'fit-content'}}>
                        {resize === 'standart' ? <img alt='icon' src={queueIcon}/> : <></>}
                        Очередь прослушивания
                    </a>
                    <a onClick={() => handleChangePage(1)} 
                        className={currPage === 1 || currPage === 3 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}
                        style={{maxWidth: 'fit-content', color: '#787885'}}>
                        {resize === 'standart' ? <img alt='icon' src={warningIcon}/> : <></>}
                        Исключенные
                    </a>
                </div>

                {currPage === 1 ? <Excluded/> : <></>}
                {currPage === 0 ? (
                    <div>
                        <h2 className='queue-name'>Сейчас играет <p>«{shortenText(queueName, 40)}»</p></h2>
                        <div className='tracks scroll-tracks'>
                            {songsInfo.map(el => (
                                <Song 
                                    key={el.id} 
                                    id={el.id} 
                                    name={el.name} 
                                    duration={el.durationMs} 
                                    artist={el.authorName} 
                                    genres={el.genreList}
                                    onClick={() => (console.log('1'))}/>
                            ))}
                            {songs.length === 0 ? <p style={{color: '#FE1170'}}>Список пуст</p> : <></>}
                        </div>
                    </div>
                ) : (<></>)}

            </div>
        </div>
    )
}