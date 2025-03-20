import {  useEffect, useState } from 'react'
import {Link, NavLink, useNavigate} from "react-router-dom";
import { api, axiosPictures } from '../App/App';
import { useCookies } from 'react-cookie';
import logotype from '../../Images/logo.svg'
import FallDownMenu from '../FallDownMenu/FallDownMenu';
import Chevron from '../../Images/controller/chevron-left.svg';
import defaultAvatar from '../../Images/main-placeholder.png';
import burderImg from '../../Images/burger.svg';
import useSearchClean from '../../Hooks/useSearchClean/useSearchClean';
import useMenuToggle from '../../Hooks/useMenuToggle/useMenuToggle';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as BellImage} from '../../Images/controller/bell.svg';

import './Header.css';
import { clearNotification, updateChatInfo } from '../../Redux/slices/socketInfoSlice';
import { shortenText } from '../../Tools/Tools';
import { getChatInfo } from '../../Api/Messenger';


function Header() {
    const [logo, setLogo] = useState(logotype);
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [isNotificationsOpened, setIsNotificationsOpened] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [cookies, setCookies] = useCookies(['accessToken', 'refreshToken', 'authorId', 'role', 'subscriptions', 'userId']);
    const [isUserAuthorized, setIsUserAuthorized] = useState(false);
    
    const resize = useSelector((state)=> state.resize.value)
    const notifications = useSelector((state)=> state.socketInfo.notifications);
    const {cleanQuery} = useSearchClean()
    const {toggler} = useMenuToggle()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // проверка картинки
        if (cookies.userId) {
            setIsUserAuthorized(true);
            axiosPictures.get(api + `api/user/${cookies.userId}/logo/link`)
            .then((response) => {
                setAvatar(response?.data?.presignedLink);
            })
            .catch(err => {
                setAvatar(defaultAvatar);
            });
        }
    }, []);

    useEffect(() => {
        setNotificationsCount(notifications?.length);
    }, [notifications]);

    async function handleClickOnMessage(el) {
        setIsNotificationsOpened(false);
        dispatch(clearNotification(el));
        let info = await getChatInfo(el.id);
        dispatch(updateChatInfo(info));
        navigate(`/messenger`);
    }

    return (
        <header className='header'>
            {resize === 'mobile' ? (
                <button onClick={toggler}><img src={burderImg} alt='menu'/></button>
            ) : (
            <></>)}
            <div className="header_logo">
                <img draggable='false' src={logo} alt="" />
                <span className='logo_txt'><Link to={'/'} className='logo_link'>RISING NOTES</Link></span>
            </div>
            {isUserAuthorized ? (
                <>
                    <div className='header_pfp'>
                    <span className='notifications' onClick={() => setIsNotificationsOpened(!isNotificationsOpened)}>
                        {notificationsCount > 0 ? <div className='notification'>{notificationsCount}</div> : <></>}
                        <BellImage alt='notifications' className='notifications-bell' stroke={isNotificationsOpened ?'#FE1170':'#787885'}/>
                    </span>
                        {resize === 'standart' ? (
                            <span className={isMenuOpened ? "pfp_dropdown-down" : "pfp_dropdown-up"} 
                                onClick={() => setIsMenuOpened(!isMenuOpened)}>
                                <img draggable='false' src={Chevron}/>
                            </span>
                        ) : (
                        <></>)}
                        <img draggable='false' className="pfp_image" src={avatar} alt="avatar"  
                            onClick={() => setIsMenuOpened(!isMenuOpened)}/>
                    </div>
                    {isMenuOpened ? <FallDownMenu callback={setIsMenuOpened}/> : <></>}
                    {isNotificationsOpened ? 
                    <div className="fall-down-menu" style={{width: '230px', textAlign: 'start', alignItems: 'center'}}
                        onMouseLeave={() => setIsNotificationsOpened(false)}>
                        <p className='menu-h'>Уведомления</p>
                        {notificationsCount === 0 ? <p className='menu-text'>Новых уведомлений нет</p> : <></>}
                        <div className='notification-messages'>
                            {notifications.map(el => (
                                <div className='notification-message' onClick={() => handleClickOnMessage(el)}>
                                    <img src={el.logoFileLink ? el.logoFileLink : defaultAvatar}/>
                                    <span>
                                        <p className='notification-message-user-name'>{shortenText(el.userName, 13)}</p>
                                        <p className='notification-message-text'>{shortenText(el?.message, 20)}</p>
                                    </span>
                                    {el?.unreadCount > 0 ? (
                                    <span>
                                        <div className='unread'>{el?.unreadCount}</div>
                                    </span>
                                ) : (<></>)}
                                </div>
                            ))}
                        </div>
                    </div> : <></>}
                    
                </>
            ) : (
                <div className='unauth-header'>
                    <NavLink onClick={()=>cleanQuery()} draggable='false' to='/login' className={'header-menu-ref'}
                    style={({ isActive }) => (isActive ? {color: '#FE1170'} : {color: '#787885'})}>
                        Войти</NavLink>
                    {resize === 'standart' ?(
                        <NavLink  onClick={()=>cleanQuery()} draggable='false' to='/registration' className={'header-menu-ref'}
                        style={({ isActive }) => (isActive ? {color: '#FE1170'} : {color: '#787885'})}>
                            Зарегистрироваться</NavLink>
                    ) : (<></>)}
                </div>
            )}
            
           
        </header>
    )
}
export default Header;