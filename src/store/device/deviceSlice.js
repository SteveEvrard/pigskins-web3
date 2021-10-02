import { createSlice } from '@reduxjs/toolkit';

export const mobileSlice = createSlice({

    name: 'mobile',
    initialState: {
        value: false,
    },
    reducers: {
        setMobile: (state, action) => {
            state.value = action.payload
        }
    }

});

export const { setMobile } = mobileSlice.actions;

export default mobileSlice.reducer;