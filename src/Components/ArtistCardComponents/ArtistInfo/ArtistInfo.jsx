import "./ArtistInfo.css"
import subscribeIcon from '../../../Images/artist-card/User_Add.svg'
import subsIcon from '../../../Images/artist-card/Users.svg'
import linkIcon from '../../../Images/artist-card/Link.svg'
import vkIcon from '../../../Images/artist-card/Social Icons.svg'
import yandexIcon from '../../../Images/artist-card/yandex.svg'
import defaultAvatar from '../../../Images/main-placeholder.png'
import messageIcon from '../../../Images/controller/message.png';
import { useEffect, useState } from "react"
import { api, axiosAuthorized, axiosPictures } from "../../App/App"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { updateSubscriptionsValue } from "../../../Redux/slices/subscriptionsSlice"
import { getWordSpelling, shortenText } from "../../../Tools/Tools"
import { updateChatInfo } from "../../../Redux/slices/socketInfoSlice"
import { ChatTypes } from "../../../Pages/Messenger/Messenger"
import { getChatInfoForUser } from "../../../Pages/Messenger/ApiCallers"

function getSubsText(number) {
   return getWordSpelling(number, 'подписчик')
}

function ArtistInfo(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const artistName = props.artist.artistName
    const artistInfoText = props.artist.artistInfoText
    const resize = useSelector((state)=> state.resize.value)
    const subscriptions = useSelector((state)=> state.subscriptions.value)
    const [subcribersCount, setSubscribersCount] = useState(props.artist.subscribersCount);
    const site = props.artist.socialLinks.site
    const vk = props.artist.socialLinks.vk
    const yandex = props.artist.socialLinks.yandex;
    const userId = props.artist.userId;

    const params = useParams();
    const [isSubscribed, setIsSubscribed] = useState(undefined);
    const [avatar, setAavatar] = useState(defaultAvatar);

    useEffect(() => {
        // проверка наличия подписки
        checkIfSubscribed();
    }, [subscriptions]);

    useEffect(() => {
        // проверка наличия картинки
        axiosPictures.get(api + `api/user/${userId}/logo/link`)
        .then(response => setAavatar(response?.data?.presignedLink))
        .catch(err => {setAavatar(defaultAvatar)});

        setSubscribersCount(props.artist.subscribersCount);
    }, [props.artist])

    const handleSubscribe = async () => {
            // подписка
            await axiosAuthorized.post(api + `api/subscription/${props.artist.artistId}`)
            .then( r => {
                dispatch(updateSubscriptionsValue([...subscriptions, props.artist.artistId]))
                checkIfSubscribed();
                setSubscribersCount(subcribersCount + 1);
            })
            .catch(err => {console.log(err)});
        }
    
        const handleUnsubscribe = async () => {
            // отписка
            await axiosAuthorized.delete(api + `api/subscription/${props.artist.artistId}`)
            .then( r => {
                dispatch(updateSubscriptionsValue(subscriptions.filter(el => el != props.artist.artistId)))
                checkIfSubscribed();
                setSubscribersCount(subcribersCount - 1);
            })
            .catch(err => {console.log(err)});
        }

    function checkIfSubscribed() {
        setIsSubscribed(subscriptions.includes(props.artist.artistId));
    }
    
    async function handleClickOnMessage() {
        let info = {
            id: undefined,
            hostUserId: undefined,
            chatType: ChatTypes.private,
            chatName: artistName,
            photoLink: avatar,
            createdAt: undefined,
            userId: userId
        }
        let newInfo = await getChatInfoForUser(userId);
        if (newInfo) {
            info = newInfo;
        }
        dispatch(updateChatInfo(info));
        navigate(`/messenger`);
    }

    return(
        <div className="info-container">
            <img src={avatar} alt="" className="artist-img" draggable='false'/>
            <div className="artist-info">
                <div className="row-top">
                    <a className="artist-name" onClick={() =>  navigate(`/artist/${props.artist.artistId}`)}>{shortenText(artistName, 30)}</a>
                    <div className="artist-btns">
                    <button className="artist-message-btn" onClick={handleClickOnMessage} >
                        <img alt='message' src={messageIcon}/>
                        <span>Сообщение</span>
                    </button>
                    {isSubscribed ? (
                        <button className={"subscribe-btn"} onClick={handleUnsubscribe}>
                            <img src={subscribeIcon} alt="unsubscribe" draggable='false'/>
                            <span>Отписаться</span>
                        </button>
                    ) : (
                        <button className={"subscribe-btn-red"} onClick={handleSubscribe}>
                            <img src={subscribeIcon} alt="subscribe" draggable='false'/>
                            <span>Подписаться</span>
                        </button>
                    )}
                    </div>
                    
                </div>
                <div className="artist-status">
                    <img src={subsIcon} alt="" draggable='false'/>
                    Готов к коллабу
                </div>
                <div className="row-md">
                    <p className="artist-info-p">
                        {shortenText(artistInfoText, 550)}
                    </p>
                </div>
                <div className="row-bottom">
                    <div className="left">
                        <img src={subsIcon} alt="" draggable='false'/>
                        <span>{getSubsText(subcribersCount)}</span>
                    </div>
                    <div className="right">
                        {site.length > 0 ? 
                            <a className="site" href={site} target="_blank">
                                <img src={linkIcon} alt="" draggable='false'/>
                                <p>{resize === 'standart' ? 'Сайт' : ''}</p>
                            </a> : 
                        <></>}
                        {vk.length > 0 ? 
                            <a className="vk" href={vk} target="_blank">
                                <img src={vkIcon} alt="" draggable='false'/>
                                <p>{resize === 'standart' ? 'Вконтакте' : ''}</p>
                            </a> : 
                        <></>}
                        {yandex.length > 0 ? 
                            <a className="yandex" href={yandex} target="_blank">
                                <img src={yandexIcon} alt="" draggable='false'/>
                                <p>{resize === 'standart' ? 'Я.Музыка' : ''}</p>
                            </a>: 
                        <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtistInfo