import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { ReactComponent as SearchIcon} from '../../Images/sidebar/Vector.svg';

const Contacts = ({userName, searchValue, setSearchValue, resize, recentChats, recentChatsFiltered, setUser, formatTime, shortenLastMessage, users}) => {
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
                {recentChatsFiltered?.length > 0 ? (
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
                
                {users?.length > 0 ? (
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