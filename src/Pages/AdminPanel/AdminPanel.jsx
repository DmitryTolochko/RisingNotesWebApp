import React, { useEffect, useState } from 'react';
import BackButton from '../../Components/BackButton';
import { api, axiosAuthorized } from '../../Components/App/App';
import newPlaylist from '../../Images/featured/newplaylist.png';
import searchIcon from '../../Images/sidebar/Vector.svg';

import './AdminPanel.css';
import UserCard from '../../Components/UserCard/UserCard';
import ChosenUser from '../../Components/ChosenUser/ChosenUser';
import { getClipRequestInfo, getClipRequestsListForReview } from '../../Api/ClipPublish';
import { getSongRequestInfo, getSongRequestsListForReview } from '../../Api/SongPublish';
import Clip from '../../Components/Clip/Clip';
import VerticalClip from '../../Components/VerticalClip/VerticalClip';
import Song from '../AccountPage/Songs/Song';
import Playlists from '../Featured/Playlists';
import { createNewPlaylist, getGeneratedplaylists } from '../../Api/Playlist';
import Playlist from '../../Components/Playlist/Playlist';
import { useNavigate } from 'react-router-dom';
import { updatePlaylistsValue } from '../../Redux/slices/playlistsSlice';
import { useDispatch } from 'react-redux';

function AdminPanel() {
    const [songRequestsList, setSongRequestsList] = useState([]);
    const [clipRequestsList, setClipRequestsList] = useState([]);
    const [blogsRequestsList, setBlogsRequestsList] = useState([]);
    const [currPage, setCurrPage] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [search, setSearch] = useState(searchIcon);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (currPage === 0)
            getSongRequestsList();
        else if (currPage === 1)
            getClipRequestsList();
        else if (currPage === 3)
            getBlogsRequestsList();
        else if (currPage === 4) {
            getPlaylists();
        }
        else 
            getUsersList();
    }, [currPage, searchQuery]);

    const handleChangePage = (id) => {
        // смена страницы в лк
        setCurrPage(id);
        setIsLoaded(false);
    };

    async function getSongRequestsList() {
        // получение заявок с песнями
        let list = await getSongRequestsListForReview();
        let correctList = [];

        for (var el of list) {
            try {
                let info = await getSongRequestInfo(el.id);
                info.id = el.id;
                info.status = el?.status;
                info.authorName = el?.authorName;

                correctList = [...correctList, info];
            }
            catch (err) {
                console.log(err);
            }
        }

        setSongRequestsList(correctList);
        setIsLoaded(true);
    };

    async function getClipRequestsList() {
        // получение заявок с песнями
        let list = await getClipRequestsListForReview();
        let correctList = [];

        for (var el of list) {
            try {
                let info = await getClipRequestInfo(el.id);
                console.log(info);
                correctList = [...correctList, {...info, ...el}];
            }
            catch (err) {
                console.log(err);
            }
        }
        console.log(correctList);
        setClipRequestsList(correctList);
        setIsLoaded(true);
    };

    async function getUsersList() {
        let list = [];
        let correctList = [];
        await axiosAuthorized.get('api/author/list' + `?NameWildcard=${searchQuery}`)
        .then(response => {
            list = response.data.authorList;
        });
        setUsers(list);
        setIsLoaded(true);
    }

    async function getBlogsRequestsList() {
        let list = await getClipRequestsListForReview(true);
        setBlogsRequestsList(list);
    }

    async function getPlaylists() {
        let list = await getGeneratedplaylists();
        setPlaylists(list);
    }

    async function addNewPlaylist() {
        let id = await createNewPlaylist('Новый плейлист', true);
        dispatch(updatePlaylistsValue([...playlists, {id: id, name: "Новый плейлист", isPrivate: true}]));
        navigate(`/playlist/${id}`);
    };

    return (
        <div className='comment-page-wrapper'>
            <div className='featured'>
                <BackButton/>
                <div className='search-element'>
                    <h2 className='sub-h2'>Заявки на модерацию</h2>
                </div>

                <div className="account-page-menu">
                        <a onClick={() => handleChangePage(0)} 
                            className={currPage === 0 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                            Музыка
                        </a>
                        <a onClick={() => handleChangePage(1)} 
                            className={currPage === 1 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                            Клипы
                        </a>
                        <a onClick={() => handleChangePage(3)} 
                            className={currPage === 3 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                            Блоги
                        </a>
                        <a onClick={() => handleChangePage(4)} 
                            className={currPage === 4 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                            Плейлисты
                        </a>
                        <a onClick={() => handleChangePage(2)} 
                            className={currPage === 2 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                            Пользователи
                        </a>
                </div>

                {currPage === 0 ? (
                    <div className='tracks'>
                        {songRequestsList.map(el => <Song 
                            key={el.id} 
                            id={el.id} 
                            artist={el.authorName} 
                            featured={el.featuredAuthorList.map(el => el.name)}
                            status={el.status}/>)}
                    </div>
                ) : (<></>)}

                {currPage === 1 ? (
                    <div className="artist-clips">
                        {clipRequestsList?.map((clip,index) => (
                            <Clip 
                                key={index} 
                                clipRequestId={clip.id}
                                authorId={clip.authorId} 
                                songId={clip.songId} 
                                name={clip.title} 
                                isArtist={true}
                                status={clip.status}/>
                        ))}
                    </div>
                ) : (<></>)}
                
                {currPage === 2 ? (
                    <div className='admin-users'>
                        <div className='admin-users-list'>
                            <div className="searchbar-container">
                                <form>
                                    <button className='searchbar-submit' type='submit'>
                                        <img src={search} alt="" draggable='false' />
                                    </button>
                                    <input 
                                        className='searchbar' 
                                        type="text" 
                                        placeholder='Поиск'
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}/>
                                </form>
                            </div>

                            {users?.map(el => <button onClick={() => setCurrentUser(el)} key={el.id}><UserCard  info={el} /></button>)}
                            
                        </div>
                        <ChosenUser info={currentUser}/>
                    </div>
                ) : (<></>)}

                {currPage === 3 ? (
                    <div className="blog">
                        {blogsRequestsList?.map(video=>(
                            <VerticalClip clipRequestId={video.id} status={video.status} authorId={video.authorId} authorName={video.authorName}                    />
                        ))}
                    </div>
                ) : (<></>)}

                {currPage === 4 ? (
                    <div className="playlists">
                        <div draggable='false' className='playlist'>
                            <img draggable='false' className='new-playlist' alt='add new playlist' src={newPlaylist} onClick={addNewPlaylist}/>
                        </div>
                        {playlists?.map(el => (
                            <Playlist id={el.id} isPrivate={el.isPrivate}/>
                        ))}
                    </div>
                ) : (<></>)}
            </div>
        </div>
    )
}

export default AdminPanel