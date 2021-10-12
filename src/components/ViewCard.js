import React, { useState } from 'react';
import { Backdrop, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, List, MenuItem, Select, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import { setNotification } from '../store/notification/notificationSlice';
import PlayerCard from './PlayerCard';
import { getTeamName, getPlayerNameById, getPlayerNumberById, getPlayerTeamById, getPlayerTypeById, getPlayerPositionById } from '../utils/PlayerUtil';
import { ListItem } from '@mui/material';
import { resolveCrown, resolveFootball, resolveWater } from '../utils/ImageCreator';
import blank from '../images/blank.png';
import { Contract, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber, ethers } from "ethers";

const ViewCard = ( props ) => {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [auctionSuccess, setAuctionSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [time, setTime] = useState(300);
    const [price, setPrice] = useState(0.01);
    const dispatch = useDispatch();
    const isAuction = props.isAuction;
    const isClaim = props.isClaim;
    const account = useSelector((state) => state.account.value);
    const card = useSelector((state) => state.cardDetail.value);
    const isMobile = useSelector((state) => state.mobile.value);
    const cardTypes = {
        0: 'Common',
        1: 'Rare',
        2: 'Exotic',
        3: 'Legendary'
    }

    const mobileStyle = {display: 'block', color: 'white', marginTop: '20vw'};
    const mobileListStyle = {margin: 'auto', fontFamily: "Work Sans, sans-serif", backgroundColor: '#31572c', fontSize: '5vw', width: '90vw', marginBottom: '5vw'};

    const desktopStyle = {display: 'flex', color: 'white', marginTop: '7vw'};
    const desktopListStyle = {fontFamily: "Work Sans, sans-serif", backgroundColor: '#31572c', fontSize: '3.5vw', width: '50vw'};

    const handleClose = () => {
        dispatch(setCardDetail({}));
        setAuctionEnded(false);
    };

    const handleCancel = () => {
        setOpen(false);
        setPrice(0.01);
        setTime(300);
    };

    const handleSuccess = () => {
        setOpen(false);
        setProcessing(false);
        setAuctionSuccess(false);
        setError('');
        dispatch(setCardDetail({}));
    }

    const openDialog = () => {
        if(isAuction) setPrice(ethers.utils.formatEther(`${card.bid}`, 'ether'));
        setOpen(true);
    }

    const setAuction = async () => {
        setProcessing(true);

        const cardId = BigNumber.from(card.cardId).toNumber();
        const startingBid = ethers.utils.parseUnits(price.toString());

        ContractWithSigner.createCardAuction(cardId, startingBid, time, {from: account})
        .then(() => {
            Contract.once(Contract.filters.AuctionOpened(null, cardId), () => {
                setAuctionSuccess(true);
            })
        })
        .catch(err => {
            if(err.error) setAuctionSuccess(true);
            if(!err.error) setProcessing(false);
            setError(err.error ? err.error.message : '');
        });

    }

    const placeBid = async () => {
        setProcessing(true);

        const cardId = BigNumber.from(card.cardId).toNumber();
        const bid = ethers.utils.parseUnits(price.toString());

        ContractWithSigner.placeBid(cardId, {from: account, value: bid})
        .then(() => {
            Contract.once(Contract.filters.BidPlaced(null, cardId), () => {
                setAuctionSuccess(true);
            })
        })
        .catch(err => {
            console.log(err.error.message)
            if(err.error) setAuctionSuccess(true);
            if(!err.error) setProcessing(false);
            setError(err.error ? err.error.message : '');
        });
    }

    const closeAuction = async () => {
        setProcessing(true)
        setAuctionEnded(false);
        const cardId = BigNumber.from(card.cardId).toNumber();

        ContractWithSigner.endAuction(cardId, {from: account})
        .then(() => {
            Contract.once(Contract.filters.AuctionClosed(null, cardId), () => {
                setAuctionSuccess(true);
                setProcessing(false);
                setAuctionEnded(true);
                dispatch(setNotification(false));
            })
        })
        .catch(err => {
            if(!err.error) setAuctionSuccess(true);
            if(err.error) {
                setProcessing(false);
                setError(err.error.message);
            }
            setProcessing(false);
        });
    }

    function getHelperMessage() {
        if(isAuction) {
            return price <= ethers.utils.formatEther(`${card.bid}`) ? 'Increase bid' : '';
        }else {
            return price <= 0 ? 'Price cannot be below 0' : '';
        }
    }

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const getItems = () => {
        let items = [];
        if(blank.toString() !== resolveFootball(card.attributeHash).toString()) items.push('Football');
        if(blank.toString() !== resolveWater(card.attributeHash).toString()) items.push('Water');
        if(blank.toString() !== resolveCrown(card.attributeHash).toString()) items.push('Crown');

        if(items.length === 0) return 'None';
        return items.join(', ');
    }

    return (
        <Backdrop style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.86)', overflowY: 'scroll'}} open={true} sx={{zIndex: 1}}>
            <div style={isMobile ? mobileStyle : desktopStyle}>
                <PlayerCard attributes={card.attributeHash} flippable={false} width={isMobile ? '80vw' : '40vw'} number={getPlayerNumberById(card.playerId)} team={getPlayerTeamById(card.playerId)} playerType={getPlayerTypeById(card.playerId)} cardType={card.cardType} />
                <List sx={isMobile ? mobileListStyle : desktopListStyle}>
                    <ListItem>Name: {getPlayerNameById(card.playerId)}</ListItem>
                    <Divider />
                    <ListItem>Position: {getPlayerPositionById(card.playerId)}</ListItem>
                    <Divider />
                    <ListItem>Team: {getTeamName(card.playerId)}</ListItem>
                    <Divider />
                    <ListItem>Card Type: {cardTypes[card.cardType]}</ListItem>
                    <Divider />
                    <ListItem>Items: {getItems()}</ListItem>
                    {isClaim ?

                    !processing ? 
                        <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '6vw'}}>
                            {auctionEnded ? null : <Button color='secondary' style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: '20vw'}} onClick={handleClose} size='large' variant='contained'>Close</Button>}
                            <Button style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: auctionEnded ? '40vw' : '20vw'}} onClick={auctionEnded ? handleClose : closeAuction} size='large' variant='contained'>{auctionEnded ? 'Done' : 'Claim'}</Button>
                        </div> : <CircularProgress size={100} color='secondary' />
                    :
                    <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '6vw'}}>
                        <Button color='secondary' style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: '20vw'}} onClick={handleClose} size='large' variant='contained'>Close</Button>
                        {isAuction ? 
                            <Button style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: '20vw'}} onClick={openDialog} size='large' variant='contained'>Bid</Button> 
                            : 
                            <Button style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: '20vw'}} onClick={openDialog} size='large' variant='contained'>Sell</Button>
                        }
                    </div>
                    }
                </List>
            </div>
            <Dialog PaperProps={{style: isMobile ? {} : {width: '30vw'}}} open={open}>
                <DialogTitle sx={{backgroundColor: '#fff', color: 'black', textAlign: 'center'}}>Auction</DialogTitle>
                <DialogContent sx={{backgroundColor: '#fff', paddingTop: '20px !important'}}>
                    { !processing ? 
                    <div>
                        <TextField
                            autoFocus
                            inputProps={{step: 0.01}}
                            error={isAuction ? price <= ethers.utils.formatEther(`${card.bid}`, 'ether') : price <= 0}
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
                        {!isAuction ?
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
                            :
                            null
                        }
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '3vw'}}>
                            <Button style={{color: 'black', backgroundColor: 'lightgrey', fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: isMobile ? '22vw' : '10vw'}} onClick={handleCancel} size='large' variant='contained'>Cancel</Button>
                            <Button disabled={price <= 0} style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: isMobile ? '22vw' : '10vw'}} onClick={!isAuction ? setAuction : placeBid} size='large' variant='contained'>Post</Button>
                        </div>
                    </div> 
                    : 
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        {auctionSuccess ? 
                            <div>
                                { !error ? <h1 style={{textAlign: 'center', color: '#31572c', marginTop: 0, marginBottom: isMobile ? '10vw' : '4vw'}}>{isAuction ? 'Bid Placed!' : 'Card Posted!'}</h1> : <div style={{textAlign: 'center', color: 'red', marginBottom: '3vw'}}>{error}</div> }
                                <div style={{display: 'flex', justifyContent: 'center'}}><Button style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: isMobile ? '30vw' : '10vw'}} onClick={handleSuccess} size='large' variant='contained'>Done</Button></div>
                            </div> 
                            : 
                            <CircularProgress size={100} color='selected' />}
                    </div>
                    }
                </DialogContent>
            </Dialog>
        </Backdrop>
    )
}

export default ViewCard;