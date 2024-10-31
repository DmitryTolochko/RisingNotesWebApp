import BackButton from "../../Components/BackButton";
import './Messenger.css';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import searchIcon from '../../Images/sidebar/Vector.svg';
import chatIcon from '../../Images/chat.svg';


function Messenger(params) {
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
                    <div className="searchbar-container" style={{marginBottom: '20px', width: '320px'}}>
                        <form>
                            <button className='searchbar-submit' type='submit'>
                                <img src={searchIcon} alt="" draggable='false' />
                            </button>
                            <input 
                                className='searchbar' 
                                type="text" 
                                placeholder='Найти пользователя'
                            />
                        </form>
                    </div>
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

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение Последнее отправленное сообщение')}</p>
                        </span>
                    </div>

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее')}</p>
                        </span>
                    </div>

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

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение Последнее отправленное сообщение')}</p>
                        </span>
                    </div>

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее')}</p>
                        </span>
                    </div>

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

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение Последнее отправленное сообщение')}</p>
                        </span>
                    </div>

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее')}</p>
                        </span>
                    </div>

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

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение Последнее отправленное сообщение')}</p>
                        </span>
                    </div>

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее')}</p>
                        </span>
                    </div>


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

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение Последнее отправленное сообщение')}</p>
                        </span>
                    </div>

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее')}</p>
                        </span>
                    </div>

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

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее отправленное сообщение Последнее отправленное сообщение')}</p>
                        </span>
                    </div>

                    <div className="contact">
                        <img alt='avatar' src={defaultAvatar}/>
                        <span className="contact-info">
                            <span>
                                <p className="contact-name">Francis Owens</p>
                                <p>23:34</p>
                            </span>
                            <p>{shortenLastMessage('Последнее')}</p>
                        </span>
                    </div>
                </div>

                <div className="chat">
                    <img src={chatIcon}/>
                    <p>Выберите чат</p>
                </div>
            </div>
        </section>
    )
}

export default Messenger;