import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { useEffect, useState } from 'react';
import { formatTime, shortenText } from '../../Tools/Tools';
import checkIcon from '../../Images/check_big.svg';
import { ReactComponent as DeleteIcon } from '../../Images/x.svg';

function Contact({
    onClick=undefined,
    chatName='',
    id='',
    logo=defaultAvatar,
    lastMessage=undefined,
    unreadCount=0,
    isActive=false,
    isPicked=false,
    isAdmin=false,
    deleteOption=false,
    deleteFunction=undefined
}) {
    const [isContactActive, setIsContactActive] = useState(isActive);

    useEffect(() => {
        setIsContactActive(isActive);
    }, [isActive]);

    return(
        <div className={isContactActive ? 'contact contact-active' : 'contact'} key={id} onClick={onClick}>
            <img alt='avatar' src={logo !== null ? logo : defaultAvatar} className='contact-avatar'/>
            <span className="contact-info">
                <span>
                    <span className="contact-name">
                        {shortenText(chatName, 13)}
                        {isAdmin ? <p>Администратор</p> : <></>}
                    </span>
                    <p>{formatTime(lastMessage?.sentAt, false)}</p>
                </span>
                {lastMessage?.readAt === null && unreadCount > 0 ? (
                    <span>
                        <p>{shortenText(lastMessage?.text, 20)}</p>
                        <div className='unread'>{unreadCount}</div>
                    </span>
                ) : (
                    <span>
                        <p>{shortenText(lastMessage?.text, 20)}</p>
                    </span>)}
            </span>
            {isPicked ? <img alt='user is picked' src={checkIcon} className='picked-user'/> : <></>}
            {deleteOption && !isAdmin ? <DeleteIcon className='delete-user' onClick={deleteFunction}/> : <></>}
            
        </div>
    )
}

export default Contact;