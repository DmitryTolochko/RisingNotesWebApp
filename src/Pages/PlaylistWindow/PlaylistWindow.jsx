import React, { useEffect } from 'react';
import SongCover from '../../Images/main-placeholder.png';
import Song from '../../Components/Song/Song';
import BackButton from '../../Components/BackButton';
import trash from '../../Images/trash.svg';
import bigEdit from '../../Images/account-page/edit-big.svg';
import pencil from '../../Images/pencil_gray.svg';
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector   } from 'react-redux';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized} from '../../Components/App/App';

import './PlaylistWindow.css';
import { updateSongsValue } from '../../Redux/slices/songsSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import { showError } from '../../Redux/slices/errorMessageSlice';
import { updatePlayerQueueName } from '../../Redux/slices/playerQueueSlice';
import { shortenText } from '../../Tools/Tools';

function PlaylistWindow(){
    const imageSetterRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [namePlaylist, setNamePlaylist] = useState('');
    const [isreviewSkin, setReviewSkin] = useState(false);
    let params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [logofile, setLogofile] = useState(SongCover);
    const [isPrivate, setIsPrivate] = useState(false);

    const playlists = useSelector((state)=>state.playlists.value)
    const dispatch = useDispatch();
    

    async function reviewAvatar() {
        // проверка на наличие картинки
        await axiosPictures.get(api + `api/playlist/${params.id}/logo/link`)
        .then ( resp => {
            setLogofile(resp?.data?.presignedLink);
        })
        .catch (error => {
            setLogofile(SongCover);
        })
    }

    useEffect(() => {
        getPlaylistInfo();
    }, [params.id]);

    async function getPlaylistInfo() {
        // подгрузка информации о плейлисте
        await axiosUnauthorized.get(`api/playlist/${params.id}`)
        .then(
            response => {
                setNamePlaylist(response.data.name);
                setIsPrivate(response.data.isPrivate);
            }
        )
        .catch(err => {navigate(-1)});

        await reviewAvatar();

        await axiosAuthorized.get(`api/playlist/` + params.id +`/song/list`)
        .then(
            response => {
                setSongs(response.data.songList);
        })
    }

    async function deletePlaylist() {
        // удаление плейлиста
        try {
            await axiosAuthorized.delete(`api/playlist/${params.id}`);
                dispatch(
                    updatePlaylistsValue(playlists.filter(id => id !== params.id))
                )
            navigate(`/featured`)
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }

    const handleImageInput = () => {
        if (playlists.filter(el => el === params.id).length > 0)
            imageSetterRef.current.click();
    }

    async function uploadLogo(event) {
        // обновление картинки
        event.preventDefault();
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size <= 5*1024*1024) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setLogofile(event.target.result);
                };
                reader.readAsDataURL(event.target.files[0]);
                const formData = new FormData();
                formData.append('LogoFile.File', event.target.files[0])
                await axiosAuthorized.patch(`/api/playlist/${params.id}/logo`, formData, { 
                    headers: { 
                        'Content-Type': 'multipart/form-data' 
                    }
                })
                .then ( () => {
                    setReviewSkin(true)
                });
            }
            else {
                dispatch(showError({errorText: 'Изображение должно быть не больше 5 Мб'}))
            }
        }
    };
   
    const toggleEditMode = () => {
        // переход в режим редактирования и удаление текущего плейлиста из списка
        setIsEditing(!isEditing);
       
    };

    const handleInputChange = (event) => {
        if (playlists.some(el => el === params.id)) {
            dispatch(
                updatePlaylistsValue(playlists.filter(el => el != params.id))
            )
        }
        setNamePlaylist(event.target.value);
    };

    const handleBlur = async () => {
        // Изменение информации о плейлисте и возвращение в список
        const playlistId = params.id;
        await axiosAuthorized.patch(`/api/playlist/${playlistId}`, { 
            name: namePlaylist, 
            isPrivate: isPrivate 
        })
        .then(() => {
            setIsEditing(false);
        });
        if (!playlists.some(el => el === params.id)) {
            dispatch(
                updatePlaylistsValue([...playlists, params.id])
            )
        }
    };

    const handleCheckboxChange = async () => {
        // приватизация плейлиста
        const playlistId = params.id;
        try {
          await axiosAuthorized.patch(`/api/playlist/${playlistId}`, {
            isPrivate: !isPrivate
          });
        } catch (error) {
          console.error(error);
        }

        setIsPrivate(!isPrivate);
    };

    function updatePlayableList (startId) {
        // Обновить текущий список вопроизведения
        let songsList = songs.map(el => el.id);
        let arr = songsList.slice(songsList.findIndex(e => e === startId));
        dispatch(updateSongsValue(arr));
        dispatch(updateMusicIsPlayingValue(true));
        dispatch(updatePlayerQueueName(namePlaylist));
    }

    return (
        <div className='comment-page-wrapper'>
            <div className='comment-page'>
                <BackButton/>
                <div className='playlist-information'>
                    <div className='playlist-image-wrapper' onClick={handleImageInput}>
                        {playlists.filter(el => el === params.id).length > 0 ? 
                            <div className='playlist-image-change'><img draggable='false' src={bigEdit}/></div> : <></>}
                        <img draggable='false' className='playlist-image' alt='playlist cover' 
                            src={logofile}/>
                    </div>
                    <div className='nameplaylist-and-buttons'>
                        {isEditing ? (
                            <input
                                className='input-name-playlist'
                                type="text"
                                value={shortenText(namePlaylist, 35)}
                                placeholder={'Введите название...'}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                maxLength={34}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleBlur();
                                    }
                                }}
                            />
                            ) : (
                            <p className='playlistname' >{shortenText(namePlaylist, 35)}</p>
                        )}
                        {playlists.filter(el => el === params.id).length > 0 ? (
                            <div className='playlist-edit'>
                                <div className="private-checkbox">
                                    <input type="checkbox" className='checkbox' checked={isPrivate}/>
                                    <span className="checkbox-icon"></span>
                                    <label className='private-playlist' onClick={handleCheckboxChange}>Приватный</label>
                                </div>
                                <p className='private-playlist' onClick={toggleEditMode}>
                                    <img className='pencil-icon' alt='pencil' src={pencil}/> Переименовать</p>
                                <p className='private-playlist' onClick={() => deletePlaylist()}>
                                    <img className='pencil-icon' alt='pencil' src={trash}/>Удалить плейлист</p>
                            </div>
                        ): (<></>)} 
                    </div>
                </div>
                <div className='tracks'>
                    {songs.map(el => (
                        <Song 
                        key={el.id} 
                        id={el.id} 
                        name={el.name} 
                        duration={el.durationMs} 
                        artist={el.authorName} 
                        genres={el.genreList}
                        onClick={updatePlayableList}/>
                    ))}
                </div>
            </div>
            <img className="playlist-bg-image" src={logofile} alt="" />
            <input type='file' accept=".jpg,.png" className='input-file' ref={imageSetterRef} onChange={uploadLogo}></input>
        </div>
    )

}

export default PlaylistWindow