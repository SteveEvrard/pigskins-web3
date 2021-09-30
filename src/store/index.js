import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/accountSlice';

export default configureStore({  
    reducer: {
        account: accountReducer
    },
})