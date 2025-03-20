import { axiosAuthorized, axiosUnauthorized } from "../Components/App/App";

export async function deleteSongComment(commentId) {
    await axiosAuthorized.delete(`api/song/comment/${commentId}`);
}

export async function sendSongComment(songId, text) {
    await axiosAuthorized.post(`api/song/${songId}/comment`, {text: text})
    .catch(err => {
        console.log(err);
        throw err;
    })
}

export async function getSongComments(songId) {
    let list = [];
    await axiosUnauthorized.get(`api/song/${songId}/comment/list`)
    .then(response => {
        let arr = response.data.commentList;
        arr.reverse();
        list = arr;
    })
    .catch(err=>{
        console.log(err);
    });

    return list;
}