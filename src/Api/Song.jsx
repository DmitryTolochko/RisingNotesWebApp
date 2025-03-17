import { axiosUnauthorized } from "../Components/App/App";

export async function getSongInfo(songId=undefined, fileId=undefined) {
    if (songId) {
        let response = await axiosUnauthorized.get(`/api/song/${songId}`);

        return response?.data;
    } else if (fileId) {
        let response = await axiosUnauthorized.get(`/api/song/by-file/${fileId}`);

        return response?.data;
    }
    
}