import { axiosAuthorized, axiosUnauthorized } from "../Components/App/App";

export async function getClipRequestsListForReview(isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';
    let response = await axiosAuthorized.get(`api/${routePath}/upload-request/list/for-review`);
    if (response) {
        return response?.data?.publishRequestShortInfoList;
    }
}

export async function getClipRequestInfo(id, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';
    let response = await axiosAuthorized.get(`api/${routePath}/upload-request/` + id);
    if (response) {
        return response?.data;
    } else {
        return undefined;
    }
}

export async function getClipRequestsForAuthor(isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';
    let response = await axiosAuthorized.get(`api/${routePath}/upload-request/list`);
    if (response) {
        return response.data?.publishRequestShortInfoList;
    } else {
        return [];
    }
}

export async function getClipRequestPreview(id, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';
    let response = await axiosAuthorized.get(`api/${routePath}/upload-request/` + id + '/logo/link');
    if (response) {
        return response?.data.presignedLink;
    } else {
        return undefined;
    }
}

export async function getClipRequestFile(id, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';
    let response = await axiosUnauthorized.get(`api/${routePath}/upload-request/` + id + '/file/link')
    .catch(err => Promise.reject(err));

    return response?.data?.presignedLink;
}

export async function deleteClipRequest(id, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';
    await axiosAuthorized.delete(`api/${routePath}/upload-request/` + id);
}

export async function uploadClipFilePart(filePart, partNumber, isLast, uploadId, clipId, isShortVideo=false) {
    // загрузка куска видео
    let routePath = isShortVideo ? 'short-video' : 'clip';

    let formData = new FormData();
    formData.append('File', filePart);
    formData.append('UploadId', uploadId);
    formData.append('PartNumber', partNumber);
    formData.append('IsLastPart', isLast);
    await axiosAuthorized.post(`api/${routePath}/upload-request/` + clipId + '/file/upload-part', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .catch(err => {return Promise.reject(err)});
}

export async function createNewClipRequest(title, description, songId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';

    let formData = new FormData();
    formData.append('Name', title);
    formData.append('Description', description);
    if (songId)
        formData.append('SongId', songId);
    let id = await axiosAuthorized.post(`api/${routePath}/upload-request`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .then(response => {return response.data.id})
    .catch(err => {return Promise.reject(err)});
    
    return id;
}

export async function uploadClipLogo(imageFile, clipRequestId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';

    let formData = new FormData();
    formData.append('LogoFile', imageFile);
    formData.append('PublishRequestId', clipRequestId);

    await axiosAuthorized.patch(`api/${routePath}/upload-request/logo`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .catch(err => {return Promise.reject(err)});   
}

export async function startUploadClip(clipRequestId, fileExtension, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';

    let uploadId = await axiosAuthorized.post(`api/${routePath}/upload-request/` + clipRequestId + '/file/start-upload', {
        fileExtension: fileExtension
    })
    .then(response => {return response.data.uploadId})
    .catch(err => {return Promise.reject(err)});

    return uploadId;
}

export async function submitClipRequestForReview(title, description, clipRequestId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';

    let formData = new FormData();
    formData.append('Name', title);
    formData.append('Description', description);
    formData.append('SubmitForReview', true);

    await axiosAuthorized.patch(`api/${routePath}/upload-request/${clipRequestId}/author`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .catch(err => {return Promise.reject(err)});
}

export async function changeClipRequestStatus(status, comment, clipRequestId, isShortVideo=false) {
    let routePath = isShortVideo ? 'short-video' : 'clip';

    await axiosAuthorized.patch(`api/${routePath}/upload-request/${clipRequestId}/admin`, {
        status: status,
        comment: comment
    });
}