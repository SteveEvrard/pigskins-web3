import { createSlice } from '@reduxjs/toolkit';

export const cardDetailSlice = createSlice({

    name: 'cardDetail',
    initialState: {
        value: {
            card: {},
            displayCard: false
        }
    },
    reducers: {
        setCardDetail: (state, action) => {
            state.value.card = action.payload
        },
        setDisplayCard: (state, action) => {
            state.value.displayCard = action.payload
        } 
    }

});

export const { setCardDetail } = cardDetailSlice.actions;
export const { setDisplayCard } = cardDetailSlice.actions;

export default cardDetailSlice.reducer;