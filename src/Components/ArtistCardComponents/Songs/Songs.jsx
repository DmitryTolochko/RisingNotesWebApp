import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosUnauthorized } from "../../App/App";
import Song from "../../Song/Song";
import '../TopTracks/TopTracks.css';
import { useDispatch } from "react-redux";
import { updateSongsValue } from "../../../Redux/slices/songsSlice";
import { updateMusicIsPlayingValue } from "../../../Redux/slices/musicIsPlayingSlice";
import { updatePlayerQueueName } from "../../../Redux/slices/playerQueueSlice";

function Songs({artist, count=0, offset=0}) {
    const params = useParams();
    const [songs, setSongs] = useState([]);
    const dispatch = useDispatch();

    useEffect(() =>{
        getSongs()
            .then(res => setSongs(res))
    }, [params]);

    async function getSongs() {
        let response = await axiosUnauthorized.get(`api/author/${params.id}/song/list`  + (count == 0 ? '' : `?count=${count}&offset=${offset}`))
        .catch(err => {
            throw err;
        })
        let result = response?.data.songInfoList;
        return result;
    }

    function updatePlayableList (startId) {
        // Обновить текущий список вопроизведения
        let songsList = songs.map(el => el.id);
        let arr = songsList.slice(songsList.findIndex(e => e === startId));
        dispatch(updateSongsValue(arr));
        dispatch(updateMusicIsPlayingValue(true));
        dispatch(updatePlayerQueueName('Дискография ' + artist.artistName));
    }

    return (
        <div className="top-tracks-container">
            <div className="tracks">
                {songs?.map(el => (
                    <Song 
                    key={el.id} 
                    id={el.id} 
                    name={el.name} 
                    duration={el.durationMs} 
                    artist={artist.artistName} 
                    genres={el.genreList}
                    onClick={updatePlayableList}/>
                ))}
            </div>
        </div>
    )
}

export default Songs;