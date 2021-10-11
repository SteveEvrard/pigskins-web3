import { createSlice } from '@reduxjs/toolkit';

export const notificationDlice = createSlice({

    name: 'notification',
    initialState: {
        value: false
    },
    reducers: {
        setNotification: (state, action) => {
            state.value = action.payload
        }
    }

});

export const { setNotification } = notificationDlice.actions;

export default notificationDlice.reducer;