import { createSlice } from '@reduxjs/toolkit'

const saved = localStorage.getItem('CURR_QUEUE');
const valid = saved ? JSON.parse(saved) : '';
const initialState = {
    isVisible: false,
    currentQueue: valid
}

export const playerQueueSlice = createSlice({
    name:'playerQueue',
    initialState,
    reducers:{
        updatePlayerQueueName: (state, action) =>{
            state.currentQueue = action.payload
        },
        updatePlayerQueueVisibility: (state, action) =>{
            state.isVisible = action.payload
        }
    }
})

export const {updatePlayerQueueName, updatePlayerQueueVisibility} = playerQueueSlice.actions

export default playerQueueSlice.reducer