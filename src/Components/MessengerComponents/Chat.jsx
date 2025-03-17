import CustomButton from "../CustomButton/CustomButton";
import Message from "./Message";
import NewDate from "./NewDate";
import Chevron from '../../Images/controller/chevron-left.svg';
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import chatIcon from '../../Images/chat.svg';
import sendIcon from '../../Images/controller/sendIcon.svg';
import { ReactComponent as SendIcon } from '../../Images/as-react-component/sendIcon.svg';
import { ReactComponent as DeleteIcon } from '../../Images/x.svg';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAttachedSongs, updateChatInfo, updateCurrentChatMessages, updateIsChatSettingsVisible, updateIsModalSongsVisibe, updateRecentChats, updateRecentFilteredChats } from "../../Redux/slices/socketInfoSlice";
import { ChatTypes } from "../../Pages/Messenger/Messenger";
import { getWordSpelling, shortenText } from "../../Tools/Tools";
import { createNewChat, getChatInfo, getMessages, getRecentChatsList, sendMessage } from "../../Pages/Messenger/ApiCallers";
import { useCookies } from "react-cookie";
import { ReactComponent as PaperclipIcon } from '../../Images/controller/paperclip.svg';
import { showError } from "../../Redux/slices/errorMessageSlice";
import Song from "../Song/Song";

const Chat = ({
    setChat
}) => {
    const [cookies, setCookies] = useCookies(['accessToken', 'userId']);

    const fileInputRef = useRef(null);

    const [membersCount, setMembersCount] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [currentText, setCurrentText] = useState(undefined);
    const [messagesOffset, setMessagesOffset] = useState(0);
    const [paginationCount, setPaginationCount] = useState(20);
    const [isFileMenuOpened, setIsFileMenuOpened] = useState(false);
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);

    const chatInfo = useSelector((state) => state.socketInfo.chatInfo);
    const messages = useSelector((state)=> state.socketInfo.currentChatMessages);
    const chatMemberList = useSelector((state) => state.socketInfo.chatMemberList);
    const resize = useSelector((state)=> state.resize.value);
    const songs = useSelector((state) => state.socketInfo.attachedSongs);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(chatInfo);
        if (chatInfo?.id)
            getChatMessages(chatInfo?.id, true);
    }, [chatInfo]);

    useEffect(() => {
        if (chatInfo?.chatType === ChatTypes.private) {
            setMembersCount('');
        } else {
            setMembersCount(getWordSpelling(chatMemberList.length, 'участник'));
        }
    }, [chatInfo?.id, chatMemberList]);

    useEffect(() => {
        setShowMore(messages.length >= paginationCount && paginationCount !== 0);
    }, [messages, paginationCount]);

    function handleOpenSettings() {
        dispatch(updateIsChatSettingsVisible(true));
    }

    async function sendMessageAndRenewChats(chatId, text) {
        // Отправить сообщение, если есть текст. Если не создан чат, создать чат.
        if ((text !== undefined && text !== '') || files?.length !== 0 || songs?.length !== 0) {
            if (chatId === undefined) {
                chatId = await createNewChat(undefined, ChatTypes.private, [chatInfo?.userId, cookies.userId]);
                let info = await getChatInfo(chatId);
                dispatch(updateChatInfo(info));
            }
            await sendMessage(chatId, text, files, songs);
            setFiles([]);
            setImages([]);
            dispatch(updateAttachedSongs([]));
            setCurrentText('');
            await getLastMessage(chatId, messages);
            let list = await getRecentChatsList();
            dispatch(updateRecentChats(list));
            dispatch(updateRecentFilteredChats(list));
        }
    }

    async function getChatMessages(chatId, cleanPrev=false) {
        // Получить сообщения чата
        if (cleanPrev) {
            let list = await getMessages(chatId, 20, 0);
            dispatch(updateCurrentChatMessages(list));
            setMessagesOffset(20);
            setPaginationCount(20);
        } else {
            let list = await getMessages(chatId, paginationCount, messagesOffset, messages);
            if (list.length === messages.length) {
                setPaginationCount(0);
            }
            else {
                setPaginationCount(20);
            }
            setMessagesOffset(messagesOffset + paginationCount);
            dispatch(updateCurrentChatMessages(list));
        }
    }

    async function getLastMessage(chatId, messages) {
        let newList = await getMessages(chatId, 1, 0, messages, true);
        dispatch(updateCurrentChatMessages(newList));
    }

    function handleClickOnAddFile() {
        fileInputRef.current.click();
        setIsFileMenuOpened(false);
    }

    function handleClickOnAddSong() {
        dispatch(updateIsModalSongsVisibe(true));
        setIsFileMenuOpened(false);
    }

    function deleteSong(song) {
        dispatch(updateAttachedSongs(songs.filter(el => el.id !== song.id)));
    }

    async function addPhotoToMessage(event) {
        event.preventDefault();
        if (event.target.files.length > 0 && files.length + event.target.files.length <= 10) {
            let thisFiles = event.target.files;
            
            const promises = Array.from(thisFiles).map(file => {
                if (file.size <= 5 * 1024 * 1024) {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        
                        reader.onload = () => {
                            setFiles(prevFiles => [...prevFiles, file]);
                            setImages(prevImages => [...prevImages, reader.result]);
                            resolve();
                        };
                        
                        reader.readAsDataURL(file);
                    });
                } else {
                    dispatch(showError({ errorText: 'Изображение должно быть не больше 5 Мб' }));
                    return Promise.resolve();
                }
            });
            await Promise.all(promises);
        } else {
            dispatch(showError({ errorText: 'Нелья добавлять больше 10 вложений' }));
        }
    }

    function deletePhotoFromMessage(index) {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    }

    if (chatInfo?.id !== undefined || chatInfo?.userId !== undefined) {
        return (
            <div className="chat">
                <div className="chat-header">
                    <a onClick={() => setChat(undefined, undefined)}><img src={Chevron}/></a>
                    <img src={chatInfo?.photoLink !== null ? chatInfo?.photoLink : defaultAvatar} onClick={handleOpenSettings}/>
                    <span className="chat-name" onClick={handleOpenSettings}>
                        {shortenText(chatInfo?.chatName, 20)}
                        <p className="chat-members-count">{membersCount}</p>
                    </span>
                    
                </div>

                <div className="chat-container">
                    {messages.map(el => (
                    <>
                        <NewDate currentDate={el?.sentAt} key={el?.id}/>
                        <Message 
                            key={el?.id + '1'} 
                            senderId={el?.senderId} 
                            text={el?.text} 
                            sentAt={el?.sentAt}
                            readAt={el?.readAt}
                            messageId={el?.id}
                            attachments={el?.attachmentLinkList}
                            />
                    </>))
                    }
                    {showMore ? (
                        <CustomButton 
                            text={'Подгрузить еще сообщения'}
                            success={'Подгрузить еще сообщения'}
                            errorText="Это все сообщения"
                            reusable={true}
                            func={() => getChatMessages(chatInfo?.id)}/>
                    ) : (<></>)}
                    
                    <NewDate currentDate={-1} key={0}/>
                </div>
                {images?.length > 0 || songs?.length > 0 ? (
                    <div className="message-input-files">
                        {images.map((el, index)  => (
                            <div className="message-input-file">
                                <DeleteIcon className="message-input-file-delete" onClick={() => deletePhotoFromMessage(index)}/>
                                <img src={el} className="input-message-img"/>
                            </div>
                            
                        ))}
                        {songs.map((song, index) => (
                            <Song 
                                id={song.id} key={index}
                                name={song.name}
                                artist={song.authorName}
                                genres={song.genreList}
                                duration={song.durationMs}
                                isAttachedToMessage={true}
                                deleteFunc={() => deleteSong(song)}
                                isPicked={true}/>
                        ))}
                    </div>
                ) : (<></>)}
                
                <div className='message-input-wrapper'>
                    <textarea 
                        placeholder='Напишите сообщение...' 
                        className='comment-input' 
                        onChange={e => setCurrentText(shortenText(e.target.value, 550))}
                        value={shortenText(currentText, 550)}
                        maxLength={549}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessageAndRenewChats(chatInfo?.id, currentText);
                            }
                        }}/>

                    {isFileMenuOpened ? (
                        <div className="fall-down-menu messenger-fall-down" onMouseLeave={() => setIsFileMenuOpened(false)}>
                            <p className='menu-h'>Отправить вложение</p>
                            <a className="fall-down-menu-option" onClick={handleClickOnAddSong}>Музыка</a>
                            <a className="fall-down-menu-option" onClick={handleClickOnAddFile}>Фото</a>
                        </div>
                    ) : (<></>)}
                    
                    <button className="paperclip-button" onClick={() => setIsFileMenuOpened(!isFileMenuOpened)}>
                        <PaperclipIcon className="paperclip"/>
                    </button>
                    {resize === 'mobile' ? 
                        <button className='comment-btn-offset' 
                            onClick={() => sendMessageAndRenewChats(chatInfo?.id, currentText)}
                            style={{paddingTop: '10px', right: '55px'}}>
                                <SendIcon stroke="#FE1170"/>
                        </button> : <></>}
                    {resize === 'standart' ? 
                    <div style={{height: '48px'}}>
                        <CustomButton icon={sendIcon} errorText='' func={() => sendMessageAndRenewChats(chatInfo?.id, currentText)} reusable={true} />
                    </div> : <></>}
                </div>
                <input type='file' accept=".jpg,.png" className='input-file' multiple ref={fileInputRef} onChange={addPhotoToMessage}></input>
            </div>
        )
    } else if (resize === 'standart') {
        return (
            <div className='chat' style={{alignItems: 'center', gap: '12px'}}>
                <img src={chatIcon}/>
                <p>Выберите чат</p>
            </div>
        )
    }
}

export default Chat;