import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';

let initialState = {
    errorText: '',
    errorVisibility: false
}

export const errorMessageSlice = createSlice({
    name:'errorMessageSlice',
    initialState,
    reducers:{
        showError: (state, action) => {
            state.errorText = action.payload.errorText
            state.errorVisibility = true
        },
        hideError: (state) => {
            state.errorText = ''
            state.errorVisibility = false
        }
    }
})

export const { showError, hideError } = errorMessageSlice.actions

export default errorMessageSlice.reducer