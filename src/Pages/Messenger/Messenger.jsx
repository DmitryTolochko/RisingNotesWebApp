import BackButton from "../../Components/BackButton";
import './Messenger.css';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { useEffect, useRef, useState } from "react";
import {  api, axiosAuthorized, axiosUnauthorized } from '../../Components/App/App';
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Contacts from "../../Components/MessengerComponents/Contacts";
import Chat from "../../Components/MessengerComponents/Chat";
import Loader from "../../Components/Loader/Loader";
import { HttpTransportType, HubConnectionBuilder } from '@microsoft/signalr';

const ChatTypes = {
    public: 1,
    private: 2
}

function Messenger() {
    const [cookies, setCookies] = useCookies(['accessToken', 'userId']);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const resize = useSelector((state)=> state.resize.value);
    const [searchValue, setSearchValue] = useState(undefined);
    const [recentChats, setRecentChats] = useState(undefined);
    const [recentChatsFiltered, setRecentChatsFiltered] = useState([]);
    const [users, setUsers] = useState([]);
    const [chatInfo, setChatInfo] = useState(undefined);
    const [chatId, setChatId] = useState(undefined);
    const chatIdRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [currentText, setCurrentText] = useState(undefined);

    const [userName, setUserName] = useState(undefined);
    const [userLogo, setUserLogo] = useState(defaultAvatar);
    const [userId, setUserId] = useState(undefined);

    useEffect(() => {
        chatIdRef.current = chatId;
    }, [chatId])

    const connection = new HubConnectionBuilder()
        .withUrl(api + 'messenger', {
            accessTokenFactory: () => {return cookies.accessToken}
        })
        .build();

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
            await getRecentChats();
            // await getNewMessage(chatId);
        }
    }

    async function getChatMessages(id) {
        // Получить сообщения чата
        let response = await axiosAuthorized.get('api/chat-message/' + id +  '/list')
        .catch(err => {return undefined});

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

    async function getUserById(id) {
        // получить пользваотеля по Id
        let response = await axiosAuthorized.get('api/user/' + id)
        .catch(err => {return undefined});

        let charResp = await axiosAuthorized.get('api/chat/private/' + id)
        .catch(err => {return undefined});

        if (response !== undefined) {
            await setUser(response.data.userName, response.data.logoLink, response.data.id, charResp?.data?.id)
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
        // Подгрузить все чаты и чат с пользователем, если я попал к нему напрямую в ЛС
        getRecentChats();
        const Id = params.get('id');
        if (Id !== null) {
            getUserById(Id);
        }

        configSocket();        
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

    async function configSocket() {
        // соединение с сокетом
            
        async function start() {
            try {
                await connection.start();
                console.log("SignalR Connected.");
            } catch (err) {
                console.log(err);
                setTimeout(start, 5000);
            }
        };
        
        connection.onclose(async () => {
            await start();
        });

        connection.on('onNewMessage', async (thisChatId, preparedMessage, userName) => {
            // await getNewMessage(chatId);
            console.log(thisChatId);
            console.log(chatIdRef.current);
            if (thisChatId === chatIdRef.current)
                await getChatMessages(thisChatId);
            await getRecentChats();
        })

        connection.on('onError', (errorText) => {
            console.log(errorText);
        })

        connection.on('onMessageRead', (chatId, userId, messageId) => {
            console.log(userId);
        })

        await start();
    }

    if (recentChats === undefined) {
        return (
        <section className='comment-page-wrapper'>
            <div className='featured messenger'>
                <BackButton/>
                <Loader/>
            </div>
        </section>
        )
    } else 
    return (
        <section className='comment-page-wrapper'>
            <div className='featured messenger'>
                <BackButton/>
                <Contacts 
                    userName={userName}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    resize={resize}
                    recentChats={recentChats}
                    recentChatsFiltered={recentChatsFiltered}
                    setUser={setUser}
                    formatTime={formatTime}
                    shortenLastMessage={shortenLastMessage}
                    users={users}/>
                <Chat
                    userName={userName}
                    chatInfo={chatInfo}
                    setUser={setUser}
                    userLogo={userLogo}
                    messages={messages}
                    formatTime={formatTime}
                    currentText={currentText}
                    resize={resize}
                    sendMessage={sendMessage}
                    setCurrentText={setCurrentText}
                    chatId={chatId}/>
            </div>
        </section>
    )
}

export default Messenger;