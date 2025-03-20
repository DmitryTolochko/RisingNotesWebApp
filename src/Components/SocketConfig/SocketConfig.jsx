import { HubConnectionBuilder } from "@microsoft/signalr";
import { useCookies } from "react-cookie";
import { api, axiosAuthorized, axiosRefresh } from "../App/App";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateChatInfo, updateCurrentChatMessages, updateNotifications, updateRecentChats, updateRecentFilteredChats } from "../../Redux/slices/socketInfoSlice";
import { getMessages, getUnreadCount } from "../../Api/Messenger";
import { jwtDecode } from "jwt-decode";

export default function SocketConfig() {
    const socketInfo = useSelector((state)=> state.socketInfo);
    const dispatch = useDispatch();
    const [cookies, setCookies] = useCookies(['accessToken', 'userId', 'refreshToken']);
    const navigate = useNavigate();
    const socketRef = useRef();

    const connection = new HubConnectionBuilder()
    .withUrl(api + 'messenger', {
        accessTokenFactory: async () => {
            if (cookies.accessToken && await isTokenExpired(cookies.accessToken)) {
                let response = await axiosRefresh.post('connect/token', {
                    client_id: 'Api',
                    client_secret: 'megaclientsecret',
                    grant_type: 'refresh_token',
                    refresh_token: cookies.refreshToken
                });
                setCookies('accessToken', response.data.access_token, { path: '/' });
                setCookies('refreshToken', response.data.refresh_token, { path: '/' });
            }
            return cookies.accessToken;
        },
    })
    .build();

    async function isTokenExpired(accessToken) {
        let decoded = jwtDecode(accessToken);
        return decoded.exp > new Date().getTime() / 1000;
    }

    async function configSocket() {
        // соединение с сокетом
            
        async function start() {
            try {
                if (cookies.accessToken) {
                    await connection.start();
                    await getRecentChats(true);
                    console.log("SignalR Connected.");
                }
            } catch (err) {
                console.log(err);
                setTimeout(start, 5000);
            }
        };
        
        connection.onclose(async () => {
            await start();
        });

        connection.on('onNewMessage', async (thisChatId, preparedMessage, userName) => {
            if (thisChatId === socketRef.current.chatInfo.id)
                await getLastMessage(thisChatId, socketRef.current.currentChatMessages);
            else {
                await getMessageForNotifications(thisChatId, preparedMessage, userName);
            }
            await getRecentChats();
        })

        connection.on('onError', (errorText) => {
            console.log(errorText);
        })

        connection.on('onMessageRead', (chatId, userId, messageId) => {
            console.log(userId);
        })
        await start();
    }

    async function getRecentChats(isInitialized=false) {
        // Получить существующие чаты
        let response = await axiosAuthorized.get('api/chat/list')
        .catch(err => {return undefined});

        if (response) {
            const list = response?.data?.chatList;
            dispatch(updateRecentChats(list));
            dispatch(updateRecentFilteredChats(list));
            if (isInitialized)
                await getAllUnreadCounts(list);
        }
    }

    async function getLastMessage(chatId, messages) {
        // Получить последнее сообщение в чате
        let newList = await getMessages(chatId, 1, 0, messages, true);
        dispatch(updateCurrentChatMessages(newList));
    }

    async function getMessageForNotifications(chatId, message, userName) {
        // Получить последнее непрочитанное сообщение
        let response = await axiosAuthorized.get(`api/chat-message/${chatId}/list?count=${1}&offset=${0}`)
            .catch(err => {return undefined});
        if (response) {
            dispatch(updateNotifications({
                id: chatId, 
                message: message, 
                userName: userName, 
                userId: response.data.messageList[0].senderId,
                unreadCount: 1}));
        }
    }

    async function getAllUnreadCounts(recentChats) {
        // получить количество непрочитанных сообщений для всех чатов
        let chats = await Promise.all(recentChats
        .map(async chat => {
            const newChat = { ...chat };
            if (newChat?.lastMessage?.readAt === null && newChat?.lastMessage?.senderId !== cookies.userId) {
                newChat.unreadCount = await getUnreadCount(newChat.id);
                dispatch(updateNotifications({
                    id: newChat.id, 
                    message: newChat.lastMessage.text, 
                    userName: newChat.chatName, 
                    logoFileLink: newChat.logoFileLink,
                    unreadCount: newChat.unreadCount}));
            }
        }));
    }

    useEffect(() => {
        socketRef.current = socketInfo;
    }, [socketInfo])

    useEffect(() => {
        configSocket();
    }, [])

    useEffect(() => {
        if (!window.location.href.includes('messenger')) {
            dispatch(updateChatInfo(undefined));
        }
    }, [window.location.href]);
}