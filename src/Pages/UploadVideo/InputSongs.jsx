import React, { useRef } from 'react';
import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { useCookies, withCookies } from 'react-cookie';
import { api, axiosAuthorized, axiosPictures, axiosUnauthorized } from '../../Components/App/App';


function InputSongs({ setSong, isClipFree=true}){
    const [songs, setSongs] = useState([]);
    const [choosen, setChoosenSong] = useState([]);
    const [cookies, setCookies] = useCookies(['authorId']);

    function handleChangeSong(id) {
        setChoosenSong(id);
        setSong(id, songs.filter(e => e.id === id)[0].name); 
        console.log(id)
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

    return (
        <div>
            <select className='choose-track-for-video' onChange={event => handleChangeSong(event.target.value)}>
                <option>Не выбрано</option>
                {songs.map(song => (
                    <option key={song.id} value={song.id}>{song.name}</option>
                ))}
            </select>  
        </div>
    )
}

export default InputSongs;