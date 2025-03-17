import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { axiosAuthorized } from "../App/App";
import { formatTime, shortenText } from "../../Tools/Tools";
import { useDispatch, useSelector } from "react-redux";
import defaultAvatar from '../../Images/image-placeholder/user_logo_small_placeholder.png';
import { ChatTypes } from "../../Pages/Messenger/Messenger";
import { updateChatImages } from "../../Redux/slices/socketInfoSlice";
import { getSongInfo } from "../../Api/Song";
import Song from "../Song/Song";

const AttachmentTypes = {
    song: 1,
    image: 2
}

const Message = ({senderId, text, sentAt, readAt, messageId, attachments=[]}) => {
    const [cookies, setCookies] = useCookies(['userId']);

    const chatInfo = useSelector((state) => state.socketInfo.chatInfo);
    const chatMemberList = useSelector((state) => state.socketInfo.chatMemberList);
    const dispatch = useDispatch();

    const [logo, setLogo] = useState(defaultAvatar);
    const [images, setImages] = useState([]);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        setImages(attachments.filter(el => el.attachmentType === AttachmentTypes.image).map(el => el.attachmentFileLink));
        getSongsInfo();
    }, [attachments]);

    useEffect(() => {
        if (readAt === null && senderId !== cookies.userId) {
            axiosAuthorized.patch(`api/chat-message/${messageId}`);
        }
        let image = chatMemberList.filter(el => el.userId === senderId)[0]?.logoLink;
        if (image !== undefined)
            setLogo(image);
    }, [chatMemberList]);

    function handleClickOnImages() {
        dispatch(updateChatImages(images));
    }

    async function getSongsInfo() {
        let ids = attachments.filter(el => el.attachmentType === AttachmentTypes.song).map(el => el.attachmentFileId);
        let list = await Promise.all(ids
        .map(async id => {
            return await getSongInfo(undefined, id);
        }));
        setSongs(list);
    }

    // сообщение
    switch (senderId) {
        case cookies.userId:
            return (
                <div className="my-message-wrapper">
                    <span className="my-message-wrapper-wrapper">
                        {images?.length !== 0 ? (
                            <div className="message-attachments" onClick={handleClickOnImages}>
                                {images.map(el => (
                                    <img src={el} style={{width: images.length === 1 ? '100%' : '50%'}}/>
                                ))}
                            </div>
                        ) : (<></>)}

                        {songs?.length !== 0 ? (
                            <div className="tracks">
                                {songs.map((el, index) => (
                                    <Song
                                        id={el.id} key={index}
                                        name={el.name}
                                        isAttachedToMessage={true}
                                        artist={el.authorName}
                                        />
                                ))}
                            </div>
                        ) : (<></>)}
                        
                        <span className="my-message" key={messageId}>
                            {shortenText(text, 550)}
                            <p>{formatTime(sentAt)}</p>
                        </span>
                    </span>
                    
                    {chatInfo?.chatType === ChatTypes.public ? <img src={logo} className="message-user-avatar"/> : <></>}
                </div>
                
            )
    
        default:
            return (
                <div className="opponent-message-wrapper">
                    {chatInfo?.chatType === ChatTypes.public ? <img src={logo} className="message-user-avatar"/> : <></>}
                    
                    <span className="my-message-wrapper-wrapper">
                        {images?.length !== 0 ? (
                            <div className="message-attachments" onClick={handleClickOnImages}>
                                {images.map(el => (
                                    <img src={el} style={{width: images.length === 1 ? '100%' : '50%'}}/>
                                ))}
                            </div>
                        ) : (<></>)}

                        {songs?.length !== 0 ? (
                            <div className="tracks">
                                {songs.map((index, el) => (
                                    <Song
                                        id={el.id} key={index}
                                        name={el.name}
                                        isAttachedToMessage={true}
                                        artist={el.authorName}
                                        />
                                ))}
                            </div>
                        ) : (<></>)}

                        <span className="opponent-message" key={messageId}>
                            {shortenText(text, 550)}
                            <p>{formatTime(sentAt)}</p>
                        </span>
                    </span>
                </div>
            )
    }
}

export default Message;