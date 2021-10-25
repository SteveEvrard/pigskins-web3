import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({

    name: 'ui',
    initialState: {
        value: false
    },
    reducers: {
        setDisplayCards: (state, action) => {
            state.value = action.payload
        }
    }

});

export const { setDisplayCards } = uiSlice.actions;

export default uiSlice.reducer;