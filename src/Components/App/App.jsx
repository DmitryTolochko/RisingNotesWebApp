import './App.css';
import Header from "../Header/Header";
import Login from "../Login/Login"
import Registration from "../Registration/Registration";
import Sidebar from "../Sidebar/Sidebar";
import Player from "../Player/Player";

import ArtistCard from '../../Pages/ArtistCard/ArtistCard.jsx'
import { Routes, Route, useNavigate, useSearchParams} from 'react-router-dom';
import React from "react";
import Featured from '../../Pages/Featured/Featured';
// import Excluded from '../../Pages/Excluded/Excluded';
import Subscriptions from '../../Pages/Subsriptions/Subscriptions';
import Commentaries from '../../Pages/Commentaries/Commentaries';
import AdminPanel from '../../Pages/AdminPanel/AdminPanel';
import MusicPlayer from '../MusicPlayer/MusicPlayer';
import PlaylistWindow from '../../Pages/PlaylistWindow/PlaylistWindow';
import SearchResults from '../SearchResults/SearchResults';
import UploadMusic from '../../Pages/UploadMusic/UploadMusic.jsx';
import UploadVideo from '../../Pages/UploadVideo/UploadVideo.jsx';
import InstallVerticalVideo from '../../Pages/UploadVerticalVideo/UploadVertVideo.jsx';
import ErrorPage from '../../Pages/404Page/404Page';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';
import AccountPage from '../../Pages/AccountPage/AccountPage';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';
import Footer from '../Footer/Footer.jsx';
import VideoPlayer from '../VideoPLayer/VideoPlayer.jsx';
import VertVideoPlayer from '../BlogVideoPlayer/BlogVideoPlayer.jsx';

import { useSelector, useDispatch } from 'react-redux';
import { updateResizeValue } from '../../Redux/slices/resizeSlice.js';
import Messenger from '../../Pages/Messenger/Messenger.jsx';

import { useLocation } from 'react-router-dom';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice.js';
import { updateVertVideoPlayerValue } from '../../Redux/slices/vertVideoPlayerSlice.js';
import { showError } from '../../Redux/slices/errorMessageSlice.js';
import PlayerQueue from '../../Pages/PlayerQueue/PlayerQueue.jsx';
import ClipPage from '../../Pages/ClipPage/ClipPage.jsx';

export const api = 'http://81.31.247.227/';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'rn-api-storage.s3.yandexcloud.net';

export const axiosAuthorized = axios.create({
    baseURL: api,
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosUnauthorized = axios.create({
    baseURL: api,
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosRefresh = axios.create({
    baseURL: api,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
});

export const axiosPictures = axios.create({
    baseURL: api,
    headers: {
        "Content-Type": "application/json",
    },
});

// ссылка на переменную

function App() {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    //Redux Dispatcher
    const dispatch = useDispatch()

    //Redux data slices 
    const resize_ = useSelector((state) => state.resize.value)
    const playlists_ = useSelector((state) => state.playlists.value)
    const excluded_ = useSelector((state) => state.excluded.value)
    const featured_ = useSelector((state) => state.featured.value)
    const subscriptions_ = useSelector((state) => state.subscriptions.value)
    const currentSong_ = useSelector((state) => state.currentSong.value)
    const songs_ = useSelector((state) => state.songs.value)
    const playerQueueName_ = useSelector((state) =>  state.playerQueue.currentQueue)
    
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);

    useEffect(() => {
        // изменение со стандартной на мобильную версию
        function handleResize() {
            if (window.innerWidth <= 720) {
                dispatch(updateResizeValue('mobile'))
            }
            else {
                dispatch(updateResizeValue('standart'))
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    useEffect(()=>{
        const short = searchParams.get('short_view')

        if(short){
            dispatch(
                updateVertVideoPlayerValue(short)
            )
        }
    },[location])

    function invokeErrorMessage(error) {
        if (error.response === undefined) {
            dispatch(showError({errorText: 'Нет сети'}))
        }
        else if (error.response?.status === 404) {
            dispatch(showError({errorText: 'Указанного объекта не существует'}))
        }
        else if (error.response?.status === 413) {
            dispatch(showError({errorText: 'Слишком большой файл'}))
            return Promise.reject(error.response);
        }
        else if (error.response?.status === 500) {
            dispatch(showError({errorText: 'Ошибка 500 на сервере'}))
            return Promise.reject(error.response);
        }
        else if (error.response?.status === 401) {
            dispatch(showError({errorText: 'Вы не авторизированы'}))
            window.location.replace('/login');
            return Promise.reject(error.response);
        }
        else if (error.response?.status === 400) {
            dispatch(showError({errorText: error.message}))
            return Promise.reject(error.response);
        }
        else {
            dispatch(showError({errorText: error.message}))
            return Promise.reject(error);
        }
    }

    let isRefreshing = false;
    let token = undefined;

    //обновление токена
    async function refreshTokens(config) {
        while (isRefreshing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (token !== undefined) {
            return token;
        }

        isRefreshing = true;

        try {
            let response = await axiosRefresh.post('connect/token', {
                client_id: 'Api',
                client_secret: 'megaclientsecret',
                grant_type: 'refresh_token',
                refresh_token: cookies.refreshToken
            })

            setCookies('accessToken', response.data.access_token, { path: '/' });
            setCookies('refreshToken', response.data.refresh_token, { path: '/' });

            let decoded = jwtDecode(response.data.access_token);
            setCookies('authorId', decoded?.authorId, { path: '/' });

            const userId = jwtDecode(response.data.access_token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            setCookies('userId', userId, { path: '/' });
            setCookies('role', decoded.role, { path: '/' });

            token = 'Bearer ' + response.data.access_token;
            return 'Bearer ' + response.data.access_token;                
        } catch (err) {
            // Очищаем куки и перенаправляем на страницу логина
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'authorId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            navigate("/login");
        } finally {
            isRefreshing = false;
        }
    }

    //Вставка токена в запрос и его проверка
    axiosAuthorized.interceptors.request.use(
        async config => {
            const accessToken = cookies.accessToken;
            const refreshToken = cookies.refreshToken;
            if (accessToken) {
                let decoded = jwtDecode(accessToken);
                setCookies('userId', decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"], { path: '/' });
                setCookies('role', decoded.role, { path: '/' });
                setCookies('authorId', decoded?.authorId, { path: '/' });
                if (decoded.exp > new Date().getTime() / 1000)
                    config.headers['Authorization'] = 'Bearer ' + accessToken;
                else {
                    config.headers['Authorization'] = await refreshTokens(config);
                }
            }
            else if (refreshToken) {
                config.headers['Authorization'] = await refreshTokens(config);
            }
            else {
                navigate("/login");
            }
            return config;
        },
        error => {
            // Promise.reject(error);
            console.log(error);
        }
    );

    axiosAuthorized.interceptors.response.use(
        config => {
            return config;
        },
        error => {
            return invokeErrorMessage(error);
        }
    );

    axiosUnauthorized.interceptors.response.use(
        config => {
            return config;
        },
        error => {
            return invokeErrorMessage(error);
        }
    )

    useEffect(() => {
        // обновление переменных в браузере, только тогда когда чет поменялось
        localStorage.setItem('SONGS', JSON.stringify(songs_));
        localStorage.setItem('CURR_SONG', JSON.stringify(currentSong_));
        localStorage.setItem('SUBS', JSON.stringify(subscriptions_));
        localStorage.setItem('FEATURED', JSON.stringify(featured_));
        localStorage.setItem('EXCLUDED', JSON.stringify(excluded_));
        localStorage.setItem('PLAYLISTS', JSON.stringify(playlists_));
        localStorage.setItem('RESIZE', JSON.stringify(resize_));
        localStorage.setItem('CURR_QUEUE', JSON.stringify(playerQueueName_));
    }, [songs_, currentSong_, subscriptions_, featured_, excluded_, playlists_, resize_, playerQueueName_]);

    return (
        <div className="App">
            <Header/>
            {cookies.role === 'admin' ? <></> : <Sidebar></Sidebar>}
            <SearchResults/>
            <ErrorMessage/>
            <Players/>
            <PlayerQueue/>
            <Routes>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/registration'} element={<Registration/>}/>
                <Route path={'/artist/:id'} element={<ArtistCard/>}/>
                <Route path={'/commentaries/:id'} element={<Commentaries/>}/>
                <Route path={'/playlist/:id'} element={<PlaylistWindow/>}/>
                <Route path={'/uploadmusic/:id'} element={<UploadMusic/>}/>
                <Route path={'/clipview'} element={<ClipPage/>}/>
                <Route path={'*'} element={<ErrorPage/>}/>
                {cookies.role === 'admin' ? (<>
                    <Route path={'/'} element={<AdminPanel/>}/>
                </>) : (
                <>
                    <Route path={'/'} element={<Player/>}/>
                    <Route path={'/featured'} element={<Featured/>}/>
                    <Route path={'/account'} element={<AccountPage/>}/>
                    <Route path={'/uploadmusic'} element={<UploadMusic/>}/>
                    <Route path={'/uploadvideo'} element={<UploadVideo/>}/>
                    <Route path={'/uploadvertvideo'} element={<InstallVerticalVideo/>}/>
                    <Route path={'/messenger'} element={<Messenger/>}/>
                </>
                )}
            </Routes>  
            <Footer/>
        </div>
    );
}

const Players = () => {
    return(
        <>
            <VertVideoPlayer />
            <MusicPlayer/>
            <VideoPlayer />
        </>
    )
}

export default App;