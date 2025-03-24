import { useEffect, useRef, useState } from 'react';
import './BlogVideoPlayer.css';
import { axiosAuthorized, axiosUnauthorized } from '../App/App';
import heart from '../../Images/controller/heart.svg';
import closeButton from '../../Images/playerforvideo/closebutton.svg'
import { useSelector, useDispatch } from 'react-redux';
import { updateFeaturedValue } from '../../Redux/slices/featuredSlice';
import redHeart from '../../Images/red-heart.svg';
import Comment from '../Comment';
import sendIcon from '../../Images/controller/sendIcon.svg';
import { useLocation, useSearchParams } from 'react-router-dom';
import { shortenText } from '../../Tools/Tools';
import { addSongToFavorite, deleteSongFromFavorite, getSongInfo, getSongLogo } from '../../Api/Song';
import { updateVertVideoInfoValue } from '../../Redux/slices/vertVideoInfoSlice';
import { getClipFile, getClipInfo } from '../../Api/Clip';
import { getAuthorInfo, getAuthorLogo } from '../../Api/Author';
import CustomButton from '../CustomButton/CustomButton';

function BlogVideoPlayer() {
    const location = useLocation();
    const videoRef = useRef();
    const placeholderVideoRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams()
    
    const resize = useSelector((state)=> state.resize.value);
    const vertVideoInfo = useSelector((state)=> state.vertVideoInfo.value);
    const [blogId, setBlogId] = useState(undefined);
    const featured = useSelector((state)=>state.featured.value)
    const dispatch = useDispatch();

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [videoLink, setVideoLink] = useState(undefined);

    useEffect(()=>{
        setBlogId(searchParams.get('short_view'));
    },[location]);

    useEffect(() => {
        if (blogId) {
            getComments();
            getClipFile(blogId, true)
                .then(response => setVideoLink(response));

            if (vertVideoInfo === undefined || vertVideoInfo === "") {
                getVertData()
                .then((res) => dispatch(updateVertVideoInfoValue(res)));
            }
        }
    }, [blogId, isDataUpdated]);

    useEffect(() => {
        if (resize === 'standart')
            handlePlayVideo();
    }, [videoLink]);

    async function handlePlayVideo() {
        // плеер видео
        if (isPlaying || !videoLink) {
            setIsPlaying(false);
            await videoRef?.current?.pause();
            await placeholderVideoRef?.current?.pause();
        }
        else if (typeof videoLink === "string" && videoLink.includes('api/short-video')) {
            videoRef.current.src = videoLink;
            await videoRef.current.play();
            placeholderVideoRef.current.src = videoLink;
            await placeholderVideoRef.current.play();
            setIsPlaying(true);
        }
        else {
            videoRef.current.src = videoLink;
            placeholderVideoRef.current.src = videoLink;

            await videoRef.current.play();
            await placeholderVideoRef.current.play();

            setIsPlaying(true);
        }
    }

    function handleClickOnAuthor() {
        setBlogId(undefined);
        window.location.replace(`/artist/${vertVideoInfo.uploaderId}`);
    }

    function handleClickOnSong() {
        setBlogId(undefined);
        window.location.replace(`/commentaries/${vertVideoInfo.relatedSongId}`);
    }

    async function handleToFavorite(id) {
        // добавление и удаление из избранных
        if (featured.includes(id)) {
            await deleteSongFromFavorite(id);
            dispatch(updateFeaturedValue(featured.filter(el => el != id)));
        }
        else {
            await addSongToFavorite(id);
            dispatch(updateFeaturedValue([...featured, id]));
        }
    };

    async function getComments() {
        await axiosUnauthorized.get('api/short-video/' + blogId + '/comment/list').then(resp =>{
            setComments(resp?.data.commentList);
        })
        .catch(err => Promise.reject(err));
    }

    const handleSendComment = () => {
        if (comment !== '') {
            axiosAuthorized.post(`api/short-video/${blogId}/comment`, {text: comment})
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

    const getVertData = async () =>{
        let result = undefined;
        result = await getClipInfo(blogId, true);

        result.songLogo =  await getSongLogo(result.relatedSongId);
        let songInfo = await getSongInfo(result.relatedSongId);
        result.songName = songInfo?.name;
        result.authorAvatar = await getAuthorLogo(result.authorId);
        let authorInfo = await getAuthorInfo(result.authorId);
        result.authorName = authorInfo?.name;

        return result;
    }

    if (resize === 'standart')
    return (
        <>
            {videoLink && blogId ?
                <div className="blog-video-wrapper">
                    <video alt='background' 
                        className='placeholder-vert-video' 
                        ref={placeholderVideoRef} 
                        src={videoLink} 
                        muted 
                        loop
                    />
                    <div className="blog-video">
                        <div className='vertical-wrapper'>
                            <video className='vertvideo-player' 
                            ref={videoRef} 
                            src={videoLink} 
                            type="video/mp4" onClick={handlePlayVideo}
                            loop/>
                        </div>

                        <div className='blog-text'>
                            <button onClick={handleClickOnAuthor} className='blog-author'>
                                <img  alt='avatar' src={vertVideoInfo.authorAvatar} />
                                <p>{shortenText(vertVideoInfo.authorName, 20)}</p>
                            </button>

                            <span>
                                <h2>{shortenText(vertVideoInfo.title, 30)}</h2>
                                <p>{shortenText(vertVideoInfo.description, 350)}</p>
                            </span>

                            {vertVideoInfo?.relatedSongId ? (
                                <div className='blog-song-wrapper'>
                                    <div className='blog-song'>
                                        <img alt='photo' src={vertVideoInfo.songLogo} onClick={handleClickOnSong}/>
                                        <span>
                                            <span onClick={handleClickOnSong}>
                                                <p className='blog-song-name'>{shortenText(vertVideoInfo.songName, 20)}</p>
                                                <p className='blog-artist-name'>{shortenText(vertVideoInfo.authorName, 25)}</p>
                                            </span>
                                            <button onClick={() => handleToFavorite(vertVideoInfo.relatedSongId)}>
                                                <img className='blog-fav-icon' alt='to_favourites' src={featured.includes(vertVideoInfo.relatedSongId) ? redHeart : heart} />
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            ) : (<></>)}

                            <div className='blog-comments'>
                                <div className='comment-input-wrapper' style={{marginBottom: '24px'}}>
                                    <textarea placeholder='Введите текст комментария здесь...' className='comment-input' 
                                        onChange={(e) => setComment(shortenText(e.target.value, 350))} value={shortenText(comment, 350)} maxLength={349}></textarea>
                                    <div style={{height: '48px'}}>
                                        <CustomButton icon={sendIcon} errorText='' func={handleSendComment} reusable={true} />
                                    </div>
                                    {/* <button className='comment-btn-offset' style={{right: '68px'}} onClick={handleSendComment}><img src={sendIcon}/></button> */}
                                </div>
                                {comments?.map(e => (<div key={e.id} className='comment-wrapper'><Comment data={e} songId={vertVideoInfo.relatedSongId} setIsDataUpdated={setIsDataUpdated} isDataUpdated={isDataUpdated} isMobile={true}/></div>))}
                            </div>
                            
                        </div>
                        <button onClick={() =>{
                            setSearchParams({});
                            setBlogId(undefined);
                        }} className='blog-close'>
                            <img alt='x' src={closeButton}/>
                        </button>
                    </div>
                </div>
                : <></>
            }
        </>
    )
    else {
        return (
            <>
            {videoLink && blogId  ?
                <div className='video-player-wrapper'>
                    <button className='player-exit-button' onClick={() => {
                        setBlogId(undefined);
                        }}><img src={closeButton}/></button>
                    <video className='vertvideo-player' src={videoLink} autoPlay={true} type="video/mp4" loop/>
                </div>
                : <></>
            }
            </>
        )
    }
}


export default BlogVideoPlayer;