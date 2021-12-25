import React from 'react';
import { Button } from '@mui/material';
import { setDisplayDialog, setPrice, setAuctionTime } from '../../store/view-card/viewCardSlice';
import { useDispatch } from 'react-redux';
import { setCardDetail, setDisplayCard } from '../../store/card-detail/cardDetailSlice';
import { setDisplayDialog as setDisplay } from '../../store/games/gameSlice';
import { useHistory } from 'react-router-dom';

const AlertMessage = ( { mobile, successMessage, error, shouldRoute } ) => {

    const dispatch = useDispatch();
    const history = useHistory();
    
    const handleClose = () => {
        dispatch(setDisplay(false));
        dispatch(setDisplayDialog(false));
        dispatch(setDisplayCard(false));
        dispatch(setCardDetail({}))
        dispatch(setPrice(0.01));
        dispatch(setAuctionTime(3600));
        if(shouldRoute) history.push('/games');
    };

    return (
        <div>
            { !error ? <h1 style={{textAlign: 'center', color: '#2e8b57', marginTop: 0, marginBottom: mobile ? '10vw' : '4vw'}}>{successMessage}</h1> : <div style={{textAlign: 'center', color: 'red', marginBottom: '3vw'}}>{error}</div> }
            <div style={{display: 'flex', justifyContent: 'center'}}><Button style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '30vw' : '10vw'}} onClick={handleClose} size='large' variant='contained'>Done</Button></div>
        </div> 
    )
}

export default AlertMessage;