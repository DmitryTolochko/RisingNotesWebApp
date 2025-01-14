import { useEffect, useState } from 'react';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { ReactComponent as SearchIcon} from '../../Images/sidebar/Vector.svg';
import { axiosAuthorized } from '../App/App';
import { shortenText } from '../ArtistCardComponents/ArtistInfo/ArtistInfo';

const Contacts = ({
    userName, 
    searchValue, 
    setSearchValue, 
    resize, 
    recentChats, 
    recentChatsFiltered, 
    setUser, 
    formatTime, 
    users
}) => {
    const [updatedChats, setUpdatedChats] = useState(recentChatsFiltered);

    useEffect(() => {
        getAllUnreadCounts();
    }, [recentChatsFiltered]);

    async function getAllUnreadCounts() {
        // получить количество непрочитанных сообщений для всех чатов
        let chats = await Promise.all(recentChatsFiltered
        .map(async chat => {
            if (chat.lastMessage.readAt === null)
                chat.unreadCount = await getUnreadCount(chat.id);
            return chat;
        }));
        setUpdatedChats(chats);
    }

    async function getUnreadCount(chatId) {
        // получить количество непрочитанных сообщений одного чата
        let response = await axiosAuthorized.get(`api/chat-message/${chatId}/unread/count`)
        .catch(err => {return undefined})

        if (response) return response.data.unreadMessageCount;
        else return 0;
    }

    async function handleSetUser(el) {
        setUser(el.userName, el.logoLink, el.id, undefined);
        await getAllUnreadCounts();
    }

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
                {updatedChats?.length > 0 ? (
                <>
                    <p className="contacts-h">Ваши чаты</p>
                    {updatedChats.map(el => (
                        <div className={el.chatName === userName ? 'contact contact-active' : 'contact'} key={el.id} onClick={() => setUser(el.chatName, el.logoFileLink, undefined, el.id)}>
                            <img alt='avatar' src={el.logoFileLink !== null ? el.logoFileLink : defaultAvatar}/>
                            <span className="contact-info">
                                <span>
                                    <p className="contact-name">{shortenText(el.chatName, 13)}</p>
                                    <p>{formatTime(el?.lastMessage?.sentAt)}</p>
                                </span>
                                {el?.lastMessage?.readAt === null && el?.unreadCount > 0 ? (
                                    <span>
                                        <p>{shortenText(el?.lastMessage?.text, 20)}</p>
                                        <div className='unread'>{el?.unreadCount}</div>
                                    </span>
                                ) : (<></>)}
                            </span>
                        </div>
                    ))}
                    
                </>
                ) : (<></>)}
                
                {users?.length > 0 ? (
                <>
                    <p className="contacts-h">Пользователи</p>
                    {users.map(el => (
                        <div className={el.userName === userName ? 'contact contact-active' : 'contact'} key={el.id} onClick={() => setUser(el.userName, el.logoLink, el.id, undefined)}>
                            <img alt='avatar' src={el.logoLink !== null ? el.logoLink : defaultAvatar}/>
                            <span className="contact-info">
                                <span>
                                    <p className="contact-name">{shortenText(el.userName, 13)}</p>
                                </span>
                            </span>
                        </div>
                    ))}
                </>
                ) : (<></>)}

                {users?.length === 0 && recentChats?.length === 0 ? (
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

export default Contacts;