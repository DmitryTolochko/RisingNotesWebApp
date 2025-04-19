import thumb from '../../Images/main-placeholder.png';
import check from '../../Images/check_big.svg';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../App/App';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { shortenText } from '../../Tools/Tools';

function PlaylistModalMenu({songAuthor, songName, id}) {
    const dispatch = useDispatch();
    const [playlistsInfo, setPlaylistsInfo] = useState([]);
    const playlists = useSelector((state)=>state.playlists.value);

    useEffect(() => {
        getPlaylistsInfo();
    }, [])

    async function getPlaylistsInfo() {
        // Получить или обновить информацию о плейлистах
        let arr = await Promise.all(playlists.map(async (el) => {
            const response = await axiosAuthorized.get(`api/playlist/${el.id}`)
            .catch(err => console.log(err));
            let img = thumb;
            await axiosPictures.get(api + `api/playlist/${el.id}/logo/link`)
            .then(response => img = response?.data?.presignedLink)
            .catch(err => img = thumb);

            let isSongInPlaylist = false;

            await axiosUnauthorized.get(`api/playlist/` + el.id +`/song/list`)
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

    async function addToPlaylist(playlist) {
        // Добавить в плейлист
        await axiosAuthorized.patch(api + `api/playlist/` + playlist.id + '/song/' + id).then(response => {
            getPlaylistsInfo();
        })
    }

    async function excludeFromPlaylist(playlist) {
        // Удалить из плейлиста
        await axiosAuthorized.delete(api + `api/playlist/` + playlist.id + '/song/' + id).then(response => {
            getPlaylistsInfo();
        })
    }

    async function createNewPlaylist() {
        // Создать новый плейлист и добавить в него песню
        let id = 0
        let formData = new FormData();
        formData.append('Name', shortenText(songAuthor, 15) + ' - ' + shortenText(songName, 15))
        await axiosAuthorized.post(api + 'api/playlist', formData, { headers: {
            "Content-Type": "multipart/form-data",
        }})
        .then (
            response => {
                id = response.data.id
                dispatch(updatePlaylistsValue([...playlists, {id: id, name: shortenText(songAuthor, 15) + ' - ' + shortenText(songName, 15), isPrivate: true}]))
                addToPlaylist({id: id, name: shortenText(songAuthor, 15) + ' - ' + shortenText(songName, 15), isPrivate: true});
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
                                        src={el.img}/>
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