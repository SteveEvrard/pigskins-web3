import { createSlice } from '@reduxjs/toolkit';

export const auctionSlice = createSlice({

    name: 'auction',
    initialState: {
        value: []
    },
    reducers: {
        setAuction: (state, action) => {
            state.value = action.payload
        }
    }

});

export const { setAuction } = auctionSlice.actions;

export default auctionSlice.reducer;