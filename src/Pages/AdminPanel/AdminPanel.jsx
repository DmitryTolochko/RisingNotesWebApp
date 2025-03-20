import React, { useEffect, useState } from 'react';
import BackButton from '../../Components/BackButton';
import RequestSong from './RequestSong';
import { api, axiosAuthorized } from '../../Components/App/App';
import searchIcon from '../../Images/sidebar/Vector.svg';

import './AdminPanel.css';
import UserCard from '../../Components/UserCard/UserCard';
import ChosenUser from '../../Components/ChosenUser/ChosenUser';
import Loader from '../../Components/Loader/Loader';
import { getClipRequestInfo, getClipRequestsListForReview } from '../../Api/ClipPublish';
import { getSongRequestInfo, getSongRequestsListForReview } from '../../Api/SongPublish';
import Clip from '../../Components/Clip/Clip';

function AdminPanel() {
    const [songRequestsList, setSongRequestsList] = useState([]);
    const [clipRequestsList, setClipRequestsList] = useState([]);
    const [currPage, setCurrPage] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [search, setSearch] = useState(searchIcon);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        if (currPage === 0)
            getSongRequestsList();
        else if (currPage === 1)
            getClipRequestsList();
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

    // if (isLoaded)
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
                        <a onClick={() => handleChangePage(2)} 
                            className={currPage === 2 ? 'account-page-menu-item account-page-active' : 'account-page-menu-item'}>
                            Пользователи
                        </a>
                </div>

                {currPage === 0 ? (
                    <div className=''>
                        {songRequestsList.map(el => <RequestSong info={el} key={el.id}/>)}
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
            </div>
        </div>
    )
}

export default AdminPanel