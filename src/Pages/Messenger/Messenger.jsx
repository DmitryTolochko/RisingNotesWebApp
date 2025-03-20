import BackButton from "../../Components/BackButton";
import './Messenger.css';
import { useDispatch, useSelector } from "react-redux";
import Contacts from "../../Components/MessengerComponents/Contacts";
import Chat from "../../Components/MessengerComponents/Chat";
import Loader from "../../Components/Loader/Loader";
import { updateChatInfo, updateCurrentChatMessages, updateIsChatSettingsVisible, updateIsCreatingNewChat } from "../../Redux/slices/socketInfoSlice";
import ChatSettings from "../../Components/MessengerComponents/ChatSettings";
import ModalContacts from "../../Components/MessengerComponents/ModalContacts";
import { getChatInfo, getUserInfo } from "../../Api/Messenger";
import ChatImage from "../../Components/MessengerComponents/ChatImage";
import ModalSongs from "../../Components/MessengerComponents/ModalSongs";

export const ChatTypes = {
    public: 1,
    private: 2
}

function Messenger() {
    const recentChats = useSelector((state)=> state.socketInfo.recentChats);
    const dispatch = useDispatch();

    async function setChat(thisUserId, thisChatId) {
        // Выбрать пользователя
        let info = {
            id: undefined,
            hostUserId: undefined,
            chatType: ChatTypes.private,
            chatName: undefined,
            photoLink: undefined,
            createdAt: undefined,
            userId: undefined
        }
        if (thisChatId) {
            info = await getChatInfo(thisChatId);
        } else if (thisUserId) {
            let userInfo = await getUserInfo(thisUserId);
            info.userId = userInfo.userId;
            info.chatName = userInfo.userName;
            info.photoLink = userInfo.logoLink;
            dispatch(updateCurrentChatMessages([]));
        }
        dispatch(updateChatInfo(info));
        dispatch(updateIsChatSettingsVisible(false));
        dispatch(updateIsCreatingNewChat(false));
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
            <ModalSongs/>
            <ModalContacts/>
            <ChatImage/>
            <div className='featured messenger'>
                <BackButton/>
                <Contacts 
                    setChat={setChat}/>
                <ChatSettings/>

                <Chat
                    setChat={setChat}/>
            </div>
        </section>
    )
}

export default Messenger;