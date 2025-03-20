import axios from "axios";
import { api } from "../../App/App";
import SearchResults from "../SearchResults";

export async function fetchInput(input){
    let searchResult = {
        artists:{
            id:undefined,
            name: undefined,
            about: undefined,
            vkLink: undefined,
            yaMusicLink: undefined,
            webSiteLink: undefined,
            pfp:undefined
        },
        tracks: undefined,
        playlists: undefined,
        clips: undefined,
        verticals:undefined
    }

    searchResult.artists = await fetchArtists(input)
    searchResult.tracks = await fetchTracks(input)
    searchResult.playlists = await fetchPlaylists(input)
    searchResult.clips = await fetchClips(input)
    searchResult.verticals = await fetchVerticals(input)
    return searchResult
}

export async function fetchArtists(input){
    if(input == '')
        return
    
    try{
        const response = await axios({
            method:'GET',
            url: api + 'api/author/list/?NameWildcard='+input,
            responseType: 'application/json',
        })
        return JSON.parse(response.data).authorList
    }
    catch(err){
        console.log('Something wrong occured when trying to fetch artist data');
    }
}

export async function fetchTracks(input) {
    if (input === '') return [];
    
    const cache = new Map();
    
    const fetchWithCache = async (searchTerm, searchType) => {
        const cacheKey = `${searchType}_${searchTerm}`;
        
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        
        try {
            const response = await axios({
                method: 'GET',
                url: api + `api/song/list?${searchType}=${encodeURIComponent(searchTerm)}`,
                responseType: 'application/json',
            });
            
            const result = JSON.parse(response.data).songList;
            cache.set(cacheKey, result);
            return result;
        } catch (err) {
            console.error(`Ошибка при поиске ${searchType}:`, err);
            return [];
        }
    };
    
    try {
        const songResults = await fetchWithCache(input, 'NamePart');
        const artistResults = await fetchWithCache(input, 'AuthorNamePart');
        
        const combinedResults = [...new Set([...songResults, ...artistResults])];
        return combinedResults;
    } catch (err) {
        console.error('Произошла ошибка при получении данных:', err);
        return [];
    }
}

async function fetchPlaylists(input){
    if(input == '')
        return 

    try{
        const response = await axios({
            method:'GET',
            url: api + `api/playlist/list?NamePart=${input}`,
            responseType: 'application/json',
        })
        const result = JSON.parse(response.data).playlistList
        return result
    }
    catch(err){
        console.log('Something wrong occured when trying to fetch clips data');
    }
}

async function fetchClips(input){
    if(input == '')
        return 

    try{
        const response = await axios({
            method:'GET',
            url: api + `api/music-clip/list?nameWildcard=${input}`,
            responseType: 'application/json',
        })
        const result = JSON.parse(response.data).musicClipList
        return result
    }
    catch(err){
        console.log('Something wrong occured when trying to fetch clips data');
    }
}

async function fetchVerticals(input){
    if(input == '')
        return 

    try{
        const response = await axios({
            method:'GET',
            url: api + `api/short-video/list?nameWildcard=${input}`,
            responseType: 'application/json',
        })
        const result = JSON.parse(response.data).shortVideoList
        return result
    }
    catch(err){
        console.log('Something wrong occured when trying to fetch vertical videos data');
    }
}

