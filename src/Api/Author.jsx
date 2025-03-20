import { axiosPictures, axiosUnauthorized } from "../Components/App/App";
import defaultAvatar from '../Images/main-placeholder.png';

export async function getAuthorInfo(authorId=undefined, authorName=undefined) {
    let info = undefined;
    if (authorId) {
        await axiosUnauthorized.get(`api/author/${authorId}`)
        .then(response => info = response.data)
        .catch(err => {info = undefined});
    } else if (authorName) {
        await axiosUnauthorized.get(`api/author/${authorName}`)
        .then(response => info = response.data)
        .catch(err => {info = undefined});
    }
    return info;
}

export async function getAuthorSongs(authorId, count=0, offset=0) {
    let response = await axiosUnauthorized.get(`api/author/${authorId}/song/list`  + (count == 0 ? '' : `?count=${count}&offset=${offset}`))
    .catch(err => {
        throw err;
    })
    let result = response?.data.songInfoList;
    return result;
}

export async function getAuthorLogo(authorId) {
    let response = await axiosPictures.get('api/author/' + authorId + '/logo/link')
    .catch(err => console.log(err));

    if (response?.status === 200) {
        return response?.data?.presignedLink;
    } else {
        return defaultAvatar;
    }
}