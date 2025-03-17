import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CloseIcon } from '../../Images/x.svg';
import CustomButton from "../CustomButton/CustomButton";
import { updateAttachedSongs, updateIsModalSongsVisibe } from "../../Redux/slices/socketInfoSlice";
import Song from "../Song/Song";
import { songsByFiltersGetter } from "../Player/FilterComponent/FIlters/Filters";
import { fetchTracks } from "../SearchResults/APICallers/GetArtistData";
import { showError } from "../../Redux/slices/errorMessageSlice";

export default function ModalSongs() {
    const isVisible = useSelector((state)=> state.socketInfo.isModalSongsVisible);
    const attachedSongs = useSelector((state) => state.socketInfo.attachedSongs);
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState(undefined);
    const [songs, setSongs] = useState([]);
    const [pickedSongs, setPickedSongs] = useState([...attachedSongs]);

    const delay = 500;

    useEffect(() => {
        setPickedSongs(attachedSongs);
    }, [attachedSongs]);

    function handleCloseModalContacts() {
        dispatch(updateIsModalSongsVisibe(false));
        setSearchValue('');
    }

    async function getSongs() {
        let tracks = await fetchTracks(searchValue);
        setSongs(tracks);
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
          if (searchValue && searchValue !== '') {
            getSongs();
          } else {
            setSongs(pickedSongs);
          }
        }, delay);
    
        return () => clearTimeout(timerId);
    }, [searchValue, delay]);

    function handleClickOnSong(song) {
        if (pickedSongs.length >= 10) {
            dispatch(showError({ errorText: 'Нелья добавлять больше 10 вложений' }));
        } else if (!pickedSongs.some(el => el.id === song.id)) {
            setPickedSongs([...pickedSongs, song]);
        }
    }

    function deleteSong(song) {
        setPickedSongs(pickedSongs.filter(el => el.id !== song.id));
    }

    function handleAttachSongs() {
        dispatch(updateAttachedSongs(pickedSongs));
        handleCloseModalContacts();
    }
    
    if (isVisible)
    return(
        <div className="modal-add-contacts-wrapper">
            <div className="modal-add-contacts">
                <div className="modal-add-contacts-row">
                    <p>Добавление музыки</p>
                    <button className="close-modal-add-contacts" onClick={handleCloseModalContacts}>
                        <CloseIcon className="close-chat-img"/>
                    </button>
                </div>

                <div className="searchbar-container modal-add-contacts-searchbar">
                    <div>
                        <input 
                            className='searchbar' 
                            type="text" 
                            placeholder='Введите название трека или автора...'
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="modal-contacts" style={{gap: '0px', paddingTop: '33px'}}>
                    <div className="tracks">
                        {songs.map((song, index) => (
                            <Song 
                                id={song.id} key={index}
                                name={song.name}
                                artist={song.authorName}
                                genres={song.genreList}
                                duration={song.durationMs}
                                onClick={() => handleClickOnSong(song)}
                                isAttachedToMessage={true}
                                isPicked={pickedSongs.some(el => el.id === song.id)}
                                deleteFunc={() => deleteSong(song)}/>
                        ))}
                    </div>
                </div>
                <div className="modal-add-contacts-row">
                    <CustomButton text={'+ Приложить треки'} func={handleAttachSongs}/>
                </div>
            </div>
        </div>
    )
}