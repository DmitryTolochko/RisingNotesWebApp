import React from 'react';
import BackButton from '../../Components/BackButton';
import VideoPrewiew from '../../Images/installvideo/vertvideo.svg';
import { useState, useEffect, useRef } from 'react'
import bigEdit from '../../Images/account-page/edit-big.svg';
import closeImg from '../../Images/x.svg';
import uploadImg from '../../Images/upload.svg';
import playImg from '../../Images/play.svg';
import pauseImg from '../../Images/Pause.svg';
import trashIcon from '../../Images/trash.svg';

import './UploadVertVideo.css';
import CustomButton from '../../Components/CustomButton/CustomButton';
import InputSongs from '../UploadVideo/InputSongs';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { updateVertVideoInfoValue } from '../../Redux/slices/vertVideoInfoSlice';
import { updateVertVideoPlayerValue } from '../../Redux/slices/vertVideoPlayerSlice';
import CustomInput from '../../Components/CustomInput/CustomInput';
import { showError } from '../../Redux/slices/errorMessageSlice';
import { getSongInfo } from '../../Api/Song';
import { changeClipRequestStatus, createNewClipRequest, deleteClipRequest, getClipRequestInfo, startUploadClip, submitClipRequestForReview, uploadClipFilePart, uploadClipLogo } from '../../Api/ClipPublish';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';

function UploadVerticalVideo(){
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const vertskinSetterRef = useRef(null);
    const [imageFile, setImageFile] = useState(undefined);
    const [image, setImage] = useState(VideoPrewiew);
    const [videoFile, setVideofile] = useState(undefined);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoFileName, setVideoFileName] = useState(null);
    const videoSetterRef = useRef(null);
    const [description, setDescription] = useState(undefined);
    const [songId, setSongId] = useState(undefined);
    const [title, setTitle] = useState(undefined);
    const [comment, setComment] = useState('');
    const [songName, setSongName] = useState(undefined);
    const [authorName, setAuthorName] = useState('Автор не указан');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const resize = useSelector((state)=> state.resize.value);

    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'subscriptions', 'userId']);

    useEffect(() => {
        getAllInfo();
        if (!isSent)
            setIsButtonDisabled(checkInputs());
    }, [imageFile, videoFile, description]);

    function checkInputs() {
        let arr = [imageFile, videoFile, description];
        let flag = false;
        arr.forEach((input) => {
            if (input == undefined || input == '' || (input == [] && input.length == 0)) {
                console.log(input == undefined);
                flag = true;
            }
        })
        return flag;
    }

    useEffect(() => {
        if (!(songId === undefined || songId === '' || songId === null)) {
            getSongInfo(songId)
            .then(songInfo => {
                setAuthorName(songInfo.authorName);
                setSongName(songInfo.name);
            });
        }
    }, [songId]);

    const handleVertSkinInput = () => {
        vertskinSetterRef.current.click();
    }

    const changeSkin = (event) => {
        // смена обложки
        event.preventDefault();
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size <=5*1024*1024) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
            else {
                dispatch(showError({errorText: 'Изображение должно быть не больше 5 Мб'}))
            }
        }
    }

    function handleChoosenSong(id, title) {
        setSongId(id);
    }

    async function uploadVideo() {
        // загрузка видео

        setIsButtonDisabled(true);
        setIsSent(true);

        let clipRequestId = undefined;
        let uploadId = undefined;
        let fileExtension = '.' + videoFile.type.split('/')[1];

        setIsButtonDisabled(true);
        setIsSent(true);

        clipRequestId = await createNewClipRequest(title, description, songId, true);
        try {
            await uploadClipLogo(imageFile, clipRequestId, true);    
            uploadId = await startUploadClip(clipRequestId, fileExtension, true);
    
            if (videoFile.size <= 50 * 1024 * 1024) {
                // загрузка видео размером не больше 50 мб.
                await uploadClipFilePart(videoFile, 1, true, uploadId, clipRequestId, true);
            }
            else {
                // загрузка видео по частям
                let totalSize = videoFile.size;
                let currentPart = 0;
                const chunkSize = 6 * 1024 * 1024;
                const totalParts = Math.ceil(totalSize/chunkSize);
    
                for (let start = 0; start < totalSize; start+=chunkSize) {
                    currentPart += 1;
                    const chunk = videoFile.slice(start, start + chunkSize);
                    await uploadClipFilePart(chunk, currentPart, currentPart === totalParts, uploadId, clipRequestId, true);
                }
            }
            await submitClipRequestForReview(title, description, clipRequestId, true);
        } catch {
            await deleteClipRequest(clipRequestId, true);
        }
    }

    function handlePlayVideo() {
        // плеер видео
        dispatch(updateVideoPlayerValue(videoFile));
    }

    const changeVideo = (event) => {
        // смена клипа
        event.preventDefault();
        if (event.target.files.length > 0) {
            setVideoFileName(event.target.files[0].name);
            setVideofile(event.target.files[0]);
        }
    }

    const { getRootProps: getInputFile } = useDropzone({
        // обработка файла закинутого drag & drop
        accept: {
            "video/mp4": [".mp4", ".avi"],
            "video/x-msvideo": [".mkv"],
            "video/mpeg": [".mov"]
        },
        maxSize: 200000000,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setVideoFileName(acceptedFiles[0].name);
                setVideofile(acceptedFiles[0]);
            }
        },
    });   

    const handleVideoInput = (e) => {
        videoSetterRef.current.click();
    }

    async function getAllInfo() {
        if (params?.id) {
            let info = await getClipRequestInfo(params?.id, true);
            setTitle(info.title);
            setDescription(info.description);
            setSongId(info.songId);
            setVideoFileName(info.title);
            setImage(info.logoFileLink);
            setVideofile(info.shortVideoFileLink);
            if (info.reviewerComment !== null)
                setComment(info.reviewerComment);
        }
    }

    const acceptClip = async () => {
        // Одобрение заявки
        await changeClipRequestStatus(3, comment, params.id, true);
        navigate(-1);        
    }
    
    const declineClip = async () => {
        // Отклонение заявки
        await changeClipRequestStatus(4, comment, params.id, true);
        navigate(-1);
    }

    const deleteClip = async () => {
        // Удаление песни
        if (cookies.role === 'admin' ) {
            await changeClipRequestStatus(5, comment, params.id, true);
        }
        else if (cookies.role === 'author') {
            await deleteClipRequest(params?.id, true);
        }
        navigate(-1);
    }

    return (
        <section className='comment-page-wrapper'>
            <div className='featured'>
                <BackButton/>
                <div className='video-information-1'>
                    <div className='videovert-skin-wrapper' onClick={handleVertSkinInput}>
                        <div className='videovert-skin-change'><img draggable='false' src={bigEdit}/></div>
                        <img draggable='false' className='vertvideo-prewiew' alt='video prewiew' src={image}/> 
                    </div>
                    <span className='song-info'>
                        <h1 className='newtrack-h1'>Новое видео в блог</h1>
                        {videoFile ? <button className='close-button' onClick={() => setVideofile(undefined)}><img src={closeImg}/></button> : <></>}
                        <div className={videoFile ? 'uploadtrack-div red-border' : 'uploadtrack-div'}>
                            {videoFile ? (
                                <div className='div-track'>
                                <button className='play-button' onClick={handlePlayVideo}><img src={isPlaying ? pauseImg : playImg}/></button>
                                {videoFileName && <p className='name-new-song'>{`${videoFileName}`}</p>}
                            </div>
                            ) : (<></>)}

                            {!videoFile && resize === 'standart' ? (
                                <div className='div-track' {...getInputFile()}> 
                                    <div className='uploadtrack-div-inf'>
                                        <p className='uploadtrack-p1'>Перетащите свое видео сюда</p>
                                        <p className='uploadtrack-p2'>.mp4 или .mkv, макс. 200МБ</p>
                                    </div>
                                    <p className='or'>или</p>
                                    <CustomButton text={'Выберите файл'} func={handleVideoInput} success={'Изменить'} icon={uploadImg}/>
                                </div>
                            ) : (<></>)}

                            {!videoFile && resize === 'mobile' ? (
                                <div className='div-track' onClick={handleVideoInput}> 
                                    <CustomButton text={'Выберите файл'} success={'Изменить'} icon={uploadImg}/>
                                </div>
                            ) : (<></>)}
                        </div>
                    </span>
                </div>
                <div className='video-information-2'>
                    <div className='column1-2'>
                        <CustomInput
                            heading={'Название'}
                            placeholder={'Назовите свое видео...'} 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            isRequired={true}
                            maxLength={50}
                            />
                    </div>
                    <div className='column1-2'>
                        <InputSongs 
                            heading={'Cвязанный трек'}
                            placeholder={"Выберите связанный трек..."} 
                            setSong={handleChoosenSong}
                            defaultSong={songName}
                            />
                    </div> 
                    <div className='column1-2'>
                        <CustomInput
                            heading={'Описание'}
                            placeholder={'Введите описание...'} 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            isTextArea={true}
                            isRequired={true}
                            maxLength={300}
                            />
                    </div>
                </div>
                <div className='video-information-3' >
                    {cookies.role === 'author' && !params?.id ? <div>
                        <div className='button-and-text'>
                            <CustomButton 
                                text={'Опубликовать*'} 
                                func={() => uploadVideo()} 
                                success={'Отправлено на модерацию'} 
                                icon={uploadImg}
                                disabled={isButtonDisabled}/>
                        </div>
                        <text className='warning-upload'>*перед публикацией трек будет отправлен на модерацию</text>
                    </div> : ''}

                    {cookies.role === 'admin' ? <div>
                        <div className='button-and-text'>
                            <CustomButton text={'Одобрить'} success={'Одобрено'} icon={uploadImg} func={acceptClip}/>
                            <button className='save-installmusic' onClick={declineClip}><img src={closeImg}/>Отклонить</button>
                        </div>
                        <h2 className='column1-h2'>Комментарий</h2>
                        <input id='myinput' value={comment} onChange={event => setComment(event.target.value)} className='inp-column1' placeholder={'Введите комментарий...'}/>
                    </div>: ''}

                    {cookies.role === 'author' && params?.id ? <div>
                        <div className='button-and-text'>
                            <button className='save-installmusic' onClick={deleteClip}><img src={trashIcon}/>Удалить</button>
                        </div>
                            {cookies.role === 'admin' ? ( 
                            <>
                                <h2 className='column1-h2'>Комментарий модератора</h2>
                                <input id='myinput' value={comment} onChange={event => setComment(event.target.value)} className='inp-column1' placeholder={'Введите комментарий...'}/>
                            </> 
                            ) : (<></>)}

                            {cookies.role !== 'admin' && comment !== '' ? (
                                <>
                                    <h2 className='column1-h2'>Комментарий модератора</h2>
                                    <p className='inp-column1' style={{padding: '10px 16px'}}>{comment}</p>
                                </>
                            ) : (<></>)}
                    </div> : ''}

                    <input type='file' className='input-file'  accept=".mp4,.avi,.mkv,.mov" ref={videoSetterRef} onChange={changeVideo}></input>
                    <input type='file' accept="image/*" className='input-file' ref={vertskinSetterRef} onChange={changeSkin}></input>
                </div>
            </div>  
        </section>
    )
}


export default UploadVerticalVideo;