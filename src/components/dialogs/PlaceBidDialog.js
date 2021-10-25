import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayDialog, setPrice } from '../../store/view-card/viewCardSlice';
import { ContractWithSigner, signer } from '../../ethereum/ethers';
import { BigNumber, ethers } from "ethers";
import AlertMessage from './AlertMessage';
import { setCardDetail } from '../../store/card-detail/cardDetailSlice';

const PlaceBidDialog = ( { mobile } ) => {
    
    const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
    const desktopStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '1vw'};
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();
    const card = useSelector((state) => state.cardDetail.value.card);
    const price = useSelector((state) => state.viewCard.value.price);
    const initialPrice = ethers.utils.formatEther(BigNumber.from(card.currentBid));
    console.log(initialPrice);
    const [processing, setProcessing] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(setPrice(initialPrice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePriceChange = (event) => {
        dispatch(setPrice(event.target.value));
    };

    const handleClose = () => {
        dispatch(setDisplayDialog(false));
        dispatch(setCardDetail(card));
        setError('');
    };

    function getHelperMessage() {
        return price <= initialPrice ? 'Price must be higher than current bid' : '';
    }

    const placeBid = async () => {
        setProcessing(true);

        const account = await getAccount();
        const bid = ethers.utils.parseUnits(price.toString());
        const cardId = BigNumber.from(card.cardId).toNumber();

        ContractWithSigner.placeBid(cardId, {from: account, value: bid})
            .then(() => {
                setProcessing(false);
                setComplete(true);
            })
            .catch(err => {
                console.log(err);
                setProcessing(false);
                setComplete(true);
                setError('Error! Please try again.');
                if(err.error) setError(err.error.message);
            })
    }

    return (
        <Dialog PaperProps={{style: mobile ? {minWidth: '80vw'} : {width: '30vw'}}} open={true}>
            <DialogTitle sx={{backgroundColor: '#fff', color: 'black', textAlign: 'center'}}>Place Bid</DialogTitle>
            <DialogContent sx={{backgroundColor: '#fff', paddingTop: '20px !important'}}>
                { complete ? 
                <AlertMessage successMessage='Bid Placed! Processing Now!' error={error} mobile={mobile} />
                :
                processing ? 
                <div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='primary' /></div>
                :
                <div>
                    <TextField
                        autoFocus
                        inputProps={{step: 0.01}}
                        error={ price <= initialPrice }
                        color='selected'
                        margin='dense'
                        helperText={getHelperMessage()}
                        id='name'
                        label='Price (ETH)'
                        type='number'
                        fullWidth
                        variant='outlined'
                        value={price}
                        onChange={handlePriceChange}
                    />
                    <div style={mobile ? mobileStyle : desktopStyle}>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button disabled={price <= initialPrice} style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={placeBid} size='large' variant='contained'>Bid</Button></div>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button style={{color: 'black', backgroundColor: 'lightgrey', fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={handleClose} size='large' variant='contained'>Cancel</Button></div>
                    </div>
                </div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default PlaceBidDialog;