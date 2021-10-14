import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayDialog, setPrice, setAuctionTime } from '../../store/view-card/viewCardSlice';
import { Contract, ContractWithSigner, signer } from '../../ethereum/ethers';
import { BigNumber, ethers } from "ethers";
import AlertMessage from './AlertMessage';
import { setCardDetail } from '../../store/card-detail/cardDetailSlice';

const CreateAuctionDialog = ( { mobile } ) => {
    
    const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
    const desktopStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '1vw'};
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();
    const card = useSelector((state) => state.cardDetail.value.card);
    const price = useSelector((state) => state.viewCard.value.price);
    const time = useSelector((state) => state.viewCard.value.time);
    const [processing, setProcessing] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');

    const handlePriceChange = (event) => {
        dispatch(setPrice(event.target.value));
    };
    const handleTimeChange = (event) => {
        dispatch(setAuctionTime(event.target.value));
    };
    const handleClose = () => {
        dispatch(setDisplayDialog(false));
        dispatch(setCardDetail(card));
        dispatch(setPrice(0.01));
        setError('');
    };
    function getHelperMessage() {
        return price <= 0 ? 'Price cannot be below 0' : '';
    }

    const createAuction = async () => {
        setProcessing(true);

        const account = await getAccount();
        const cardId = BigNumber.from(card.cardId).toNumber();
        const startingBid = ethers.utils.parseUnits(price.toString());

        ContractWithSigner.createCardAuction(cardId, startingBid, time, {from: account})
            .then(() => {
                Contract.once(Contract.filters.AuctionOpened(null, cardId), () => {
                    setProcessing(false);
                    setComplete(true);
                })
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
            <DialogTitle sx={{backgroundColor: '#fff', color: 'black', textAlign: 'center'}}>Create Auction</DialogTitle>
            <DialogContent sx={{backgroundColor: '#fff', paddingTop: '20px !important'}}>
                { complete ? 
                <AlertMessage successMessage='Auction Created!' error={error} mobile={mobile} />
                :
                processing ? 
                <div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='primary' /></div>
                :
                <div>
                    <TextField
                        autoFocus
                        inputProps={{step: 0.01}}
                        error={ price <= 0 }
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
                    <Select
                            color='selected'
                            sx={{marginTop: '1vw'}}
                            variant='outlined' 
                            fullWidth
                            value={time}
                            onChange={handleTimeChange}
                        >
                            <MenuItem value={300}>5 Minutes *Test Only*</MenuItem>
                            <MenuItem value={3600}>1 Hour</MenuItem>
                            <MenuItem value={7200}>2 Hours</MenuItem>
                            <MenuItem value={10800}>3 Hours</MenuItem>
                            <MenuItem value={21600}>6 Hours</MenuItem>
                            <MenuItem value={43200}>12 Hours</MenuItem>
                            <MenuItem value={86400}>1 Day</MenuItem>
                            <MenuItem value={172800}>2 Days</MenuItem>
                            <MenuItem value={259200}>3 Days</MenuItem>
                            <MenuItem value={604800}>1 Week</MenuItem>
                    </Select>
                    <div style={mobile ? mobileStyle : desktopStyle}>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button disabled={price <= 0} style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={createAuction} size='large' variant='contained'>Post</Button></div>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button style={{color: 'black', backgroundColor: 'lightgrey', fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={handleClose} size='large' variant='contained'>Cancel</Button></div>
                    </div>
                </div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreateAuctionDialog;