import { axiosAuthorized } from "../Components/App/App";

export async function deleteClipComment(commentId) {
    await axiosAuthorized.delete(`api/music-clip/comment/${commentId}`);
}

export async function sendClipComment(clipId, text) {
    await axiosAuthorized.post(`api/music-clip/${clipId}/comment`, {text: text})
    .catch(err => {
        console.log(err);
        throw err;
    })
}