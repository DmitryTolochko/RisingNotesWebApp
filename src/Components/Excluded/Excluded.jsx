import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Song from '../../Components/Song/Song';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { getSongInfo } from '../../Api/Song';

function Excluded () {
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'userId']);
    const [songs, setSongs] = useState([]);

    const excluded = useSelector((state)=>state.excluded.value)

    useEffect(() => {
        if (!cookies.role) {
            navigate("/login");
        }
        getSongs();
    }, []);

    async function getSongs() {
        let array = [];
        for (var id of excluded) {
            array.push(await getSongInfo(id, undefined));
        }
        setSongs(array);
    }

    return (
        <div>
            <h2 className='sub-h2'>Исключенные треки</h2>
            <div className='tracks scroll-tracks'>
                {songs.map(el => (
                    <Song key={el.id} id={el.id} name={el.name} duration={el.durationMs} artist={el.authorName} genres={el.genreList}/>
                ))}
                {songs.length === 0 ? <p style={{color: '#FE1170'}}>Список пуст</p> : <></>}
            </div>
        </div>
    )
}

export default Excluded