import { Link } from 'react-router-dom';
import defaultAvatar from '../Images/main-placeholder.png';
import { useEffect, useState } from 'react';
import { shortenText } from '../Tools/Tools';
import { getAuthorInfo } from '../Api/Author';
import { getUserLogo } from '../Api/User';

function Subscription (props) {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [avatar, setAvatar] = useState(defaultAvatar);

    useEffect(() => {
        getAuthorInfo(props.authorId)
        .then(info => {
            setName(info.name);
            setUserId(info.userId);
            getAvatar(info.userId);
        });
    }, []);

    async function getAvatar(id) {
        setAvatar(await getUserLogo(id));
    }

    return (
        <Link to={`/artist/${props.authorId}`} className='playlist'>
            <img className='playlistskin' alt='cover' src={avatar}/>
            <p className='labelplaylist'>{shortenText(name, 17)}</p>
        </Link>
    )
}

export default Subscription

