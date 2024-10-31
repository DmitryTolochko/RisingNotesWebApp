import { createSlice } from '@reduxjs/toolkit'

const isPlaying = false;
const initialState = {
    value:isPlaying
}

export const musicIsPlayingSlice = createSlice({
    name:'musicIsPlayingSlice',
    initialState,
    reducers:{
        updateMusicIsPlayingValue: (state, action) =>{
            state.value = action.payload
        }
    }
})

export const {updateMusicIsPlayingValue} = musicIsPlayingSlice.actions

export default musicIsPlayingSlice.reducer