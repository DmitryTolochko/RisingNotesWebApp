import { createSlice } from '@reduxjs/toolkit'

let saved = localStorage.getItem('PLAYLISTS')
let valid = []
if (saved !== "undefined") {
    valid = JSON.parse(saved) 
}
const initialState = {
    value:valid
}

export const playlistsSlice = createSlice({
    name:'playlists',
    initialState,
    reducers:{
        updatePlaylistsValue: (state, action) =>{
            state.value = action.payload
        }
    }
})

export const {updatePlaylistsValue} = playlistsSlice.actions

export default playlistsSlice.reducer