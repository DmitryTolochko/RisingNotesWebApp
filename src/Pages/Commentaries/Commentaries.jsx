import BackButton from '../../Components/BackButton';
import Comment from '../../Components/Comment';
import { api, axiosPictures } from '../../Components/App/App';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { axiosAuthorized, axiosUnauthorized } from '../../Components/App/App';
import commentsIcon from '../../Images/controller/message.svg';
import sendIcon from '../../Images/controller/sendIcon.svg';
import burgerIcon from '../../Images/controller/menu.svg';
import playIcon from '../../Images/player/PlayBtn.svg';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import placeholder from '../../Images/main-placeholder.png';
import heartIcon from '../../Images/controller/heart.svg';
import redHeart from '../../Images/red-heart.svg';
import playFilledIcon from '../../Images/play.svg';
import pauseIcon from '../../Images/Pause.svg';
import listIcon from '../../Images/player/plus.svg';
import { useDispatch, useSelector } from 'react-redux';

import './Commentaries.css';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';
import { updateCurrentSongValue } from '../../Redux/slices/currentSongSlice';
import { updateMusicIsPlayingValue } from '../../Redux/slices/musicIsPlayingSlice';
import { updateFeaturedValue } from '../../Redux/slices/featuredSlice';
import PlaylistModalMenu from '../../Components/PlaylistModalMenu/PlaylistModalMenu';
import { shortenText } from '../../Components/ArtistCardComponents/ArtistInfo/ArtistInfo';

const Commentaries = ({clip}) => {
    const params = useParams();
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [songName, setSongName] = useState('');
    const [songAuthor, setSongAuthor] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [genres, setGenres] = useState([]);
    const [clipId, setClipId] = useState(clip ? clip : undefined);

    const [currPage, setCurrPage] = useState(0);
    const [songText, setText] = useState('');
    const resize = useSelector((state)=> state.resize.value);
    const dispatch = useDispatch();
    const [artistAvatar, setArtistAvatar] = useState(defaultAvatar);
    const [songLogo, setSongLogo] = useState(placeholder);
    const [playButtonIcon, setPlayButtonIcon] = useState(playFilledIcon);
    const featured = useSelector((state)=>state.featured.value);
    const currentSong = useSelector((state)=> state.currentSong.value);
    const isPlaying = useSelector((state) => state.musicIsPlaying.value);
    const [modalIsHidden, setModalIsHidden] = useState(true);

    useEffect(() => {
        // отображение кнопки игры и паузы трека
        if (!isPlaying || currentSong !== params.id ) {
            setPlayButtonIcon(playFilledIcon);
        } else {
            setPlayButtonIcon(pauseIcon);
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        getAllInfo();
    }, [isDataUpdated, params.id]);

    async function getAllInfo () {
        // получить всю информацию
        let authorId = undefined;

        if(clip){
            await axiosUnauthorized.get(`/api/music-clip/${clipId}/comment/list`)
                .then(response => {
                    let arr = response.data.commentList;
                    arr.reverse();
                    setComments(arr);
                })
                .catch(err=>{
                    console.log(err);
                });
        }
        else{
            await axiosUnauthorized.get(`api/song/${params.id}/comment/list`)
                .then(response => {
                    let arr = response.data.commentList;
                    arr.reverse();
                    setComments(arr);
                })
                .catch(err=>{
                    console.log(err);
                });
            
            await axiosUnauthorized.get(`api/song/${params.id}`)
                .then(response => {
                    setSongName(response.data.name);
                    setGenres(response.data.genreList);
                    setSongAuthor(response.data.authorName);
                    setText(response.data?.lyrics !== 'undefined' && response.data.lyrics ? response.data.lyrics : 'Мы не знаем текст этой песни :(');
                    authorId = response.data.authorId;
                    setAuthorId(authorId);
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });

            await axiosPictures.get('api/author/' + authorId + '/logo/link')
                .then(response => {
                    setArtistAvatar(response?.data?.presignedLink)
                })
                .catch(err => {
                    setArtistAvatar(defaultAvatar);
                });

            await axiosPictures.get(api + 'api/music-clip/by-song/' + params.id)
                .then(response => {
                    setClipId(response?.data.clipId);
                })
                .catch(err => {
                    setClipId(undefined);
                })

            setSongLogo(await axiosPictures.get(api + `api/song/${params.id}/logo/link`)
            .then(resp => {return resp?.data?.presignedLink})
            .catch(err => {return placeholder}));
        }
    }

    const handleSendComment = () => {
        // отправить комментарий
        
        if(clip){
            if (comment !== '') {
                axiosAuthorized.post(`/api/music-clip/${clipId}/comment`, {text: comment})
                .then(response => {
                    setIsDataUpdated(!isDataUpdated);
                    setComment('');
                })
                .catch(err => {
                    console.log(err);
                })
            }
            else {
                return Promise.reject(Error);
            }
        }
        else{
            if (comment !== '') {
                axiosAuthorized.post(`api/song/${params.id}/comment`, {text: comment})
                .then(response => {
                    setIsDataUpdated(!isDataUpdated);
                    setComment('');
                })
                .catch(err => {
                    console.log(err);
                })
            }
            else {
                return Promise.reject(Error);
            }
        }
    };

    const handleChangePage = (id) => {
        // смена страницы в лк
        setCurrPage(id);
    };

    const bgLoaded = () =>{
        const img = document.querySelector('.player-bg-image')
        img.classList.add('bg-loaded')
    }

    function handlePlaySong() {
        // включить или выключить песню
        if (currentSong !== params.id || !isPlaying) {
            dispatch(updateCurrentSongValue(params.id));
            dispatch(updateMusicIsPlayingValue(true));
        } else if (isPlaying) {
            dispatch(updateMusicIsPlayingValue(false));
        }
    };

    async function handleToFavorite() {
        // добавление и удаление из избранных
        if (featured.includes(params.id)) {
            await axiosAuthorized.delete(api + `api/song/favorite/${params.id}`).then(resp => {
                dispatch(updateFeaturedValue(featured.filter(el => el != params.id)))
            });
        }
        else {
            await axiosAuthorized.patch(api + `api/song/favorite/${params.id}`).then(resp => {
                dispatch(updateFeaturedValue([...featured, params.id]))
            });
        }
    };

    async function changeModalState () {
        setModalIsHidden(modalIsHidden => modalIsHidden = !modalIsHidden);
    }

    return (
        <div className='comment-page-wrapper'>
            <div className='comment-page'>
                {!clip &&
                <>
                    <BackButton/>
                    <div className='comm-head'>
                        <div className='comm-img-hover'>
                            <a onClick={handleToFavorite}><img draggable='false' src={featured.includes(currentSong) ? redHeart : heartIcon}/></a>
                            <a onClick={handlePlaySong}><img src={playButtonIcon} draggable='false'/></a>
                            <a onClick={changeModalState}><img src={listIcon} draggable='false'/></a>
                            {!modalIsHidden ? (<PlaylistModalMenu songAuthor={songAuthor} songName={songName} id={params.id}/>) : (<></>)}
                        </div>
                        <img alt='cover' src={songLogo} draggable='false'/>
                        <span className='comm-page-text'>
                            <h2 className='comm-page-h2'>{shortenText(songName, 25)}</h2>
                            <Link to={`/artist/${authorId}`} className='comm-page-author'><img src={artistAvatar} alt='avatar'/>{shortenText(songAuthor, 25)}</Link>
                            <div className='comm-head-buttons'>
                                {genres.map(el => <span key={el} className='song-tag'>{el}</span>)}
                            </div>
                            {clipId && resize === 'mobile' ? (
                                <CustomButton text={'Смотреть клип'} icon={playIcon} func={() => dispatch(updateVideoPlayerValue(api + `api/music-clip/${clipId}/file`))} success={'Смотреть клип'}/>
                            ) : 
                            (<></>)}
                        </span>
                        {clipId && resize === 'standart' ? (
                            <div className='comm-head-button'>
                                <CustomButton text={'Смотреть клип'} icon={playIcon} func={() => dispatch(updateVideoPlayerValue(api + `api/music-clip/${clipId}/file`))} success={'Смотреть клип'}/>
                            </div>
                        ) : 
                        (<></>)}
                        
                    </div>

                    <div className="artist-card-menu">
                        <a onClick={() => handleChangePage(0)} 
                            className={currPage === 0 ? 'artist-card-menu-item account-page-active' : 'artist-card-menu-item'}>
                            <img src={commentsIcon}/>
                            Обсуждение
                        </a>
                        <a onClick={() => handleChangePage(1)} 
                            className={currPage === 1 ? 'artist-card-menu-item account-page-active' : 'artist-card-menu-item'}>
                            <img src={burgerIcon}/>
                            Текст
                        </a>
                    </div>
                </>
                }

                {clip && <span className='clip-comment-title'>Комментарии</span>}
                

                {currPage === 0 ? (
                    <>
                        <div className='comment-input-wrapper' style={{marginTop: clip? 24 : 0}}>
                            <textarea placeholder='Введите текст комментария здесь...' className='comment-input' 
                                onChange={(e) => setComment(shortenText(e.target.value, 550))} value={shortenText(comment, 550)} maxLength={549}></textarea>
                                {resize === 'mobile' ? <button className='comment-btn-offset' onClick={handleSendComment}><img src={sendIcon}/></button> : <></>}
                                {resize === 'standart' ? <CustomButton text={'Отправить'} func={handleSendComment} icon={sendIcon} errorText='Ошибка' success={'Отправить'}/> : <></>}
                        </div>
                        <div className='song-comments'>
                            {comments.map(e => (<div key={e.id} className='comment-wrapper'>
                                <Comment data={e} clipId={clipId} songId={params.id} setIsDataUpdated={setIsDataUpdated} isDataUpdated={isDataUpdated}/>
                            </div>))}
                        </div>
                    </>
                ) : 
                (<></>)}
                
                {currPage === 1 ? (<text className='song-text' style={{whiteSpace: "pre-line"}}>{songText}</text>
                ) :
                (<></>)}
                
            </div>
            <img className="player-bg-image" onLoad={bgLoaded} src={songLogo} alt="" />
        </div>
    );
}

export default Commentaries;