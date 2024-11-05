import Clip from "../../Clip/Clip";
import './Clips.css';
import { useState, useEffect } from "react";
import { api, axiosUnauthorized } from "../../App/App";
import { useParams } from "react-router-dom";

export default function Clips({artistId, count=0, offset=0}) {
    const [clips, setClips] = useState(undefined);
    const params = useParams();

    const getArtistClips = async ()=> {
        // получить список клипов автора
        let response = await axiosUnauthorized.get(`api/music-clip/by-author/${artistId}` + (count == 0 ? '' : `&count=${count}&offset=${offset}`))
        .catch(err => {
            throw err;
        });
        let result = response?.data.musicClipList;
        return result;
    }

    useEffect(()=>{
        getArtistClips()
            .then(res=>setClips(res))
            .catch(err=>console.log(err))
    },[params])



    return (
        <div className="artist-clips">
            {clips?.map( (clip, index) => (
                    <Clip 
                        key={index} 
                        clipId={clip.id} 
                        authorId={clip.uploaderId} 
                        songId={clip.songId} 
                        name={clip.title} />
                ))}
        </div>
    )
}