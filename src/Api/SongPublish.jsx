import { axiosAuthorized } from "../Components/App/App";

export async function getSongRequestsListForReview() {
    let list = [];
    let response = await axiosAuthorized.get(`api/song/upload-request/list/for-review`)
    .catch(err => {list = []});

    if (response) {
        list = response?.data.publishRequestShortInfoList;
    }
    return list;
}

export async function getSongRequestInfo(id) {
    let response = await axiosAuthorized.get('/api/song/upload-request/' + id);
    return response?.data;
}

export async function getSongRequestsList() {
    let list = [];
    let response = await axiosAuthorized.get(`api/song/upload-request/list`)
    .catch(err => {list = []});

    if (response) {
        list = response?.data.publishRequestShortInfoList;
    }
    return list;
}

export async function createNewSongRequest(name, lyrics, isLyricsExist, duration, vibe, genre, role, songfile, logofile, gender, language, coAuthors=[]) {
    let formData = new FormData();

    formData.append('Name', name);
    formData.append('Lyrics', lyrics);
    formData.append('Instrumental', isLyricsExist);
    formData.append('DurationMsec', duration);

    vibe.forEach((item, index) => {
        formData.append(`VibeList[${index}]`, item);
    });

    if (isLyricsExist)
    language.forEach((item, index) => {
        formData.append(`LanguageList[${index}]`, item);
    });
    
    genre.forEach((item, index) => {
        formData.append(`GenreList[${index}]`, item);
    });
    formData.append('VocalGenderList', gender);

    if (!(role === "authoredit" && typeof songfile === 'string')) {
        formData.append('SongFile.File', songfile);
    }

    formData.append('LogoFile.File', logofile);

    coAuthors.forEach((item, index) => {
        formData.append(`FeaturedAuthorIdList[${index}]`, item.id);
    })

    return await axiosAuthorized.post(`/api/song/upload-request`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
    .then(response => {return response.data.id})
    .catch(err => {return Promise.reject(err)});
}

export async function changeSongRequestStatus(status, comment, songRequestId) {
    await axiosAuthorized.patch(`/api/song/upload-request/${songRequestId}/admin`, {
        status: status, 
        comment: comment
    }).catch(err => console.log(err));
}

export async function deleteSongRequest(songRequestId) {
    await axiosAuthorized.delete(`api/song/upload-request/` + songRequestId)
    .catch(err => console.log(err));
}

export async function answerSongRequestAsCoAuthor(requestId, isAccepted) {
    await axiosAuthorized.post(`api/song/upload-request/${requestId}/featured-author/${isAccepted}`)
    .catch(err => {return Promise.reject(err)});
}

export async function sendSongRequestToReview(requestId) {
    await axiosAuthorized.patch(`api/song/upload-request/${requestId}/review`)
    .catch(err => {return Promise.reject(err)});
}