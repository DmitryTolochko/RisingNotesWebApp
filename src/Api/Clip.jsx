import { axiosAuthorized, axiosUnauthorized } from "../Components/App/App";

export async function getClipPreview(clipId) {
    let response = await axiosUnauthorized.get('api/music-clip/' + clipId + '/preview/link')
    .catch(err => Promise.reject(err));

    return response?.data?.presignedLink;
}

export async function getClipFile(clipId) {
    let response = await axiosUnauthorized.get('api/music-clip/' + clipId + '/file/link')
    .catch(err => Promise.reject(err));

    return response?.data?.presignedLink;
}

export async function getClipViews(clipId) {
    let count = 0;
    let response = await axiosUnauthorized.get(`api/music-clip/${clipId}/view/count`)
    .catch(err => {count = 0});

    if (response) {
        count = response?.data.auditionCount;
    }
    return count;
}

export async function addClipViews(clipId) {
    await axiosAuthorized.patch(`api/music-clip/${clipId}/view/count`);
}