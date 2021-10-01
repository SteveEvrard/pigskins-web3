import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/accountSlice';

export default configureStore({  
    reducer: {
        account: accountReducer
    },
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())