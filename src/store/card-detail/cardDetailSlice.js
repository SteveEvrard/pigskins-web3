import { createSlice } from '@reduxjs/toolkit';

export const cardDetailSlice = createSlice({

    name: 'cardDetail',
    initialState: {
        value: {}
    },
    reducers: {
        setCardDetail: (state, action) => {
            state.value = action.payload
        }
    }

});

export const { setCardDetail } = cardDetailSlice.actions;

export default cardDetailSlice.reducer;