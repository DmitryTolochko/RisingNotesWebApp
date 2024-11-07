import thumb from '../../Images/main-placeholder.png';
import check from '../../Images/check_big.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../App/App';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';

function PlaylistModalMenu({songAuthor, songName, id}) {
    const dispatch = useDispatch();
    const [playlistsInfo, setPlaylistsInfo] = useState([]);
    const playlists = useSelector((state)=>state.playlists.value);

    useEffect(() => {
        getPlaylistsInfo();
    }, [])

    async function getPlaylistsInfo() {
        // Получить или обновить информацию о плейлистах
        try {
           let arr = await Promise.all(playlists.map(async (el) => {
                const response = await axiosAuthorized.get(`api/playlist/${el}`)
                .catch(err => console.log(err));
                let img = true;
                await axiosPictures.get(api + `api/playlist/${el}/logo?width=10&height=10`)
                .catch(err => {img = false});

                let isSongInPlaylist = false;

                await axiosUnauthorized.get(`api/playlist/` + el +`/song/list`)
                .then(resp => {
                    if (resp.data.songList.filter(el => el.id === id).length > 0)
                    {
                        isSongInPlaylist = true;
                    }
                })

                return {
                    name: response?.data?.name,
                    id: el,
                    img: img,
                    isSongInPlaylist: isSongInPlaylist
                };
           }));
           setPlaylistsInfo(arr);
        }
        catch (err) {
           console.log(err);
        }
    }  

    async function addToPlaylist(playlistId) {
        // Добавить в плейлист
        await axiosAuthorized.patch(api + `api/playlist/` + playlistId + '/song/' + id).then(response => {
            getPlaylistsInfo();
        })
    }

    async function excludeFromPlaylist(playlistId) {
        // Удалить из плейлиста
        await axiosAuthorized.delete(api + `api/playlist/` + playlistId + '/song/' + id).then(response => {
            getPlaylistsInfo();
        })
    }

    async function createNewPlaylist() {
        // Создать новый плейлист и добавить в него песню
        let id = 0
        let formData = new FormData();
        formData.append('Name', songAuthor + ' - ' + songName)
        await axiosAuthorized.post(api + 'api/playlist', formData, { headers: {
            "Content-Type": "multipart/form-data",
        }})
        .then (
            response => {
                id = response.data.id
                dispatch(updatePlaylistsValue([...playlists, id]))
                addToPlaylist(id);
            }
        )

    }

    return(
        <div className="list-modal-window">
            <div className="song-modal">
                <p className="song-modal__title">
                    Добавить в плейлист
                </p>
                <div className='song-modal__playlists'>
                    <ul>
                        {playlistsInfo?.map(el => {
                            return (
                                <li className={el.isSongInPlaylist ? 'song-modal__playlist red-text' : 'song-modal__playlist'} key={el.id} onClick={
                                    el.isSongInPlaylist ? () => excludeFromPlaylist(el.id) : () => addToPlaylist(el.id)}>
                                    {el.isSongInPlaylist ? <img className='song-modal__playlist-thumb-selected' src={check} alt=""/> : <></>}
                                    <img className='song-modal__playlist-thumb'draggable='false' 
                                        src={el.img ? api + `api/playlist/${el.id}/logo?width=10&height=10` : thumb}/>
                                    <span className='song-modal__playlist-name'>{el.name}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <button className='song-modal__add-button' onClick={createNewPlaylist}>
                    + Новый плейлист
                </button>
            </div>
        </div>
    )
}

export default PlaylistModalMenu;