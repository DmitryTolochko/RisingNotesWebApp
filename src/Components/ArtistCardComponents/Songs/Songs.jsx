import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, axiosUnauthorized } from "../../App/App";
import Song from "../../Song/Song";
import '../TopTracks/TopTracks.css';
import { useDispatch } from "react-redux";
import { updateSongsValue } from "../../../Redux/slices/songsSlice";
import { updateMusicIsPlayingValue } from "../../../Redux/slices/musicIsPlayingSlice";

function Songs({artist}) {
    const params = useParams();
    const [songs, setSongs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();

    useEffect(() =>{
        axiosUnauthorized.get(api + `api/author/${params.id}/song/list`)
            .then(response => {
                setSongs(response.data.songInfoList);
            })
            .catch(err => {
                throw err;
            })
        setIsLoaded(true);
    }, [params]);

    function updatePlayableList (startId) {
        // Обновить текущий список вопроизведения
        let songsList = songs.map(el => el.id);
        let arr = songsList.slice(songsList.findIndex(e => e === startId));
        dispatch(updateSongsValue(arr));
        dispatch(updateMusicIsPlayingValue(true));
    }

    if (isLoaded)
    return (
        <div className="top-tracks-container">
            <div className="tracks">
                {songs.map(el => (
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