import { useEffect, useState } from 'react';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { ReactComponent as SearchIcon} from '../../Images/sidebar/Vector.svg';
import { axiosAuthorized } from '../App/App';
import { useDispatch, useSelector } from 'react-redux';
import Contact from './Contact';
import { updateChatInfo, updateIsChatSettingsVisible, updateIsCreatingNewChat, updateRecentFilteredChats } from '../../Redux/slices/socketInfoSlice';
import { ChatTypes } from '../../Pages/Messenger/Messenger';
import { useCookies } from 'react-cookie';
import { getUnreadCount } from '../../Api/Messenger';

const Contacts = ({
    setChat
}) => {
    const resize = useSelector((state)=> state.resize.value);
    const recentChats = useSelector((state)=> state.socketInfo.recentChats);
    const recentChatsFiltered = useSelector((state)=> state.socketInfo.recentChatsFiltered);
    const chatInfo = useSelector((state) => state.socketInfo.chatInfo);

    const [updatedChats, setUpdatedChats] = useState(recentChatsFiltered);
    const [searchValue, setSearchValue] = useState(undefined);
    const [users, setUsers] = useState([]);
    const [currPage, setCurrPage] = useState(ChatTypes.private);
    const dispatch = useDispatch();

    const [cookies, setCookies] = useCookies(['accessToken', 'userId']);

    useEffect(() => {
        getAllUnreadCounts();
    }, [recentChatsFiltered]);

    useEffect(() => {
        // Реагирование на поиск пользователей
        if (searchValue !== undefined && searchValue.length > 2) {
            getUsersByName(searchValue);
        } else {
            setUsers([]);
            dispatch(updateRecentFilteredChats(recentChats));
        }
    }, [searchValue]);

    async function getAllUnreadCounts() {
        // получить количество непрочитанных сообщений для всех чатов
        let chats = await Promise.all(recentChatsFiltered
        .map(async chat => {
            const newChat = { ...chat };
            if (newChat?.lastMessage?.readAt === null && newChat?.lastMessage?.senderId !== cookies.userId)
                newChat.unreadCount = await getUnreadCount(newChat.id);
            return newChat;
        }));
        setUpdatedChats(chats);
    }

    async function handleSetUser(el) {
        setChat(el.userId, undefined);
    }

    async function handleSetChat(el) {
        setChat(undefined, el.id);
    }

    const handleChangePage = (id) => {
        setCurrPage(id);
    };

    function handleCreateNewGroup() {
        let info = {
            id: undefined,
            hostUserId: cookies.userId,
            chatType: ChatTypes.public,
            chatName: undefined,
            photoLink: undefined,
            createdAt: undefined,
            userId: undefined
        }
        dispatch(updateChatInfo(info));
        dispatch(updateIsCreatingNewChat(true));
    }

    async function getUsersByName(name) {
        // Получить пользователей по имени
        // TODO че то странное тут происходит, сравнение не по тем полям
        // {
        //     "userInfoList": [
        //       {
        //         "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        //         "userName": "string",
        //         "logoLink": "string",
        //         "gender": 0
        //       }
        //     ]
        //   }
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
            dispatch(updateRecentFilteredChats(filteredChats));
            setUsers(filteredUsers.map(result => result[0]));
        } else {
            setUsers(list);
        }
    }

    if (resize === 'standart' || chatInfo?.chatName === undefined) {
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

                    {searchValue === undefined || searchValue?.length === 0 ? (
                    <div className="artist-card-menu" style={{marginBottom: 0}}>
                        <a onClick={() => handleChangePage(ChatTypes.private)} 
                            className={currPage === ChatTypes.private ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Личные
                        </a>
                        <a onClick={() => handleChangePage(ChatTypes.public)} 
                            className={currPage === ChatTypes.public ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item'}>
                            Группы
                        </a>
                    </div>
                    ) : (<></>)}
                    
                </div>

                {currPage === ChatTypes.public ? (
                    <button className='create-new-group' onClick={handleCreateNewGroup}>+ Создать новую группу</button>
                ) : (<></>)}

                {updatedChats?.length > 0 ? (
                <>
                    {searchValue?.length > 0 ?
                        (<p className="contacts-h">Ваши чаты</p>) : (<></>)}
                    {updatedChats.filter(chat => chat.chatType === currPage).map(el => (
                        <Contact  
                            onClick={() => {
                                handleSetChat(el)
                            }} 
                            chatName={el?.chatName}
                            id={el?.id} key={el?.id}
                            logo={el?.logoFileLink}
                            lastMessage={el?.lastMessage}
                            unreadCount={el?.unreadCount}
                            isActive={chatInfo?.chatName === el?.chatName}/>
                    ))}
                    
                </>
                ) : (<></>)}
                
                {users?.length > 0 ? (
                <>
                    <p className="contacts-h">Пользователи</p>
                    {users.map(el => (
                        <Contact 
                            onClick={() => {
                                handleSetUser(el)
                            }} 
                            chatName={el?.userName}
                            id={el.userId} key={el.userId}
                            logo={el?.logoLink}
                            isActive={chatInfo?.chatName === el?.chatName}/>
                    ))}
                </>
                ) : (<></>)}

                {users?.length === 0 && recentChats?.length === 0 ? (
                <>
                     <div className="no-contacts">
                        <SearchIcon className="search-icon"/>
                        <p>Пользователи не найдены</p>
                        <span>Для поиска можно использовать имя пользователя</span>
                    </div>
                </>
                ) : (<></>)}
            </div>                    

        )
    }
}

export default Contacts;