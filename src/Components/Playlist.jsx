import SongCover from '../Images/main-placeholder.png';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, axiosPictures, axiosUnauthorized } from './App/App';
import useSearchClean from '../Hooks/useSearchClean/useSearchClean';
import { shortenText } from '../Tools/Tools';


function Playlist(props) {
    const [namePlaylist, setNamePlaylist] = useState('');
    const [avatar, setAvatar] = useState(SongCover);
    const [isreviewSkin, setReviewSkin] = useState(false);
    const {cleanQuery} = useSearchClean();

    async function getAvatar() {
        await axiosPictures.get(api + `api/playlist/${props.id}/logo/link`)
        .then(resp => {setAvatar(resp?.data?.presignedLink)})
        .catch(err => {setAvatar(SongCover)});
    }

    useEffect(() => {
        axiosUnauthorized.get(`api/playlist/${props.id}`)
        .then(
            response => {
                setNamePlaylist(response.data.name)
            }
        )
        .catch(err => {console.log(err)});
        getAvatar();
    }, []) 

    return (
        <Link draggable='false' to={`/playlist/${props.id}`} className='playlist' onClick={() => cleanQuery()}>
            <img draggable='false' className='playlistskin' alt='cover' src={avatar}/>
            <p className='labelplaylist'>{shortenText(namePlaylist, 20)}</p>
        </Link>
    )
}


export default Playlist