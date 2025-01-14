import { useEffect, useState } from "react";
import { axiosUnauthorized } from "../../../../../Components/App/App";
import { useDispatch } from 'react-redux';
import { updateCurrentSongValue } from "../../../../../Redux/slices/currentSongSlice";

const TopTrackListItem = ({songId, songName, auditionCount, index}) =>{
    const [trackImage, setTrackImage] = useState(null)
    const dispatch = useDispatch()

    async function getTrackImageLink(songId) {
        await axiosUnauthorized.get(`api/song/${songId}/logo/link`).then(response => {
            setTrackImage(response?.data.presignedLink);
        })
    }

    useEffect(()=>{
        getTrackImageLink(songId)
    },[])

    return(
        <li className='tt-li' key={index} onClick={() => dispatch(updateCurrentSongValue(songId))}>
            <span>
                {`${index+1}.`}
            </span>
            <img src={trackImage} alt="" />
            <span>
                {songName}
            </span>
            <hr />
            {auditionCount}
        </li>
    )
}

export default TopTrackListItem