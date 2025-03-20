import { axiosUnauthorized } from "../Components/App/App";

export const getGenres = async () =>{
    let list = [];
    await axiosUnauthorized.get('api/common-data/genre/list')
    .then(response => {list = response.data.genreList})
    .catch(err => {list = []});

    return list;
}

export const getLanguages = async () =>{
    let list = [];
    await axiosUnauthorized.get('api/common-data/language/list')
    .then(response => {list = response.data.languageList})
    .catch(err => {list = []});

    return list;
}

export const getMoods = async () =>{
    let list = [];
    await axiosUnauthorized.get('api/common-data/vibe/list')
    .then(response => {list = response.data.vibeList})
    .catch(err => {list = []});

    return list;
}