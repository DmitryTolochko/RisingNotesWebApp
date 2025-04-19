import { axiosAuthorized, axiosPictures, axiosUnauthorized } from "../Components/App/App";
import cover from '../Images/main-placeholder.png';

export async function getSongInfo(songId=undefined, fileId=undefined) {
    // Получить информацию о песне по ее id или по id файла
    if (songId) {
        let response = await axiosUnauthorized.get(`/api/song/${songId}`)
        .catch(err => {console.log(err)});

        return response?.data;
    } else if (fileId) {
        let response = await axiosUnauthorized.get(`/api/song/by-file/${fileId}`)
        .catch(err => {console.log(err)});

        return response?.data;
    }
}

export async function addSongToFavorite(songId) {
    await axiosAuthorized.patch(`api/song/favorite/${songId}`);
}

export async function deleteSongFromFavorite(songId) {
    await axiosAuthorized.delete(`api/song/favorite/${songId}`);
}

export async function addSongToExcluded(songId) {
    await axiosAuthorized.post(`api/song/excluded-track/${songId}`);
}

export async function deleteSongFromExcluded(songId) {
    await axiosAuthorized.delete(`api/song/excluded-track/${songId}`);
}


export async function getSongLogo(songId) {
    let avatar = undefined;
    let response = await axiosPictures.get('api/song/' + songId + '/logo/link')
    .catch(err => {avatar = cover});

    if (response) {
        avatar = response?.data?.presignedLink;
    }
    return avatar;
}

export async function addSongAudition(songId) {
    await axiosUnauthorized.patch('api/song/' + songId + '/audition/count');
}

export async function getSongFile(songId) {
    let link = '';
    await axiosUnauthorized.get(`api/song/${songId}/file/link`).then(response => {
        link = response.data.presignedLink;
    })
    .catch(err => {link = ''});    

    return link;
}