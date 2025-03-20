import React, { useCallback, useEffect, useState } from 'react';
import placeholder from '../Images/image-placeholder/user_logo_small_placeholder.png';
import { useCookies, withCookies } from 'react-cookie';
import trashIcon from '../Images/commentaries/trash-icon.svg';
import trashRedIcon from '../Images/commentaries/trash-red-icon.svg';
import xIcon from '../Images/commentaries/x-icon.svg';

import { useSelector } from 'react-redux';
import { shortenText } from '../Tools/Tools';
import { deleteSongComment, sendSongComment } from '../Api/SongComment';
import { deleteClipComment, sendClipComment } from '../Api/ClipComment';
import { getUserLogo } from '../Api/User';

const Comment = (props) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [comment, setComment] = useState(props.data.text);
    const [cookies, setCookies] = useCookies(['userId']);
    const clipId = props.clipId;

    const resize = useSelector((state)=> state.resize.value)
    const [avatar, setAvatar] = useState(placeholder);

    useEffect(() => {
        getAavatar();
    }, []);

    const handleDeleteComment = async () => {
        if(clipId)
            await deleteClipComment(props.data.id);
        else
            await deleteSongComment(props.data.id);

        setIsDeleted(true);
    }

    const handleSendComment = async () => {
        if(clipId)
            await sendClipComment(clipId, comment);
        else
            await sendSongComment(props.songId, comment);

        setIsDeleted(false);
        props.setIsDataUpdated(!props.isDataUpdated);
    }

    const getAavatar = useCallback(async () => {
        setAvatar(await getUserLogo(props.data.authorId));
    }, [])

    return (
        <>
            <div className='comment'>
                <img alt='avatar' src={avatar}/>
                <span className='comm-text-area'>
                    {isDeleted ? (
                    <div className='comment-deleted'>
                        <p><img alt='icon' src={trashRedIcon}/>Комментарий удален</p>
                        <button className='comment-restore-button' onClick={handleSendComment}>
                            <img alt='delete' src={xIcon}/>
                            {'Отменить'}
                        </button>
                    </div>
                    ) : (<></>)}
                    <h2>{shortenText(props.data.authorDisplayedName, 25)}</h2> 
                    <text>{shortenText(comment, 550)}</text>
                </span>
            </div>
            {cookies.userId === props.data.authorId && !isDeleted ? (
                <button className='comment-del-button' onClick={handleDeleteComment}>
                    <img alt='delete' src={trashIcon}/>
                    {resize === 'standart' && !props?.isMobile ? 'Удалить' : ''}
                </button>
            ) : (<></>)}
        </>
        
    )
}

export default Comment