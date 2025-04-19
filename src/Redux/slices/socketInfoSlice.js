import { createSlice } from '@reduxjs/toolkit'
import { ChatTypes } from '../../Pages/Messenger/Messenger';
import { useCookies } from 'react-cookie';

const saved = localStorage.getItem('NOTIFICATIONS');
const valid = saved === null ? [] : JSON.parse(saved);

export const NotificationTypes = {
    message: 1,
    songRequest: 2
}

const initialState = {
    recentChats: [],
    recentChatsFiltered: [],
    currentChatMessages: [],
    notifications: [],
    chatInfo: undefined,
    isChatSettingsVisible: false,
    isModalContactsVisibe: false,
    isCreatingNewChat: false,
    chatMemberList: [],
    chatImages: undefined,
    isModalSongsVisible: false,
    attachedSongs: []
}

export const socketInfoSlice = createSlice({
    name:'socketInfo',
    initialState,
    reducers:{
        updateRecentChats: (state, action) =>{
            state.recentChats = action.payload;
        },
        updateRecentFilteredChats: (state, action) =>{
            state.recentChatsFiltered = action.payload;
        },
        updateCurrentChatMessages: (state, action) =>{
            state.currentChatMessages = action.payload;
        },
        updateNotifications: (state, action) =>{
            let list = state.notifications;
            if (action.payload.type === NotificationTypes.message) {
                list.unshift({
                    type: action.payload.type,
                    id: action.payload.id, 
                    message: action.payload.message, 
                    userName: action.payload.userName, 
                    userId: action.payload.userId,
                    logoFileLink: action.payload.logoFileLink,
                    unreadCount: action.payload.unreadCount});
            } else if (action.payload.type === NotificationTypes.songRequest) {
                list.unshift({
                    type: action.payload.type,
                    id: action.payload.id, 
                    songName: action.payload.songName, 
                    logoFileLink: action.payload.logoFileLink,
                    status: action.payload.status,
                    prevStatus: action.payload.prevStatus});
            }
            
            state.notifications = list;
        },
        clearNotification: (state, action) => {
            let list = state.notifications.filter(a => a.id !== action.payload.id);
            state.notifications = list;
        },
        updateChatInfo: (state, action) => {
            state.chatInfo = action.payload;
        },
        updateIsChatSettingsVisible: (state, action) => {
            state.isChatSettingsVisible = action.payload;
        },
        updateIsModalContactsVisibe: (state, action) => {
            state.isModalContactsVisibe = action.payload;
        },
        updateIsCreatingNewChat: (state, action) => {
            state.isCreatingNewChat = action.payload;
            state.chatMemberList = [];
        },
        updateChatMemberList: (state, action) => {
            if (action.payload === undefined) {
                state.chatMemberList = []
            } else {
                state.chatMemberList = action.payload
            }
            
        },
        updateChatImages: (state, action) => {
            state.chatImages = action.payload;
        },
        updateIsModalSongsVisibe: (state, action) => {
            state.isModalSongsVisible = action.payload;
        },
        updateAttachedSongs: (state, action) => {
            state.attachedSongs = action.payload;
        },
    }
})

export const {
    updateRecentChats, 
    updateRecentFilteredChats, 
    updateCurrentChatMessages, 
    updateNotifications,
    clearNotification,
    updateChatInfo,
    updateIsChatSettingsVisible,
    updateIsModalContactsVisibe,
    updateIsCreatingNewChat,
    updateChatMemberList,
    updateChatImages,
    updateIsModalSongsVisibe,
    updateAttachedSongs} = socketInfoSlice.actions

export default socketInfoSlice.reducer