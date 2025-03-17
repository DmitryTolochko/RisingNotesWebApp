import { useEffect, useRef, useState } from "react";
import Contact from "./Contact";
import {ReactComponent as CloseIcon } from '../../Images/x.svg';
import addUserIcon from '../../Images/addUser.png';
import defaultAvatar from '../../Images/main-placeholder.png';
import { useDispatch, useSelector } from "react-redux";
import { updateChatInfo, updateChatMemberList, updateIsChatSettingsVisible, updateIsCreatingNewChat, updateIsModalContactsVisibe } from "../../Redux/slices/socketInfoSlice";
import pencilIcon from '../../Images/pencil.svg';
import CustomInput from "../CustomInput/CustomInput";
import { ChatTypes } from "../../Pages/Messenger/Messenger";
import bigEdit from '../../Images/account-page/edit-big.svg';
import CustomButton from "../CustomButton/CustomButton";
import { showError } from "../../Redux/slices/errorMessageSlice";
import { axiosAuthorized } from "../App/App";
import { changeChatLogo, changeChatName, createNewChat, deleteUsersFromChat, getChatInfo, getChatMembers } from "../../Pages/Messenger/ApiCallers";
import { getWordSpelling } from "../../Tools/Tools";
import { useCookies } from "react-cookie";

function ChatSettings() {
    const imageSetterRef = useRef(null);
    const [cookies, setCookies] = useCookies(['accessToken', 'userId']);

    const isVisible = useSelector((state)=> state.socketInfo.isChatSettingsVisible);
    const isCreatingNewChat = useSelector((state) => state.socketInfo.isCreatingNewChat);
    const chatInfo = useSelector((state) => state.socketInfo.chatInfo);
    const chatMemberList = useSelector((state) => state.socketInfo.chatMemberList);

    const [currPage, setCurrPage] = useState(0);
    const [chatType, setChatType] = useState(ChatTypes.private);
    const [isNameChagning, setIsNameChanging] = useState(false);
    const [chatName, setChatName] = useState(chatInfo?.chatName);
    const [avatar, setAvatar] = useState(defaultAvatar);
    const [logofile, setLogofile] = useState(undefined);
    const [membersCount, setMembersCount] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setChatType(chatInfo?.chatType);
        getMembers(chatInfo?.id);
        setChatName(chatInfo?.chatName);
        setAvatar(chatInfo?.photoLink ? chatInfo?.photoLink : defaultAvatar);
        if (chatInfo?.chatType === ChatTypes.private) {
            setCurrPage(1);
        }
        else if (chatInfo?.chatType === ChatTypes.public) {
            setCurrPage(0);
        }
    }, [chatInfo?.id, isCreatingNewChat])

    const handleChangePage = (id) => {
        // смена страницы в лк
        setCurrPage(id);
    };

    function handleCloseSettings() {
        dispatch(updateIsChatSettingsVisible(false));
        if (isCreatingNewChat)
            dispatch(updateIsCreatingNewChat(false));
    }

    function handleOpenModalContacts() {
        dispatch(updateIsModalContactsVisibe(true));
    }

    async function handleChangeName() {
        // Смена имени чата
        setIsNameChanging(false);
        if (chatName !== '' && chatName !== undefined && !isCreatingNewChat)
            await changeChatName(chatInfo?.id, chatName);
        else if (!isCreatingNewChat) {
            setChatName(chatInfo?.chatName);
        }
    }

    async function uploadLogo(event) {
        // обновление картинки
        event.preventDefault();
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            if (file.size <= 5*1024*1024) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setAvatar(event.target.result);
                };
                reader.readAsDataURL(file);

                if (!isCreatingNewChat) {
                    await changeChatLogo(chatInfo?.id, file)
                } else {
                    setLogofile(file);
                }
            }
            else {
                dispatch(showError({errorText: 'Изображение должно быть не больше 5 Мб'}))
            }
        }
    };

    const handleImageInput = () => {
        imageSetterRef.current.click();
    }

    async function createNewGroupChat() {
        // Создание нового чата
        let membersIds = []
        chatMemberList.forEach(el => membersIds.push(el.userId));
        let chatId = await createNewChat(chatName, ChatTypes.public, membersIds, logofile);
        let info = await getChatInfo(chatId);
        dispatch(updateChatInfo(info));
        handleCloseSettings();
    }

    async function getMembers(chatId) {
        // Получить список участников или добавить себя при создании чата
        if (chatId === undefined) {
            let response = await axiosAuthorized.get(`api/user/${cookies.userId}`)
            dispatch(updateChatMemberList([{
                userId: cookies.userId,
                userName: response.data.userName + ' (вы)',
                logoLink: response.data.logoLink
            }]));
            setMembersCount('');
        } else {
            let list = await getChatMembers(chatId);
            dispatch(updateChatMemberList(list));
            
        }
    }

    async function deleteMemberFromChat(userId) {
        await deleteUsersFromChat(chatInfo?.id, [{userId: userId}]);
        let list = await getChatMembers(chatInfo?.id);
        dispatch(updateChatMemberList(list));
    }

    useEffect(() => {
        setMembersCount(getWordSpelling(chatMemberList.length, 'участник'));
    }, [chatMemberList]);

    if (isVisible || isCreatingNewChat)
    return(
        <div className="chat-settings">
            <button className="close-chat-settings" onClick={handleCloseSettings}>
                <CloseIcon className="close-chat-img"/>
            </button>
            <div className="chat-settings-inner">
                <div className='chat-settings-img-wrapper' >
                    {chatType === ChatTypes.public && cookies.userId === chatInfo?.hostUserId ? (
                        <div className='chat-settings-img-change'><img draggable='false' src={bigEdit} onClick={handleImageInput}/></div>
                    ) : (<></>)}
                    <img className='chat-settings-img' src={avatar} alt='image'/>
                </div>
                
                {!isNameChagning && !isCreatingNewChat ? (
                    <>
                        <p className="chat-name" style={{flexDirection: 'row'}}>
                            {chatName}
                            {chatType === ChatTypes.public && cookies.userId === chatInfo?.hostUserId ? (
                                <button onClick={() => setIsNameChanging(true)}>
                                    <img src={pencilIcon}/>
                                </button>
                            ) : (<></>)}
                            
                        </p>
                        {chatType === ChatTypes.public ? <p>{membersCount}</p> : <></>}
                        
                    </>
                ) : (
                    <div className="chat-settings-name-edit" onBlur={handleChangeName}>
                        <CustomInput 
                            placeholder='Введите название группы...' 
                            heading='Название'
                            value={chatName}
                            onChange={e => setChatName(e.target.value)}
                            isRequired={true}
                            maxLength={30}/>
                    </div>
                )}
                
                {!isCreatingNewChat ? (
                <div className="artist-card-menu" style={{marginBottom: 0, borderColor: '#2C323D'}}>
                    {chatType === ChatTypes.public ? (
                        <a onClick={() => handleChangePage(0)} 
                            className={currPage === 0 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item chat-settings-menu-color'}>
                            Участники
                        </a>
                    ) : (<></>)}
                    <a onClick={() => handleChangePage(1)} 
                        className={currPage === 1 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item chat-settings-menu-color'}>
                        Музыка
                    </a>
                    <a onClick={() => handleChangePage(2)} 
                        className={currPage === 2 ? 'artist-card-menu-item artist-card-menu-item-active' : 'artist-card-menu-item chat-settings-menu-color'}>
                        Вложения
                    </a>
                </div>
                ) : (<></>)}
                

                {currPage === 0 ? (
                <div className="chat-settings-contacts">
                    {cookies.userId === chatInfo?.hostUserId ? (
                        <div className="add-user-to-group" onClick={handleOpenModalContacts}>
                            <img src={addUserIcon} alt='add user'/>
                            Добавить участника
                        </div>
                    ) : (<></>)}
                    
                    {chatMemberList.map(el => (
                        <Contact 
                            chatName={el.userName} 
                            key={el.userId} id={el.userId} 
                            logo={el.logoLink} 
                            isAdmin={el.userId === chatInfo?.hostUserId}
                            deleteOption={cookies.userId === chatInfo?.hostUserId}
                            deleteFunction={() => deleteMemberFromChat(el.userId)}/>
                    ))}
                </div>
                ) : (<></>)}
                {isCreatingNewChat ? <CustomButton text={'Создать группу'} func={createNewGroupChat}/> : <></>}
            </div>
            <input type='file' accept=".jpg,.png" className='input-file' ref={imageSetterRef} onChange={uploadLogo}></input>
        </div>
    )
}

export default ChatSettings;