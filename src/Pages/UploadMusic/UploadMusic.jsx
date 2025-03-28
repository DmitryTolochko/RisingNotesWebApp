import React from 'react';
import BackButton from '../../Components/BackButton';
import PlaylistInstallSkin from '../../Images/main-placeholder.png';
import CustomInputWithTags from '../../Components/CustomInput/CustomInputWithTags';
import { useState, useEffect, useRef } from 'react'
import CustomSwitch from './CustomSwitch';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import bigEdit from '../../Images/account-page/edit-big.svg';
import uploadImg from '../../Images/upload.svg';
import { useDropzone } from 'react-dropzone';
import playImg from '../../Images/play.svg';
import pauseImg from '../../Images/Pause.svg';
import closeImg from '../../Images/x.svg';
import trashImg from '../../Images/trash.svg';

import './UploadMusic.css';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomInput from '../../Components/CustomInput/CustomInput';
import { useDispatch, useSelector } from 'react-redux';
import { showError } from '../../Redux/slices/errorMessageSlice';
import { answerSongRequestAsCoAuthor, changeSongRequestStatus, createNewSongRequest, deleteSongRequest, getSongRequestInfo, sendSongRequestToReview } from '../../Api/SongPublish';
import { getGenres, getLanguages, getMoods } from '../../Api/CommonData';
import { getAuthorListByName } from '../../Api/Author';

function UploadMusic(){
    const navigate = useNavigate();
    const params = useParams();
    const imageSetterRef = useRef(null);
    const songSetterRef = useRef(null);

    const [name, setName] = useState(undefined);
    const [isLyricsExist, setIsLyricsExist] = useState(false);
    const [lyrics, setLyrics] = useState(undefined);
    const [genre, setGenre] = useState(undefined);
    const [vibe, setVibe] = useState(undefined);
    const [language, setLanguage] = useState(undefined);
    const [gender, setGender] = useState([0]);
    const [songfile, setSongfile] = useState(undefined);
    const [logofile, setLogofile] = useState(undefined);
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'subscriptions', 'userId']);
    const [currentImage, setCurrentImage] = useState(PlaylistInstallSkin);
    const [songFileName, setSongFileName] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
    const [role, setRole] = useState('');
    const [comment, setComment] = useState('');
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);

    const [genreList, setGenreList] = useState([]);
    const [vibeList, setVibeList] = useState([]);
    const [languageList, setLanguageList] = useState([]);
    const [title, setTitle] = useState('Новый трек');
    const [duration, setDuration] = useState(0);
    const [coAuthors, setCoAuthors] = useState([]);

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const dispatch = useDispatch();
    const resize = useSelector((state)=> state.resize.value);

    useEffect(() => {
        if (!isSent)
            setIsButtonDisabled(checkInputs());
    }, [name, isLyricsExist, lyrics, genre, vibe, language, gender, songfile, logofile])

    function checkInputs() {
        if (isLyricsExist && 
            (lyrics == undefined || lyrics == '' || 
            ((language == undefined || language.length == 0))))
            return true;

        let arr = [name, genre, vibe, gender, songfile, logofile];
        let flag = false;
        arr.forEach((input) => {
            if (input == undefined || input == '' || (input == [] && input.length == 0)) {
                console.log(input == undefined);
                flag = true;
            }
        })
        return flag;
    }

    async function uploadToModeration() {
        // Отправка на модерацию

        setIsButtonDisabled(true);
        setIsSent(true);
        if (role === 'author') {
            // новая песня
            await createNewSongRequest(name, lyrics, isLyricsExist, 
                duration, vibe, genre, role, songfile, logofile, gender, language, coAuthors);
        }
    }

    const handleImageInput = (e) => {
        e.preventDefault();
        imageSetterRef.current.click();
    }

    const handleSongInput = (e) => {
        e.preventDefault();
        songSetterRef.current.click();
    }

    async function changeLogo (event) {
        // смена картинки
        event.preventDefault();
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            const imageSrc = await loadImage(file);
            if (file.size <=5*1024*1024 && await checkAspectRatio(imageSrc)) {
                setLogofile(file);
                const reader = new FileReader();
                reader.onload = (event) => {
                    setCurrentImage(event.target.result);
                };
                reader.readAsDataURL(file);
            }
            else {
                dispatch(showError({errorText: 'Изображение должно быть не больше 5 Мб и иметь соотношение 1 к 1'}))
            }
        }
    }

    const loadImage = async (file) => {
        // преобразовать изображение
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const checkAspectRatio = async (imageSrc) => {
        // проверка изображения на соотношение 1 к 1
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageSrc;
          
            img.onload = () => {
                const width = img.width;
                const height = img.height;
                console.log(width);
                console.log(height);
                resolve(width == height);
            };
        });
    };

    const changeSong = (event) => {
        // смена песни
        event.preventDefault();
        if (event.target.files.length > 0) {
            setSongFileName(event.target.files[0].name);
            setSongfile(event.target.files[0]);
        }
    }

    useEffect(() => {
        redirect();
        LoadAllInfo();
    }, []);

    async function LoadAllInfo() {
        if (params?.id)
            await getInfo();

        setGenreList(await getGenres());
        setLanguageList(await getLanguages());
        setVibeList(await getMoods());
        setIsLoaded(true);
    }

    const acceptSong = async () => {
        // Одобрение заявки
        if (role === 'admin') {
            await changeSongRequestStatus(3, comment, params.id);
        } else if (role === 'coAuthor') {
            // await answerSongRequestAsCoAuthor(params.id, true);
            if (coAuthors.filter(el => el.requestStatus === 2).length  === coAuthors.length) {
                await sendSongRequestToReview(params.id);
            }
        }
        
        // navigate(-1);        
    }

    const declineSong = async () => {
        // Отклонение заявки
        if (role === 'admin') {
            await changeSongRequestStatus(4, comment, params.id);
        } else if (role === 'coAuthor') {
            await answerSongRequestAsCoAuthor(params.id, false);
        }
        
        navigate(-1);
    }

    const deleteSong = async () => {
        // Удаление песни
        if (role === 'admin' ) {
            await changeSongRequestStatus(5, comment, params.id);
        }
        else if (role === 'authoredit') {
            await deleteSongRequest(params.id);
        }
        navigate(-1);
    }

    function redirect() {
        // Перенаправление
        if (cookies?.role === 'author'){
            setRole('author');
        } else if(cookies?.role === 'admin') {
            setRole('admin');
            setTitle('Модерация трека');
        } else {
            navigate('/login');
        }
    }

    async function getInfo() {
        // Подгрузка информации о заявке
        let songRequestInfo = await getSongRequestInfo(params.id);
        setName(songRequestInfo.songName);
        setLyrics(songRequestInfo.lyrics);
        setIsLyricsExist(songRequestInfo.instrumental);
        setGender(songRequestInfo.vocalGenderList[0]);
        setGenre(songRequestInfo.genreList);
        setVibe(songRequestInfo.vibeList);
        setLanguage(songRequestInfo.languageList);
        setSongFileName(songRequestInfo.songName);
        setCurrentImage(songRequestInfo.logoFileLink);
        setSongfile(songRequestInfo.songFileLink);
        setDuration(songRequestInfo.durationMs);
        setCoAuthors(songRequestInfo.featuredAuthorList);
        if (songRequestInfo.reviewerComment !== null)
            setComment(songRequestInfo.reviewerComment);
        
        if (songRequestInfo.featuredAuthorList.some(el => el.userId === cookies.userId)) {
            setRole('coAuthor');
            setTitle('Согласование трека')
        }
        else if (cookies?.role !== 'admin'){
            setRole('authoredit');
            setTitle('Редактирование трека');
        }
    }

    const { getRootProps: getInputFile } = useDropzone({
        // обработка файла закинутого drag & drop
        accept: {
            "audio/mpeg": [".mp3"],
            "audio/wav": [".wav"]
        },
        maxSize: 100000000,
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                setSongFileName(acceptedFiles[0].name);
                setSongfile(acceptedFiles[0]);

                const audio = new Audio();
                audio.addEventListener('loadedmetadata', function() {
                    setDuration(audio.duration * 1000);
                });
                
                audio.src = URL.createObjectURL(acceptedFiles[0]);
            }
        },
    });   
    
    function handlePlayFile() {
        // плеер музыкального файла
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        else if (typeof songfile === "string") {
            setIsPlaying(true);
            audioRef.current.src = songfile;
            audioRef.current.play();
        }
        else {
            setIsPlaying(true);
            const url = URL.createObjectURL(songfile);
            audioRef.current.src = url;
            audioRef.current.play();
        }
    }

    if (isLoaded)
    return (
        <div className='comment-page-wrapper'>
            <div className='featured'>
                <BackButton/>
                <div className='song-information-1'>
                    <div className='playlist-image-wrapper' onClick={handleImageInput}>
                        <div className='playlist-image-change'><img draggable='false' src={bigEdit}/></div>
                        <img draggable='false' className='playlist-image' alt='playlist cover' src={currentImage}/>
                    </div>
                    <span className='song-info'>
                        <h1 className='newtrack-h1'>{title}</h1>
                        {songfile ? <button className='close-button' onClick={() => setSongfile(undefined)}><img src={closeImg}/></button> : <></>}
                        <div className={songfile ? 'uploadtrack-div red-border' : 'uploadtrack-div'}>
                            {songfile ? (
                                <div className='div-track'>
                                    <button className='play-button' onClick={handlePlayFile}><img src={isPlaying ? pauseImg : playImg}/></button>
                                    {songFileName && <p className='name-new-song'>{`${songFileName}`}</p>}
                                </div>
                            ) : (<></>)}

                            {!songfile && resize === 'standart' ? (
                                <div className='div-track' {...getInputFile()}> 
                                    <div className='uploadtrack-div-inf'>
                                        <p className='uploadtrack-p1'>Перетащите свой трек сюда</p>
                                        <p className='uploadtrack-p2'>.mp3 или .wav, макс. 100мб</p>
                                    </div>
                                    <p className='or'>или</p>
                                    <CustomButton text={'Выберите файл'} func={handleSongInput} success={'Изменить'} icon={uploadImg}/>
                                </div>
                            ) : (<></>)}

                            {!songfile && resize === 'mobile' ? (
                                <div className='div-track' onClick={handleSongInput}> 
                                    <CustomButton text={'Выберите файл'}  success={'Изменить'} icon={uploadImg}/>
                                </div>
                            ) : (<></>)}
                            
                        </div>
                    </span>
                </div>

                <div className='song-information-2'>
                    <div className='column'>
                        <CustomInput 
                            placeholder={'Введите название...'} 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            heading={'Название трека'}
                            isRequired={true}
                            maxLength={40}
                            />
                    </div>
                    <div className='column'>
                        <CustomInputWithTags 
                            heading={'Настроение'}
                            placeholder={"Введите настроение..."} 
                            list={vibe} 
                            setList={setVibe} 
                            availableOptions={vibeList}/>
                    </div>
                    <div className='column'>
                        <CustomInputWithTags 
                            heading={'Жанры'}
                            placeholder={"Введите жанр..."} 
                            list={genre} 
                            setList={setGenre} 
                            availableOptions={genreList}/>
                    </div>
                    <div className='column'>
                        <h2 className='column1-h2'>Пол исполнителя</h2>
                        <select className="filters-select" onChange={e => setGender(e.target.value)} value={gender}>
                            <option value={0}>-</option>
                            <option value={1}>Женский</option>
                            <option value={2}>Мужской</option>
                        </select>
                    </div>
                    <div className='column'>
                        <CustomInputWithTags 
                            heading={'Соавторы'}
                            placeholder={"Начните вводить авторов..."} 
                            list={coAuthors} 
                            setList={setCoAuthors} 
                            isRequired={false}
                            func={getAuthorListByName}
                            responseStructure={{
                                displayKey: 'name', idKey: 'id'
                            }}/>
                    </div>
                </div>

                <div className='song-information-3' >
                    <CustomSwitch flag={isLyricsExist} setFlag={setIsLyricsExist}/>
                    <div id="myDiv" className='div-text'>
                        <CustomInputWithTags 
                            heading={'Язык трека'}
                            placeholder={"Введите язык..."} 
                            list={language} 
                            setList={setLanguage} 
                            availableOptions={languageList}/>
                        <CustomInput
                            heading={'Текст'}
                            placeholder={'Введите текст...'} 
                            value={lyrics} 
                            onChange={e => setLyrics(e.target.value)}
                            isTextArea={true}
                            isRequired={true}
                            maxLength={600}
                            />
                        <div className="text-checkbox">
                            <input type="checkbox" className='checkbox-button'/>
                            <label className='label-checkbox'>Ненормативная лексика</label>
                        </div>
                    </div>
                    
                    {role === 'author' ? <div>
                        <div className='button-and-text'>
                            <CustomButton 
                                text={'Опубликовать*'} 
                                func={uploadToModeration} 
                                success={'Отправлено на модерацию'} 
                                icon={uploadImg}
                                disabled={isButtonDisabled}/>
                        </div>
                            <text className='warning-upload'>*перед публикацией трек будет отправлен на модерацию</text>
                    </div> : ''}

                    {role === 'admin' ? <div>
                        <div className='button-and-text'>
                            <CustomButton text={'Одобрить'} func={acceptSong} success={'Одобрено'} icon={uploadImg}/>
                            <button className='save-installmusic' onClick={declineSong}><img src={closeImg}/>Отклонить</button>
                        </div>
                        <h2 className='column1-h2'>Комментарий</h2>
                        <input id='myinput' value={comment} onChange={event => setComment(event.target.value)} className='inp-column1' placeholder={'Введите комментарий...'}/>
                    </div>: ''}

                    {role === 'authoredit' ? <div>
                        <div className='button-and-text'>
                            <button className='save-installmusic' onClick={deleteSong}><img src={trashImg}/>Удалить</button>
                        </div>
                            {role === 'admin' ? (
                            <>
                                <h2 className='column1-h2'>Комментарий модератора</h2>
                                <input id='myinput' value={comment} onChange={event => setComment(event.target.value)} className='inp-column1' placeholder={'Введите комментарий...'}/>
                            </>  
                            ) : (<></>)}

                            {role !== 'admin' && comment !== '' ? (
                            <>
                                <h2 className='column1-h2'>Комментарий модератора</h2>
                                <p className='inp-column1' style={{padding: '10px 16px'}}>{comment}</p>
                            </>
                            ) : (<></>)}
                    </div> : ''}

                    {role === 'coAuthor' ? <div>
                        <div className='button-and-text'>
                            <CustomButton 
                                text={'Подтвердить*'} 
                                func={acceptSong} 
                                success={'Подтверждено'} 
                                icon={uploadImg}/>
                            <button className='save-installmusic' onClick={declineSong}><img src={trashImg}/>Отклонить</button>
                        </div>
                        <text className='warning-upload'>*перед публикацией трек будет отправлен на модерацию и согласование другим авторам</text>
                    </div> : ''}

                    <input type='file' accept=".jpg,.png" max='5000000' className='input-file' ref={imageSetterRef} onChange={changeLogo}></input>
                    <input type='file' accept=".mp3,.wav" className='input-file' ref={songSetterRef} onChange={changeSong}></input>
                    <audio ref={audioRef}
                        type="audio/mpeg" controls style={{ display: 'none' }}/>
                </div>
            </div>
        </div>
        )
}


export default UploadMusic;