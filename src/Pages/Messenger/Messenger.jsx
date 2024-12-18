import BackButton from "../../Components/BackButton";
import './Messenger.css';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { ReactComponent as SearchIcon} from '../../Images/sidebar/Vector.svg';
import chatIcon from '../../Images/chat.svg';
import sendIcon from '../../Images/controller/sendIcon.svg';
import CustomButton from "../../Components/CustomButton/CustomButton";
import { useEffect, useState } from "react";
import {  api, axiosAuthorized, axiosUnauthorized } from '../../Components/App/App';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Chevron from '../../Images/controller/chevron-left.svg';

const ChatTypes = {
    public: 1,
    private: 2
}

const Month = (number) => {
    let months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return months[number - 1];
}

function Messenger(params) {
    const navigate = useNavigate();
    const resize = useSelector((state)=> state.resize.value);
    const [searchValue, setSearchValue] = useState(undefined);
    const [recentChats, setRecentChats] = useState([]);
    const [recentChatsFiltered, setRecentChatsFiltered] = useState([]);
    const [users, setUsers] = useState([]);
    const [chatInfo, setChatInfo] = useState(undefined);
    const [chatId, setChatId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [currentText, setCurrentText] = useState(undefined);
    let prevMessageDateTime = 0;

    const [userName, setUserName] = useState(undefined);
    const [userLogo, setUserLogo] = useState(defaultAvatar);
    const [userId, setUserId] = useState(undefined);

    const [cookies, setCookies] = useCookies(['userId']);

    async function getRecentChats() {
        // Получить существующие чаты
        let response = await axiosAuthorized.get('api/chat')
        .catch(err => {navigate('/')});

        if (response === undefined) {navigate('/')}
        setRecentChats(response?.data?.chatList);
        setRecentChatsFiltered(response?.data?.chatList);
    }

    async function getChatInfo(id) {
        // Получить общую информацию о чате
        if (id !== undefined) {
            let response = await axiosAuthorized.get('api/chat/' + id)
            .catch(err => console.log(err));
    
            setChatInfo(response?.data);
            await getChatMessages(id);
        }
    }

    async function createNewChat(name, chatType, members) {
        // Создать новый чат, а затем получить информацию о нем
        let data = new FormData();
        if (name !== undefined)
            data.append('ChatName', name);
        data.append('ChatType', chatType);
        members.forEach((item, index) => {
            data.append(`MemberIdList[${index}]`, item);
        });
        
        let response = await axiosAuthorized.post('api/chat', data, { headers: {
            "Content-Type": "multipart/form-data",
        }})
        .catch(err => console.log(err));
        setChatId(response?.data?.id);

        await getChatInfo(response?.data?.id);
        return response?.data?.id;
    }

    async function sendMessage(chatId, text) {
        // Отправить сообщение, если есть текст. Если не создан чат, создать чат.
        if (text !== undefined && text !== '') {
            if (chatId === undefined)
                chatId = await createNewChat(undefined, ChatTypes.private, [userId, cookies.userId]);
            let data = new FormData();
            data.append('ChatId', chatId);
            data.append('Text', text);
            await axiosAuthorized.post('api/chat-message', data, { headers: {
                "Content-Type": "multipart/form-data",
            }})
            .catch(err => console.log(err));
            setCurrentText('');
            await getChatMessages(chatId);
        }
    }

    async function getChatMessages(id) {
        // Получить сообщения чата
        let response = await axiosAuthorized.get('api/chat-message/' + id +  '/list')
        .catch(err => console.log(err));

        setMessages(response?.data?.messageList);
    }

    async function getUsersByName(name) {
        // Получить пользователей по имени
        const response = await axiosAuthorized.get(`api/user/${name}`);
        const list = response.data.userInfoList;

        if (Array.isArray(recentChats) && recentChats.length > 0) {
            const promises = list.map(el => 
                Promise.all([
                  el,
                  recentChats.some(chat => chat.chatName === el.userName && chat.logoFileLink === el.logoLink)
                ])
              );
          
              const results = await Promise.all(promises);
          
              const filteredUsers = results.filter(([el, isInRecentChats]) => !isInRecentChats);
              const filteredChats = recentChats.filter(chat => 
                list.some(el => chat.chatName === el.userName || chat.logoFileLink === el.logoLink)
              );
          
              setRecentChatsFiltered(filteredChats);
              setUsers(filteredUsers.map(result => result[0]));
        } else {
            setUsers(list);
        }
    }

    function shortenLastMessage(text) {
        // Сократить сообщение
        if (text?.length > 28)
            return text.slice(0, 28) + '...';
        return text;
    }

    function formatTime(time) {
        // Отформатировать время к нужному виду
        if (time !== undefined && time !== null) {
            let newTime = new Date(time);
            return newTime.toLocaleTimeString().slice(0, 5);
        }
        else return '';
    }

    async function setUser(name, logo, id, thisChatId) {
        // Выбрать пользователя
        if (userId !== id || thisChatId !== chatId) {
            setUserLogo(logo);
            setUserName(name);
            setUserId(id);
            setChatId(thisChatId);
            setMessages([]);
            setChatInfo(undefined);
            await getChatInfo(thisChatId);
        }
    }

    useEffect(() => {
        getRecentChats();
    }, [])

    useEffect(() => {
        // Реагирование на поиск пользователей
        if (searchValue !== undefined && searchValue.length > 2) {
            getUsersByName(searchValue);
        } else {
            setUsers([]);
            setRecentChatsFiltered(recentChats);
        }
    }, [searchValue]);

    const Message = ({id, text, sentAt}) => {
        // сообщение
        switch (id) {
            case cookies.userId:
                return (
                    <span className="my-message" key={id}>
                        {text}
                        <p>{formatTime(sentAt)}</p>
                    </span>
                )
        
            default:
                return (
                    <span className="opponent-message" key={id}>
                        {text}
                        <p>{formatTime(sentAt)}</p>
                    </span>
                )
        }
    }

    const NewDate = ({currentDate}) => {
        // Линия даты
        let formatTime = new Date(currentDate);
        let day = formatTime.getDate();
        let month = formatTime.getMonth();
        let year = formatTime.getFullYear();
        let prev = prevMessageDateTime;
        prevMessageDateTime = formatTime;
        if (prev !== 0 && (prev.getDate() !== day || prev.getMonth() !== month)) {
            return (
                <span className="chat-date">
                    <div className="line"></div>
                    { prev.getDate() +  ' ' + Month(prev.getMonth() + 1)}
                    <div className="line"></div>
                </span>
            )
        } else if (prev !== 0 && prev.getFullYear() !== year) {
            return (
                <span className="chat-date">
                    <div className="line"></div>
                    { prev.getDate() +  ' ' + Month(prev.getMonth() + 1) +  ' ' + prev.getFullYear()}
                    <div className="line"></div>
                </span>
            )
        }
    }

    const Chat = () => {
        if (userName !== undefined || chatInfo !== undefined) {
            return (
                <div className="chat">
                    <div className="chat-header">
                        <a onClick={() => setUser(undefined, defaultAvatar, undefined, undefined)}><img src={Chevron}/></a>
                        <img src={userLogo !== null ? userLogo : defaultAvatar}/>
                        <p className="chat-name">{userName}</p>
                    </div>

                    <div className="chat-container">
                        {messages.map(el => (
                        <>
                            <NewDate currentDate={el.sentAt}/>
                            <Message key={el.id} id={el.senderId} text={el.text} sentAt={el.sentAt}/>
                        </>))
                        }
                        <NewDate currentDate={-1}/>
                    </div>

                    <div className='message-input-wrapper'>
                        <textarea 
                            placeholder='Напишите сообщение...' 
                            className='comment-input' 
                            onChange={e => setCurrentText(e.target.value)}
                            value={currentText}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(chatId, currentText);
                                }
                            }}/>
                        {resize === 'mobile' ? 
                            <button className='comment-btn-offset' 
                                onClick={() => sendMessage(chatId, currentText)}
                                style={{paddingTop: '10px', right: '55px'}}>
                                    <img src={sendIcon}/>
                            </button> : <></>}
                        {resize === 'standart' ? <CustomButton icon={sendIcon} errorText='' func={() => sendMessage(chatId, currentText)} reusable={true}/> : <></>}
                    </div>
                </div>
            )
        } else if (resize === 'standart') {
            return (
                <div className='chat'>
                    <img src={chatIcon}/>
                    <p>Выберите чат</p>
                </div>
            )
        }
    }

    const Contacts = () => {
        if (resize === 'standart' || userName === undefined) {
            return (
                <div className="contacts">
                    <div className="searchbar-container search-messenger">
                        <div>
                            <button className='searchbar-submit' type='submit'>
                                <SearchIcon/>
                            </button>
                            <input 
                                className='searchbar' 
                                type="text" 
                                placeholder='Найти пользователя'
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                    {recentChatsFiltered.length > 0 ? (
                    <>
                        <p className="contacts-h">Ваши чаты</p>
                        {recentChatsFiltered.map(el => (
                            <div className={el.chatName === userName ? 'contact contact-active' : 'contact'} key={el.id} onClick={() => setUser(el.chatName, el.logoFileLink, undefined, el.id)}>
                                <img alt='avatar' src={el.logoFileLink !== null ? el.logoFileLink : defaultAvatar}/>
                                <span className="contact-info">
                                    <span>
                                        <p className="contact-name">{el.chatName}</p>
                                        <p>{formatTime(el?.lastMessage?.sentAt)}</p>
                                    </span>
                                    <p>{shortenLastMessage(el?.lastMessage?.text)}</p>
                                </span>
                            </div>
                        ))}
                        
                    </>
                    ) : (<></>)}
                    
                    {users.length > 0 ? (
                    <>
                        <p className="contacts-h">Пользователи</p>
                        {users.map(el => (
                            <div className={el.userName === userName ? 'contact contact-active' : 'contact'} key={el.id} onClick={() => setUser(el.userName, el.logoLink, el.id, undefined)}>
                                <img alt='avatar' src={el.logoLink !== null ? el.logoLink : defaultAvatar}/>
                                <span className="contact-info">
                                    <span>
                                        <p className="contact-name">{el.userName}</p>
                                    </span>
                                </span>
                            </div>
                        ))}
                    </>
                    ) : (<></>)}

                    {users.length === 0 && recentChats.length === 0 ? (
                    <>
                         <div className="no-contacts">
                            <SearchIcon className="search-icon"/>
                            <p>Пользователи не найдены</p>
                            <span>Для поиска можно использовать почту или логин пользователя</span>
                        </div>
                    </>
                    ) : (<></>)}
                </div>                    

            )
        }
    }

    return (
        <section className='comment-page-wrapper'>
            <div className='featured messenger'>
                <BackButton/>
                <Contacts/>
                <Chat/>
            </div>
        </section>
    )
}

export default Messenger;