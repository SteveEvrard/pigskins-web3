import React, { useEffect, useState } from 'react';
import { signer, Contract } from "../ethereum/ethers";
import { Alert, Button, Slide, Snackbar } from '@mui/material';
import CardPack from '../components/CardPack';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayCards } from '../store/ui/uiSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const AlertMessage = ( props ) => {


    const dispatch = useDispatch();
    const isMobile = useSelector((state) => state.mobile.value);
    const displayCards = useSelector((state) => state.ui.value);
    const [message, setMessage] = useState('Success');
    const [open, setOpen] = useState(false);
    const [displayCardsButton, setDisplayCardsButton] = useState(false);

    useEffect(() => {
        listenForContractEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleClose = () => {
        setOpen(false);
    }

    const handleDisplayCards = () => {
        setOpen(false);
        dispatch(setDisplayCards(true));
    }

    const listenForContractEvents = async () => {
        const account = await signer.getAddress();
        listenForPurchase(account);
    }
    
    const listenForPurchase = (acct) => {
        Contract.on(Contract.filters.CardPackPurchased(acct), () => {
            setMessage('Pack Purchased Successfully');
            setOpen(true);
            setDisplayCardsButton(true);
        });
    }

    return (
        <div>
            <Snackbar ContentProps={{height: '10vw'}} TransitionComponent={SlideTransition} onClose={handleClose} autoHideDuration={5000} open={open} anchorOrigin={{horizontal: 'center', vertical: isMobile ? 'top' : 'bottom'}}>
                <Alert icon={<CheckCircleOutlineIcon fontSize={isMobile ? '' : 'large'} />} variant='filled' sx={{fontSize: isMobile ? '4vw' : '2vw', width: isMobile ? '100vw' : '60vw', marginTop: '1vw'}} severity='success'>
                    <div style={isMobile ? {width: '100%', display: 'flex', justifyContent: 'space-between'} : {}}>
                        <div style={isMobile ? {position: 'absolute', top: '5vw'} : {}}>{message}</div>
                        {displayCardsButton ? <Button onClick={handleDisplayCards} sx={{width: isMobile ? '' : '10vw', position: 'absolute', right: '3vw', top: isMobile ? '2.5vw' : '2vw'}} variant='contained'>View</Button> : null}
                    </div>
                </Alert>
            </Snackbar>
            {displayCards ? <CardPack/> : null}
        </div>
    )
}

export default AlertMessage;