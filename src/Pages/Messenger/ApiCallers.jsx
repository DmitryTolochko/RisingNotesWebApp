import { axiosAuthorized } from "../../Components/App/App";

export async function createNewChat(name, chatType, members, logoFile=undefined) {
    // Создать новый чат, вернуть id
    let data = new FormData();
    if (name !== undefined)
        data.append('ChatName', name);

    data.append('ChatType', chatType);
    if (logoFile !== undefined) {
        data.append('LogoFile.File', logoFile);
    }
    members.forEach((item, index) => {
        data.append(`MemberIdList[${index}]`, item);
    });
    
    let response = await axiosAuthorized.post('api/chat', data, { headers: {
        "Content-Type": "multipart/form-data",
    }})
    .catch(err => console.log(err));

    return response?.data?.id;
}

export async function getChatMembers(chatId) {
    // Получить список участников чата
    let response = await axiosAuthorized.get(`api/chat/${chatId}/member/list`)
    .catch(err => console.log(err));

    return response?.data?.chatMemberList;
}

export async function sendMessage(chatId, text, files=[], songs=[]) {
    // Отправить сообщение, если есть текст. Если не создан чат, создать чат.
    if ((text !== undefined && text !== '') || files?.length !== 0 || songs?.length !== 0) {
        let data = new FormData();
        data.append('ChatId', chatId);
        if (text !== undefined)
            data.append('Text', text);
        files.map(file => {
            data.append('AttachmentList', file);
        })
        songs.map(song => {
            data.append('SongIdList', song.id);
        })
        await axiosAuthorized.post('api/chat-message', data, { headers: {
            "Content-Type": "multipart/form-data",
        }})
        .catch(err => console.log(err));
    }
}

export async function getRecentChatsList() {
    // Получить существующие чаты и вернуть списком
    let response = await axiosAuthorized.get('api/chat/list')
    .catch(err => {window.location.replace('/')});

    if (response === undefined) {window.location.replace('/')}
    return response?.data?.chatList;
}

export async function changeChatName(chatId, chatName) {
    // Изменить название чата
    let response = await axiosAuthorized.put(`api/chat/${chatId}/name`, {
        newName: chatName
    });
}

export async function changeChatLogo(chatId, chatLogo) {
    // Изменить аватар чата
    let data = new FormData();
    data.append('LogoFile.File', chatLogo);
    let response = await axiosAuthorized.put(`api/chat/${chatId}/logo`, data, { headers: {
        "Content-Type": "multipart/form-data",
    }});
}

export async function addUsersToChat(chatId, members) {
    // Добавить новых пользователей в чат
    let userIdList = [];
    members.map(async member => {
        userIdList.push(member.userId);
    });

    await axiosAuthorized.post(`api/chat/${chatId}/member`, {
        userIdList: userIdList
    })
}

export async function deleteUsersFromChat(chatId, members) {
    // Добавить новых пользователей в чат
    await Promise.all(members
    .map(async member => {
        await axiosAuthorized.delete(`api/chat/${chatId}/member/${member.userId}`)
        .catch(err => console.log(err));
    }));
}

export async function getChatInfo(id) {
    // Получить общую информацию о чате
    let response = await axiosAuthorized.get('api/chat/' + id)
    .catch(err => console.log(err));

    return response?.data;
}

export async function getUserInfo(id) {
    // Получить информацию о пользователе
    let response = await axiosAuthorized.get('api/user/' + id)
    .catch(err => console.log(err));

    return response?.data;
}

export async function getMessages(chatId, count, offset, oldMessages=[], toEnd=false) {
    let response = await axiosAuthorized.get(`api/chat-message/${chatId}/list?count=${count}&offset=${offset}`)
        .catch(err => {return undefined});

    if (toEnd) {
        let newList = [...oldMessages];
        if (response) {
            response?.data?.messageList?.map(el => newList.unshift(el));
        }
        return newList;
    }

    let newList = oldMessages.concat(...response?.data?.messageList);
    return newList;
}

export async function getUnreadCount(chatId) {
    // получить количество непрочитанных сообщений одного чата
    let response = await axiosAuthorized.get(`api/chat-message/${chatId}/unread/count`)
    .catch(err => {return undefined})

    if (response) return response.data.unreadMessageCount;
    else return 0;
}

export async function getChatInfoForUser(userId) {
    let response = await axiosAuthorized.get('api/chat/private/' + userId)
    .catch(err => console.log(err));

    return response?.data;
}