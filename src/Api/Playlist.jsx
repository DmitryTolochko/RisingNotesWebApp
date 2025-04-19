import { axiosAuthorized, axiosUnauthorized } from "../Components/App/App";

export async function getPublicPlaylists(userId, count, offset) {
    let response = await axiosUnauthorized.get(`api/playlist/list/${userId}?count=${count}&offset=${offset}`)
    .catch(err => Promise.reject(err));

    if (response) {
        return response.data.playlistInfoList;
    } else {
        return [];
    }
}

export async function getPlaylistsForUser() {
    let response = await axiosAuthorized.get(`api/playlist/list/self`)
    .catch(err => Promise.reject(err));

    if (response) {
        return response.data.playlistInfoList;
    } else {
        return [];
    }
}

export async function getGeneratedplaylists() {
    let response = await axiosAuthorized.get(`api/playlist/generated/list`)
    .catch(err => Promise.reject(err));

    if (response) {
        return response.data.generatedPlaylistList;
    } else {
        return [];
    }
}

export async function makeGeneratedPlaylistPublic(playlistId) {
    await axiosAuthorized.post(`/api/playlist/generated/${playlistId}`)
    .catch(err => Promise.reject(err));
}

export async function changePlaylistPrivacy(playlistId, isPrivate) {
    await axiosAuthorized.patch(`/api/playlist/${playlistId}`, {
        isPrivate: isPrivate
    })
    .catch(err => Promise.reject(err));
}

export async function createNewPlaylist(name='Новый плейлист', isAdmin=false) {
    let formData = new FormData();
    formData.append('Name', name);
    let route = isAdmin ? 'api/playlist/generated' : 'api/playlist';
    let response = await axiosAuthorized.post(route, formData, { headers: {
        "Content-Type": "multipart/form-data",
    }})
    .catch(err => Promise.reject(err));

    if (response)
        return response.data.id;
}