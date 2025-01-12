import { useEffect, useRef, useState } from 'react';
import './BlogVideoPlayer.css';
import { api, axiosAuthorized, axiosUnauthorized } from '../App/App';
import heart from '../../Images/controller/heart.svg';
import closeButton from '../../Images/playerforvideo/closebutton.svg'
import { useSelector, useDispatch } from 'react-redux';
import { updateVertVideoPlayerValue } from '../../Redux/slices/vertVideoPlayerSlice';
import { updateFeaturedValue } from '../../Redux/slices/featuredSlice';
import redHeart from '../../Images/red-heart.svg';
import Comment from '../Comment';
import sendIcon from '../../Images/controller/sendIcon.svg';
import CustomButton from '../CustomButton/CustomButton';
import { useSearchParams } from 'react-router-dom';
import { shortenText } from '../ArtistCardComponents/ArtistInfo/ArtistInfo';

function VertVideoPlayer() {
    const videoRef = useRef();
    const placeholderVideoRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams()
    
    const resize = useSelector((state)=> state.resize.value)
    const vertVideoInfo = useSelector((state)=> state.vertVideoInfo.value)
    const vertvideo = useSelector((state) => state.vertVideoPlayer.value)
    const featured = useSelector((state)=>state.featured.value)
    const dispatch = useDispatch();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (vertvideo !== '' && vertvideo !== undefined)
            getComments();
        if (resize === 'standart')
            handlePlayVideo();
    }, [vertvideo, isDataUpdated]);

    async function handlePlayVideo() {
        // плеер видео
        if (isPlaying || !vertvideo) {
            setIsPlaying(false);
            await videoRef?.current?.pause();
            await placeholderVideoRef?.current?.pause();
        }
        else if (typeof vertvideo === "string" && vertvideo.includes('api/short-video')) {
            videoRef.current.src = vertvideo;
            await videoRef.current.play();
            placeholderVideoRef.current.src = vertvideo;
            await placeholderVideoRef.current.play();
            setIsPlaying(true);
        }
        else {
            videoRef.current.src = vertvideo;
            placeholderVideoRef.current.src = vertvideo;

            await videoRef.current.play();
            await placeholderVideoRef.current.play();
            
            // try {
            //     await videoRef.current.play();
            //     await placeholderVideoRef.current.play();
            // } 
            // catch (err) {
            //     console.log(err)
            // }

            setIsPlaying(true);
        }
    }

    function handleClickOnAuthor() {
        dispatch(updateVertVideoPlayerValue(false));
        window.location.replace(`/artist/${vertVideoInfo.uploaderId}`);
    }

    function handleClickOnSong() {
        dispatch(updateVertVideoPlayerValue(false));
        window.location.replace(`/commentaries/${vertVideoInfo.relatedSongId}`);
    }

    async function handleToFavorite(id) {
        // добавление и удаление из избранных
        if (featured.includes(id)) {
            await axiosAuthorized.delete(api + `api/song/favorite/${id}`).then(resp => {
                dispatch(updateFeaturedValue(featured.filter(el => el != id)))
            });
        }
        else {
            await axiosAuthorized.patch(api + `api/song/favorite/${id}`).then(resp => {
                dispatch(updateFeaturedValue([...featured, id]))
            });
        }
    };

    async function getComments() {
        await axiosUnauthorized.get('api/short-video/' + vertVideoInfo.id + '/comment/list').then(resp =>{
            setComments(resp?.data.commentList);
        })
        .catch(err => Promise.reject(err));
    }

    const handleSendComment = () => {
        if (comment !== '') {
            axiosAuthorized.post(`api/short-video/${vertVideoInfo.id}/comment`, {text: comment})
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
    };


    if (resize === 'standart')
    return (
        <>
            {vertvideo ?
                <div className="blog-video-wrapper">
                    <video alt='background' 
                        className='placeholder-vert-video' 
                        ref={placeholderVideoRef} 
                        src={vertvideo} 
                        muted 
                        loop
                    />
                    <div className="blog-video">
                        <div className='vertical-wrapper'>
                            <video className='vertvideo-player' 
                            ref={videoRef} 
                            src={vertvideo} 
                            type="video/mp4" onClick={handlePlayVideo}
                            loop/>
                        </div>

                        <div className='blog-text'>
                            <button onClick={() =>{
                                setSearchParams({})
                                dispatch(updateVertVideoPlayerValue(false))
                            }} className='blog-close'>
                                <img alt='x' src={closeButton}/>
                            </button>
                            <button onClick={handleClickOnAuthor} className='blog-author'>
                                <img  alt='avatar' src={vertVideoInfo.authorAvatar} />
                                <p>{shortenText(vertVideoInfo.authorName, 20)}</p>
                            </button>

                            <p>{shortenText(vertVideoInfo.description, 350)}</p>

                            <div className='blog-song'>
                                <img alt='photo' src={vertVideoInfo.songLogo} onClick={handleClickOnSong}/>
                                <span>
                                    <span onClick={handleClickOnSong}>
                                        <p className='blog-song-name'>{shortenText(vertVideoInfo.title, 20)}</p>
                                        <p className='blog-artist-name'>{shortenText(vertVideoInfo.authorName, 25)}</p>
                                    </span>
                                    <button onClick={() => handleToFavorite(vertVideoInfo.relatedSongId)}>
                                        <img className='blog-fav-icon' alt='to_favourites' src={featured.includes(vertVideoInfo.relatedSongId) ? redHeart : heart} />
                                    </button>
                                </span>
                            </div>

                            <div className='comment-input-wrapper'>
                                <textarea placeholder='Введите текст комментария здесь...' className='comment-input' 
                                    onChange={(e) => setComment(shortenText(e.target.value, 350))} value={shortenText(comment, 350)} maxLength={349}></textarea>
                                <button className='comment-btn-offset' style={{right: '68px'}} onClick={handleSendComment}><img src={sendIcon}/></button>
                            </div>

                            <div className='blog-comments'>
                                {comments?.map(e => (<div key={e.id} className='comment-wrapper'><Comment data={e} songId={vertVideoInfo.relatedSongId} setIsDataUpdated={setIsDataUpdated} isDataUpdated={isDataUpdated}/></div>))}
                            </div>
                            
                        </div>

                    </div>
                </div>
                : <></>
            }
        </>
    )
    else {
        return (
            <>
            { vertvideo ?
                <div className='video-player-wrapper'>
                    <button className='player-exit-button' onClick={() => {
                        dispatch(updateVertVideoPlayerValue(false))
                        }}><img src={closeButton}/></button>
                    <video className='vertvideo-player' src={vertvideo} autoPlay={false} type="video/mp4" loop/>
                </div>
                : <></>
            }
            </>
        )
    }
}


export default VertVideoPlayer;