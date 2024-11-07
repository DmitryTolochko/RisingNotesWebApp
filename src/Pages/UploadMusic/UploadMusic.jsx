import React from 'react';
import BackButton from '../../Components/BackButton';
import PlaylistInstallSkin from '../../Images/main-placeholder.png';
import CustomInputWithTags from '../../Components/CustomInput/CustomInputWithTags';
import { useState, useEffect, useRef } from 'react'
import CustomSwitch from './CustomSwitch';
import { api, axiosAuthorized, axiosUnauthorized } from '../../Components/App/App';
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

function UploadMusic(){
    const navigate = useNavigate()
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

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const formData = new FormData();

    useEffect(() => {
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

        let id = undefined;
        formData.append('Name', name)
        formData.append('Lyrics', lyrics)
        formData.append('Instrumental', isLyricsExist)
        vibe.forEach((item, index) => {
            formData.append(`VibeList[${index}]`, item);
        });
        language.forEach((item, index) => {
            formData.append(`LanguageList[${index}]`, item);
        });
        genre.forEach((item, index) => {
            formData.append(`GenreList[${index}]`, item);
        });
        formData.append('VocalGenderList', gender)

        if (!(role === "authoredit" && typeof songfile === 'string')) {
            formData.append('SongFile.File', songfile)
        }

        formData.append('LogoFile.File', logofile)

        if (role === 'author') {
            // новая песня
            await axiosAuthorized.post(`/api/song/upload-request`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then(response => id = response.data.id)
            .catch(err => {return Promise.reject(err)});

            // await axiosAuthorized.post(`/api/song/upload-request/logo`, formData, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     }
            // })
            // .catch(err => {return Promise.reject(err)});
        }
        else if (role === 'authoredit') {
            // редактирование песни
            await axiosAuthorized.patch(`/api/song/upload-request/${params.id}/author`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then(response => {navigate('/account')})
            .catch(err => {return Promise.reject(err)});
        }
    }

    const handleImageInput = (e) => {
        e.preventDefault();
        imageSetterRef.current.click();
    }

    const handleSongInput = () => {
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

        await getGenreList();
        await getLanguageList();
        await getVibeList();
        setIsLoaded(true)
    }

    const acceptSong = () => {
        // Одобрение заявки
        axiosAuthorized.patch(`/api/song/upload-request/${params.id}/admin`, {
            status: 3, 
            comment: comment
        })
        .then( response => {navigate(-1)})
        .catch(err => console.log(err));
        
    }

    const declineSong = () => {
        // Отклонение заявки
        axiosAuthorized.patch(`/api/song/upload-request/${params.id}/admin`, {
            status: 4, 
            comment: comment
        })
        .then( response => {navigate(-1)})
        .catch(err => console.log(err));
    }

    const deleteSong = () => {
        // Удаление песни
        if (role === 'admin' ) {
            axiosAuthorized.patch(`/api/song/upload-request/${params.id}/admin`, {
                status: 5, 
                comment: comment
            })
            .then( response => {navigate(-1)})
            .catch(err => console.log(err));
        }
        else if (role === 'authoredit') {
            axiosAuthorized.delete(`api/song/` + params.id)
            .then( response => {navigate(-1)})
            .catch(err => console.log(err));
        }
    }

    async function getGenreList() {
        // Получение списка жанров
        try {
            let response = await axiosUnauthorized.get('api/common-data/genre/list');
            setGenreList(response.data.genreList);
        }
        catch (err) {
            setGenreList([]);
        }
    }

    async function getLanguageList() {
        // Получение списка языков
        try {
            let response = await axiosUnauthorized.get('api/common-data/language/list');
            setLanguageList(response.data.languageList);
        }
        catch (err) {
            setLanguageList([]);
        }
    }

    async function getVibeList() {
        // Получение списка настроений
        try {
            let response = await axiosUnauthorized.get('api/common-data/vibe/list');
            setVibeList(response.data.vibeList);
        }
        catch (err) {
            setVibeList([]);
        }
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
        await axiosAuthorized.get(`/api/song/upload-request/${params.id}`).then(response => {
            setName(response?.data?.songName);
            setLyrics(response?.data.lyrics);
            setIsLyricsExist(response?.data.instrumental);
            setGender(response?.data.vocalGenderList[0]);
            setGenre(response?.data.genreList);
            setVibe(response?.data.vibeList);
            setLanguage(response?.data.languageList);
            setSongFileName(response?.data?.songName);
            
            if (cookies?.role !== 'admin'){
                setRole('authoredit');
                setTitle('Редактирование трека');
            }
            setComment(response?.data?.reviewerComment);
        })
        .catch(err => {console.log(err)});

        setCurrentImage(api + `api/song/upload-request/${params.id}/logo`);
        setSongfile(api + `api/song/upload-request/${params.id}/file`);
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
            }
        },
    });   
    
    function handlePlayFile() {
        // плеер музыкального файла
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        else if (typeof songfile === "string" && songfile.includes('api/song/upload-request')) {
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
                            ) : (
                                <div className='div-track' {...getInputFile()}> 
                                    <div className='uploadtrack-div-inf'>
                                        <p className='uploadtrack-p1'>Перетащите свой трек сюда</p>
                                        <p className='uploadtrack-p2'>.mp3 или .wav, макс. 100мб</p>
                                    </div>
                                    <p className='or'>или</p>
                                    <CustomButton text={'Выберите файл'} func={() => getInputFile()} success={'Изменить'} icon={uploadImg}/>
                                </div>
                            )}
                            
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
                            isRequired={true}/>
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
                            isRequired={true}/>
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
                            <button className='save-installmusic' onClick={deleteSong}><img src={trashImg}/>Удалить</button>
                        </div>
                        <h2 className='column1-h2'>Комментарий</h2>
                        <input id='myinput' value={comment} onChange={event => setComment(event.target.value)} className='inp-column1' placeholder={'Введите комментарий...'}/>
                    </div>: ''}

                    {role === 'authoredit' ? <div>
                        <div className='button-and-text'>
                            <CustomButton text={'Сохранить*'} func={uploadToModeration} success={'Сохранено'} icon={uploadImg}/>
                            <button className='save-installmusic' onClick={deleteSong}><img src={trashImg}/>Удалить</button>
                        </div>
                        <h2 className='column1-h2'>Комментарий модератора</h2>
                            {role === 'admin' ? (
                                <input id='myinput' value={comment} onChange={event => setComment(event.target.value)} className='inp-column1' placeholder={'Введите комментарий...'}/>
                            ) : (<></>)}

                            {role !== 'admin' && comment !== '' ? (
                                <>
                                    <p className='inp-column1' style={{padding: '10px 16px'}}>{comment}</p>
                                    <text className='warning-upload'>*перед публикацией трек будет отправлен на модерацию</text>
                                </>
                            ) : (<></>)}
                    </div> : ''}

                    <input type='file' accept=".jpg,.png" max='5000000' className='input-file' ref={imageSetterRef} onChange={changeLogo}></input>
                    <input type='file' accept=".mp3,.wav" className='input-file' ref={songSetterRef} onChange={changeSong}></input>
                    <audio ref={audioRef} src={songFileName ? api + `api/song/${songFileName}/file` : ''}
                        type="audio/mpeg" controls style={{ display: 'none' }}/>
                </div>
            </div>
        </div>
        )
}


export default UploadMusic;