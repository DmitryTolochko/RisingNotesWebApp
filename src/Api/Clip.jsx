import { axiosAuthorized, axiosUnauthorized } from "../Components/App/App";

export async function getClipPreview(clipId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'music-clip';

    let response = await axiosUnauthorized.get(`api/${routePath}/` + clipId + '/preview/link')
    .catch(err => Promise.reject(err));

    return response?.data?.presignedLink;
}

export async function getClipFile(clipId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'music-clip';

    let response = await axiosUnauthorized.get(`api/${routePath}/` + clipId + '/file/link')
    .catch(err => Promise.reject(err));

    return response?.data?.presignedLink;
}

export async function getClipViews(clipId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'music-clip';
    let count = 0;
    let response = await axiosUnauthorized.get(`api/${routePath}/${clipId}/view/count`)
    .catch(err => {count = 0});

    if (response) {
        count = response?.data.auditionCount;
    }
    return count;
}

export async function addClipViews(clipId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'music-clip';
    await axiosAuthorized.patch(`api/${routePath}/${clipId}/view/count`);
}

export async function getClipInfo(clipId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'music-clip';

    let result = {};
    let response = await axiosUnauthorized.get(`api/${routePath}/${clipId}`)
    .catch(err => Promise.reject(err));

    if (response)
        result = response.data;

    return result;
}