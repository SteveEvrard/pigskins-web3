import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/accountSlice';
import cardDetailReducer from './card-detail/cardDetailSlice';
import mobileReducer from './device/deviceSlice';
import notificationReducer from './notification/notificationSlice';
import auctionDetailReducer from './auction-detail/auctionSlice';
import viewCardReducer from './view-card/viewCardSlice';
import gameReducer from './games/gameSlice';
import uiReducer from './ui/uiSlice';
import cardFilterReducer from './card-filter/cardFilterSlice';

export default configureStore({  
    reducer: {
        account: accountReducer,
        cardDetail: cardDetailReducer,
        mobile: mobileReducer,
        notification: notificationReducer,
        auction: auctionDetailReducer,
        viewCard: viewCardReducer,
        game: gameReducer,
        ui: uiReducer,
        cardFilter: cardFilterReducer
    },
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())