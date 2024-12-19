import CustomButton from "../CustomButton/CustomButton";
import Message from "./Message";
import NewDate from "./NewDate";
import Chevron from '../../Images/controller/chevron-left.svg';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import chatIcon from '../../Images/chat.svg';
import sendIcon from '../../Images/controller/sendIcon.svg';

const Chat = ({userName, chatInfo, setUser, userLogo, messages, formatTime, currentText, resize, sendMessage, setCurrentText, chatId}) => {

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
                        <Message 
                            key={el.id} 
                            id={el.senderId} 
                            text={el.text} 
                            sentAt={el.sentAt}
                            formatTime={formatTime}/>
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

export default Chat;