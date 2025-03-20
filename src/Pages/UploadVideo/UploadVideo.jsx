import React, { useEffect } from 'react';
import BackButton from '../../Components/BackButton';
import VideoPrewiew from '../../Images/installvideo/videoprewiew.svg';
import { useState, useRef } from 'react'
import bigEdit from '../../Images/account-page/edit-big.svg';
import closeImg from '../../Images/x.svg';
import uploadImg from '../../Images/upload.svg';
import playImg from '../../Images/play.svg';
import pauseImg from '../../Images/Pause.svg';
import './UploadVideo.css';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useDropzone } from 'react-dropzone';
import InputSongs from './InputSongs';
import { useDispatch, useSelector } from 'react-redux';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';
import CustomInput from '../../Components/CustomInput/CustomInput';
import { showError } from '../../Redux/slices/errorMessageSlice';
import { changeClipRequestStatus, createNewClipRequest, deleteClipRequest, getClipRequestInfo, startUploadClip, submitClipRequestForReview, uploadClipFilePart, uploadClipLogo } from '../../Api/ClipPublish';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import trashIcon from '../../Images/trash.svg'

function UploadVideo(){
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();

    const skinSetterRef = useRef(null);
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

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const resize = useSelector((state)=> state.resize.value);

    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'subscriptions', 'userId']);

    useEffect(() => {
        getAllInfo();
        if (!isSent)
            setIsButtonDisabled(checkInputs());
    }, [imageFile, videoFile, songId])

    function checkInputs() {
        let arr = [imageFile, videoFile, songId];
        let flag = false;
        arr.forEach((input) => {
            if (input == undefined || input == '' || (input == [] && input.length == 0)) {
                console.log(input == undefined);
                flag = true;
            }
        })
        return flag;
    }    

    function handleChoosenSong(id, title) {
        setTitle(title);
        setSongId(id);
    }

    async function uploadVideo() {
        // загрузка видео
        let clipRequestId = undefined;
        let uploadId = undefined;
        let fileExtension = '.' + videoFile.type.split('/')[1];

        setIsButtonDisabled(true);
        setIsSent(true);

        clipRequestId = await createNewClipRequest(title, description, songId);
        try {
            await uploadClipLogo(imageFile, clipRequestId);    
            uploadId = await startUploadClip(clipRequestId, fileExtension);
    
            if (videoFile.size <= 50 * 1024 * 1024) {
                // загрузка видео размером не больше 50 мб.
                await uploadClipFilePart(videoFile, 1, true, uploadId, clipRequestId);
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
                    await uploadClipFilePart(chunk, currentPart, currentPart === totalParts, uploadId, clipRequestId);
                }
            }
    
            await submitClipRequestForReview(title, description, clipRequestId);
        } catch {
            await deleteClipRequest(clipRequestId);
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

    const handleSkinInput = () => {
        skinSetterRef.current.click();
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

    const handleVideoInput = (e) => {
        e.preventDefault();
        videoSetterRef.current.click();
    }

    async function getAllInfo() {
        if (params?.id) {
            let info = await getClipRequestInfo(params?.id);
            setTitle(info.title);
            setDescription(info.description);
            setSongId(info.songId);
            setVideoFileName(info.title);
            setImage(info.logoFileLink);
            setVideofile(info.clipFileLink);
        }
    }

    const acceptClip = async () => {
        // Одобрение заявки
        await changeClipRequestStatus(3, comment, params.id);
        navigate(-1);        
    }
    
    const declineClip = async () => {
        // Отклонение заявки
        await changeClipRequestStatus(4, comment, params.id);
        navigate(-1);
    }

    const deleteClip = async () => {
        // Удаление песни
        if (cookies.role === 'admin' ) {
            await changeClipRequestStatus(5, comment, params.id);
        }
        else if (cookies.role === 'author') {
            await deleteClipRequest(params?.id);
        }
        navigate(-1);
    }

    return (
        <section className='comment-page-wrapper'>
            <div className='featured'>
                <BackButton/>
                <div className='video-information-1'>
                    <div className='video-skin-wrapper' onClick={handleSkinInput}>
                        <div className='video-skin-change'><img draggable='false' src={bigEdit}/></div>
                        <img draggable='false' className='video-prewiew' alt='video prewiew' src={image}/> 
                    </div>
                    <span className='song-info'>
                        <h1 className='newtrack-h1'>{params?.id ? title : 'Новый клип'}</h1>
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
                                        <p className='uploadtrack-p1'>Перетащите свой клип сюда</p>
                                        <p className='uploadtrack-p2'>.mp4 или .mkv, макс. 200мб</p>
                                    </div>
                                    <p className='or'>или</p>
                                    <CustomButton text={'Выберите файл'} func={() => getInputFile()} success={'Изменить'} icon={uploadImg}/>
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
                        <h2 className='uploadvideo-h2'></h2>
                        <InputSongs 
                            heading={'Связанный трек'}
                            setSong={handleChoosenSong} 
                            isClipFree={false}
                            isRequired={true}
                            defaultSong={title}/>
                    </div> 
                    <div className='column1-2'>
                        <CustomInput
                            heading={'Описание'}
                            placeholder={'Введите описание...'} 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            isTextArea={true}
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

                    <input type='file' accept=".jpg,.png" className='input-file' ref={skinSetterRef} onChange={changeSkin}></input>
                    <input type='file' accept=".mp4,.avi,.mkv,.mov" className='input-file' ref={videoSetterRef} onChange={changeVideo}></input>
                </div>
            </div>  
        </section>
    )
}


export default UploadVideo;