import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/accountSlice';
import cardDetailReducer from './card-detail/cardDetailSlice';
import mobileReducer from './device/deviceSlice';

export default configureStore({  
    reducer: {
        account: accountReducer,
        cardDetail: cardDetailReducer,
        mobile: mobileReducer
    },
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())