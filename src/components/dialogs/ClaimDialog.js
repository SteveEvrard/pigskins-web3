import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayDialog, setPrice } from '../../store/view-card/viewCardSlice';
import { ContractWithSigner, signer } from '../../ethereum/ethers';
import { BigNumber, ethers } from "ethers";
import AlertMessage from './AlertMessage';
import { setCardDetail } from '../../store/card-detail/cardDetailSlice';

const ClaimDialog = ( { mobile } ) => {
    
    const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
    const desktopStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '1vw'};
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();
    const card = useSelector((state) => state.cardDetail.value.card);
    const price = useSelector((state) => state.viewCard.value.price);
    const [processing, setProcessing] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');

    const handleCancel = () => {
        dispatch(setDisplayDialog(false));
        dispatch(setCardDetail(card));
        dispatch(setPrice(0.01));
        setError('');
    };

    const endAuction = async () => {
        setProcessing(true);

        const account = await getAccount();
        const cardId = BigNumber.from(card.cardId).toNumber();

        ContractWithSigner.endAuction(cardId, {from: account})
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
            <DialogTitle sx={{backgroundColor: '#fff', color: 'black', textAlign: 'center'}}>End Auction</DialogTitle>
            <DialogContent sx={{backgroundColor: '#fff', paddingTop: '20px !important'}}>
                { complete ? 
                <AlertMessage successMessage='Auction Closed! Processing Now!' error={error} mobile={mobile} />
                :
                processing ? 
                <div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='primary' /></div>
                :
                <div>
                    {Number(card.bidCount) === 0 ? <Typography sx={{textAlign: 'center'}} variant='h6'>Card Did Not Sell</Typography> : null}
                    <Typography sx={{textAlign: 'center'}} variant='h6'>{Number(card.bidCount) > 0 ? `Claim ${ethers.utils.formatEther(BigNumber.from(card.currentBid))} ETH Now!` : 'Return Card to Deck'}</Typography>
                    <div style={mobile ? mobileStyle : desktopStyle}>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button disabled={price <= 0} style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={endAuction} size='large' variant='contained'>Claim</Button></div>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button style={{color: 'black', backgroundColor: 'lightgrey', fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={handleCancel} size='large' variant='contained'>Cancel</Button></div>
                    </div>
                </div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default ClaimDialog;