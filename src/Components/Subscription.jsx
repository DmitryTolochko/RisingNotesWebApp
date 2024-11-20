import { Link } from 'react-router-dom';
import defaultAvatar from '../Images/main-placeholder.png';
import { useEffect, useState } from 'react';
import { api, axiosPictures, axiosUnauthorized } from './App/App';

function Subscription (props) {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [avatar, setAvatar] = useState(defaultAvatar);

    useEffect(() => {
        axiosUnauthorized.get(api + `api/author/${props.authorId}`)
        .then(response => {
            setName(response.data.name);
            setUserId(response.data.userId);
            getAvatar(response.data.userId);
        })
        .catch(err =>{console.log(err)});
    }, []);

    async function getAvatar(id) {
        await axiosPictures.get(api + `api/user/${id}/logo/link`)
        .then(resp => {setAvatar(resp?.data?.presignedLink)})
        .catch(err => {setAvatar(defaultAvatar)});
    }

    return (
        <Link to={`/artist/${props.authorId}`} className='playlist'>
            <img className='playlistskin' alt='cover' src={avatar}/>
            <p className='labelplaylist'>{name}</p>
        </Link>
    )
}

export default Subscription

