import BackButton from "../../Components/BackButton";
import './Messenger.css';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { ReactComponent as SearchIcon} from '../../Images/sidebar/Vector.svg';
import chatIcon from '../../Images/chat.svg';
import sendIcon from '../../Images/controller/sendIcon.svg';
import CustomButton from "../../Components/CustomButton/CustomButton";
import { useState } from "react";


function Messenger(params) {
    const [searchValue, setSearchValue] = useState(undefined);

    function shortenLastMessage(text) {
        if (text.length > 28)
            return text.slice(0, 28) + '...';
        return text;
    }


    return (
        <section className='comment-page-wrapper'>
            <div className='featured messenger'>
                <BackButton/>
                <div className="contacts">
                    <div className="searchbar-container" 
                        style={{marginBottom: '20px', width: '320px', marginTop: '0px'}}>
                        <form>
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
                        </form>
                    </div>
                    {/* <p className="contacts-h">Ваши чаты</p>
                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение')}</p>
                        </span>
                    </div>
                    <p className="contacts-h">Пользователи</p>
                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение')}</p>
                        </span>
                    </div> */}

                    <div className="no-contacts">
                        <SearchIcon className="search-icon"/>
                        <p>Пользователи не найдены</p>
                        <span>Для поиска можно использовать почту, номер телефона или логин пользователя</span>
                    </div>
                </div>                    

                <div className="chat">
                    {/* <img src={chatIcon}/>
                    <p>Выберите чат</p> */}

                    <div className="chat-header">
                        <img src={defaultAvatar}/>
                        <p>Francis Owens</p>
                    </div>
                    <div className="chat-container">
                        
                        <span className="opponent-message">
                            цражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщцражпщлахщйакпиухйкпмхйщ
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            При очень длинном сообщении растягиваем до отступа в 100px слева, далее перекидывам на новую строку
                            <p>19:34</p>
                        </span>
                        <span className="chat-date">
                            <div className="line"></div>
                            20 Октября
                            <div className="line"></div>
                        </span>
                        <span className="opponent-message">
                            Сообщение собеседника
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            Короткое сообщение
                            <p>19:34</p>
                        </span>
                        <span className="chat-date">
                            <div className="line"></div>
                            20 Октября
                            <div className="line"></div>
                        </span>
                        <span className="opponent-message">
                            Сообщение собеседника
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            Короткое сообщение
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                            <p>19:34</p>
                        </span>
                        <span className="opponent-message">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                            <p>19:34</p>
                        </span>
                        <span className="chat-date">
                            <div className="line"></div>
                            20 Октября
                            <div className="line"></div>
                        </span>
                        <span className="opponent-message">
                            При очень длинном сообщении растягиваем до отступа в 100px справа, далее перекидывам на новую строку
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            При очень длинном сообщении растягиваем до отступа в 100px слева, далее перекидывам на новую строку
                            <p>19:34</p>
                        </span>
                        <span className="opponent-message">
                            Сообщение собеседника
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            Короткое сообщение
                            <p>19:34</p>
                        </span>
                        <span className="my-message">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                            <p>19:34</p>
                        </span>
                        <span className="opponent-message">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                            <p>19:34</p>
                        </span>
                        <span className="chat-date">
                            <div className="line"></div>
                            20 Октября
                            <div className="line"></div>
                        </span>
                    </div>

                    <div className='message-input-wrapper'>
                        <textarea placeholder='Введите текст комментария здесь...' className='comment-input' ></textarea>
                        <CustomButton icon={sendIcon} errorText=''/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Messenger;