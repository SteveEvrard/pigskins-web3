import { createSlice } from '@reduxjs/toolkit';

export const viewCardSlice = createSlice({

    name: 'viewCard',
    initialState: {
        value: {
            displayDialog: false,
            price: 0.01,
            time: 3600
        }
    },
    reducers: {
        setDisplayDialog: (state, action) => {
            state.value.displayDialog = action.payload
        },
        setPrice: (state, action) => {
            state.value.price = action.payload
        },
        setAuctionTime: (state, action) => {
            state.value.time = action.payload
        },
    }

});

export const { setDisplayDialog } = viewCardSlice.actions;
export const { setPrice } = viewCardSlice.actions;
export const { setAuctionTime } = viewCardSlice.actions;

export default viewCardSlice.reducer;