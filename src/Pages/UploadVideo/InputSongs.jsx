import React, { useRef } from 'react';
import { useEffect, useState } from "react"
import { useCookies, withCookies } from 'react-cookie';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../../Components/App/App';
import errorImg from '../../Images/error.svg';

function InputSongs({ 
    setSong, 
    isClipFree=true, 
    heading, 
    alertMessage='Поле обязательно для заполнения',
    isRequired=false}){

    const [songs, setSongs] = useState([]);
    const [choosen, setChoosenSong] = useState(undefined);
    const [cookies, setCookies] = useCookies(['authorId']);

    function handleChangeSong(id) {
        setChoosenSong(id);
        if (id !== '')
            setSong(id, songs.filter(e => e.id === id)[0].name); 
        else 
            setSong('');
    }

    // Подгрузка песен и фильтр на те, у которых нет клипа
    const fetchSongs = async () => {
        let allSongs = [];
        await axiosAuthorized.get(`api/author/${cookies.authorId}/song/list`)
        .then(response => {
            allSongs = response.data.songInfoList;
        })
        .catch(err =>{
            console.log(err)
        });

        if (!isClipFree) {
            let filteredSongs = await Promise.all(allSongs.map(async (song) => {
                try{
                    const response = await axiosPictures.get(api + 'api/music-clip/by-song/' + song.id)
                    return;
                } catch (error) {
                    return song;
                }
            }));

            filteredSongs = filteredSongs.filter(e => e !== undefined);
            setSongs(filteredSongs);
        } else {
            setSongs(allSongs);
        }
    };
  
    // Вызов функции при монтировании компонента
    useEffect(() => {
      fetchSongs();
    }, []);

    function isValidValue() {
        if (!isRequired) {
            return false;
        }
        return choosen === '';
    }

    return (
        <div>
            <span className='input-h'>
                <h2 className='column1-h2'>{heading}</h2>
                {isValidValue() ? <>
                    <img src={errorImg}/>
                    <div className='input-alert-triangle'></div>
                    <div className='input-alert'>
                    {alertMessage}
                    </div>
                </> : <></>}
                
            </span>
            <select className='choose-track-for-video' onChange={event => handleChangeSong(event.target.value)}>
                <option value={''}>Не выбрано</option>
                {songs.map(song => (
                    <option key={song.id} value={song.id}>{song.name}</option>
                ))}
            </select>  
        </div>
    )
}

export default InputSongs;