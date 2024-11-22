import React, { useEffect } from 'react';
import BackButton from '../../Components/BackButton';
import VideoPrewiew from '../../Images/installvideo/videoprewiew.svg';
import { useState, useRef } from 'react'
import { axiosAuthorized } from '../../Components/App/App';
import bigEdit from '../../Images/account-page/edit-big.svg';
import closeImg from '../../Images/x.svg';
import uploadImg from '../../Images/upload.svg';
import playImg from '../../Images/play.svg';
import pauseImg from '../../Images/Pause.svg';

import './UploadVideo.css';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useDropzone } from 'react-dropzone';
import InputSongs from './InputSongs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateVideoPlayerValue } from '../../Redux/slices/videoPlayerSlice';
import CustomInput from '../../Components/CustomInput/CustomInput';
import { showError } from '../../Redux/slices/errorMessageSlice';

function UploadVideo(){
    const dispatch = useDispatch()
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

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
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

    useEffect(() => {
        if (videoFile !== undefined)
            console.log(videoFile.size);
    }, [videoFile]);
    

    function handleChoosenSong(id, title) {
        setTitle(title);
        setSongId(id);
    }

    async function uploadVideo() {
        // загрузка видео
        let formData = new FormData();
        let clipId = undefined;
        let uploadId = undefined;
        let fileExtension = '.' + videoFile.type.split('/')[1];
        
        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('SongId', songId);

        await axiosAuthorized.post('api/music-clip', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .then(response => clipId = response.data.id)
        .catch(err => {return Promise.reject(err)});

        formData = new FormData();
        formData.append('File', imageFile);

        await axiosAuthorized.patch('api/music-clip/' + clipId + '/preview', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .catch(err => {return Promise.reject(err)});        

        await axiosAuthorized.post('api/music-clip/' + clipId + '/file/start-upload', {
            fileExtension: fileExtension
        })
        .then(response => uploadId = response.data.uploadId)
        .catch(err => {return Promise.reject(err)});

        if (videoFile.size <= 50 * 1024 * 1024) {
            // загрузка видео размером не больше 50 мб.
            await uploadFilePart(videoFile, 1, true, uploadId, clipId);
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
                await uploadFilePart(chunk, currentPart, currentPart === totalParts, uploadId, clipId);
            }
        }
    }

    async function uploadFilePart(filePart, partNumber, isLast, uploadId, clipId) {
        // загрузка куска видео
        let formData = new FormData();
        formData.append('File', filePart);
        formData.append('UploadId', uploadId);
        formData.append('PartNumber', partNumber);
        formData.append('IsLastPart', isLast);
        await axiosAuthorized.post('api/music-clip/' + clipId + '/file/upload-part', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .catch(err => {return Promise.reject(err)});
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
                        <h1 className='newtrack-h1'>Новый клип</h1>
                        {videoFile ? <button className='close-button' onClick={() => setVideofile(undefined)}><img src={closeImg}/></button> : <></>}
                        <div className={videoFile ? 'uploadtrack-div red-border' : 'uploadtrack-div'}>
                            {videoFile ? (
                                <div className='div-track'>
                                <button className='play-button' onClick={handlePlayVideo}><img src={isPlaying ? pauseImg : playImg}/></button>
                                {videoFileName && <p className='name-new-song'>{`${videoFileName}`}</p>}
                            </div>
                            ) : (
                                <div className='div-track' {...getInputFile()}> 
                                    <div className='uploadtrack-div-inf'>
                                        <p className='uploadtrack-p1'>Перетащите свой клип сюда</p>
                                        <p className='uploadtrack-p2'>.mp4 или .mkv, макс. 200мб</p>
                                    </div>
                                    <p className='or'>или</p>
                                    <CustomButton text={'Выберите файл'} func={() => getInputFile()} success={'Изменить'} icon={uploadImg}/>
                                </div>
                            )}
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
                            isRequired={true}/>
                    </div> 
                    <div className='column1-2'>
                        <CustomInput
                            heading={'Описание'}
                            placeholder={'Введите описание...'} 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            isTextArea={true}/>
                    </div>
                </div>
                <div className='video-information-3' >
                    <div className='button-and-text'>
                        <CustomButton 
                            text={'Опубликовать'} 
                            func={() => uploadVideo()} 
                            success={'Опубликовано'} 
                            icon={uploadImg}
                            disabled={isButtonDisabled}/>
                    </div>
                    {/* <text className='warning-upload'>*перед публикацией видео будет отправлено на модерацию</text> */}

                    <input type='file' accept=".jpg,.png" className='input-file' ref={skinSetterRef} onChange={changeSkin}></input>
                    <input type='file' accept=".mp4,.avi,.mkv,.mov" className='input-file' ref={videoSetterRef} onChange={changeVideo}></input>
                </div>
            </div>  
        </section>
    )
}


export default UploadVideo;