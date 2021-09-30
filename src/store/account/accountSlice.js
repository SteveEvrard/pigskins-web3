import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({

    name: 'account',
    initialState: {
        value: ''
    },
    reducers: {
        setAccount: (state, action) => {
            state.value = action.payload
        }
    }

});

export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;