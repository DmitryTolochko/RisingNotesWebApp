import { useEffect, useState } from "react";
import { axiosAuthorized, axiosUnauthorized } from "../../../../../Components/App/App";
import { useDispatch } from 'react-redux';
import { updateCurrentSongValue } from "../../../../../Redux/slices/currentSongSlice";

const TopTrackListItem = ({trackId, index}) =>{
    const [trackImage, setTrackImage] = useState(null)
    const [trackName, setTrackName] = useState(null)
    const [listenCounter, setListenCounter] = useState(null)
    const dispatch = useDispatch()

    async function getTrackData(songId){
        await axiosAuthorized.get(`/api/song/${songId}`).then(response => {
            setTrackName(response.data.name)
        });
    }
    async function getTrackImageLink(songId) {
        await axiosUnauthorized.get(`api/song/${songId}/logo/link`).then(response => {
            setTrackImage(response.data.presignedLink);
        })
    }
    async function getTrackListenCount(songId) {
        await axiosUnauthorized.get(`api/song/${songId}/audition/count`).then(response => {
            setListenCounter(response.data.auditionCount);
        })
    }

    useEffect(()=>{
        getTrackData(trackId)
        getTrackImageLink(trackId)
        getTrackListenCount(trackId)
    },[])

    return(
        <li className='tt-li' key={index} onClick={() => dispatch(updateCurrentSongValue(trackId))}>
            <span>
                {`${index+1}.`}
            </span>
            <img src={trackImage} alt="" />
            <span>
                {trackName}
            </span>
            <hr />
            {listenCounter}
        </li>
    )
}

export default TopTrackListItem