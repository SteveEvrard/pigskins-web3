import React, { useEffect } from 'react';
import { Backdrop, Box, Button, Divider, List, Tab} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail, setDisplayCard } from '../store/card-detail/cardDetailSlice';
import { setDisplayDialog, setPrice, setAuctionTime } from '../store/view-card/viewCardSlice';
import PlayerCard from './PlayerCard';
import { getTeamName, getPlayerNameById, getPlayerNumberById, getPlayerTeamById, getPlayerTypeById, getPlayerPositionById } from '../utils/PlayerUtil';
import { ListItem } from '@mui/material';
import { resolveCrown, resolveFootball, resolveWater } from '../utils/ImageCreator';
import blank from '../images/blank.png';
import { ethers } from "ethers";
import CreateAuctionDialog from './dialogs/CreateAuctionDialog';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Countdown from 'react-countdown';
import PlaceBidDialog from './dialogs/PlaceBidDialog';
import ClaimDialog from './dialogs/ClaimDialog';

const ViewCard = ( props ) => {

    const displayDialog = useSelector((state) => state.viewCard.value.displayDialog);
    const dispatch = useDispatch();
    const view = props.view;
    const card = useSelector((state) => state.cardDetail.value.card);
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
    const desktopListStyle = {marginTop: '2vw', fontFamily: "Work Sans, sans-serif", backgroundColor: '#31572c', fontSize: '3vw', width: '50vw'};

    useEffect(() => {
        return () => {
            dispatch(setCardDetail({}));
            dispatch(setDisplayCard(false));
            dispatch(setDisplayDialog(false));
            dispatch(setPrice(0.01));
            dispatch(setAuctionTime(3600));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        dispatch(setDisplayCard(false))
        dispatch(setCardDetail({}));
    };

    const openDialog = () => {
        dispatch(setDisplayDialog(true));
    }

    const getItems = () => {
        let items = [];
        if(blank.toString() !== resolveFootball(card.attributeHash).toString()) items.push('Football');
        if(blank.toString() !== resolveWater(card.attributeHash).toString()) items.push('Water');
        if(blank.toString() !== resolveCrown(card.attributeHash).toString()) items.push('Crown');

        if(items.length === 0) return 'None';
        return items.join(', ');
    }

    const PlayerInfo = ( {card, mobile} ) => {
        return (
            <List sx={mobile ? mobileListStyle : desktopListStyle}>
                <ListItem>Name: {getPlayerNameById(card.playerId)}</ListItem>
                <Divider />
                <ListItem>Position: {getPlayerPositionById(card.playerId)}</ListItem>
                <Divider />
                <ListItem>Team: {getTeamName(card.playerId)}</ListItem>
                <Divider />
                <ListItem>Card Type: {cardTypes[card.cardType]}</ListItem>
                <Divider />
                <ListItem>Items: {getItems()}</ListItem>
                <Divider />
                <ListItem>Card ID: {card.cardId}</ListItem>
            </List>
        )
    }

    const BidInfo = ( {card, mobile} ) => {
        return (
            <List sx={mobile ? mobileListStyle : desktopListStyle}>
                <ListItem>Current Price: {ethers.utils.formatEther(card.currentBid)} ETH</ListItem>
                <Divider />
                <ListItem>Bids Placed: {card.bidCount}</ListItem>
                <Divider />
                <ListItem>Time Remaining:<span style={{marginRight: '3vw'}}></span><Countdown className='' zeroPadDays={0} date={Number(card.expireDate)}></Countdown></ListItem>
            </List>
        )
    }

    const CompletedAuctionInfo = ( {card, mobile} ) => {
        return (
            <List sx={mobile ? mobileListStyle : desktopListStyle}>
                {
                Number(card.bidCount) > 0 ? 
                    <ListItem>Sale Price: {ethers.utils.formatEther(card.currentBid)} ETH</ListItem> 
                    : 
                    <ListItem>Auction Expired Without Bids</ListItem>
                }
                {Number(card.bidCount) > 0 ? <Divider /> : null}
                {Number(card.bidCount) > 0 ? <ListItem>Bids Placed: {card.bidCount}</ListItem> : null}
            </List>
        )
    }

    const AuctionInfo = ( {card, mobile} ) => {
        const [value, setValue] = React.useState('1');
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{ backgroundColor: '#31572c', width: mobile ? '90vw' : '50vw', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList textColor='#fff' onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Auction" value="1" />
                                <Tab label="Player" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel sx={{padding: 0}} value="1"><BidInfo card={card} mobile={mobile}/></TabPanel>
                        <TabPanel sx={{padding: 0}} value="2"><PlayerInfo card={card} mobile={mobile}/></TabPanel>
                    </TabContext>
                </Box>
            </div>
        )
    }

    const ClaimInfo = ( {card, mobile} ) => {
        const [value, setValue] = React.useState('1');
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Box sx={{ backgroundColor: '#31572c', width: mobile ? '90vw' : '50vw', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList textColor='#fff' onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Results" value="1" />
                                <Tab label="Player" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel sx={{padding: 0}} value="1"><CompletedAuctionInfo card={card} mobile={mobile}/></TabPanel>
                        <TabPanel sx={{padding: 0}} value="2"><PlayerInfo card={card} mobile={mobile}/></TabPanel>
                    </TabContext>
                </Box>
            </div>
        )
    }

    const SellCardButtons = ( { mobile } ) => {
        const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
        const desktopStyle = {display: 'flex', justifyContent: 'space-between', marginTop: '3vw', width: '50vw'};
        return(
            <div style={mobile ? mobileStyle : desktopStyle}>
                <div style={{marginBottom: '6vw'}}><Button style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '90vw' : '22vw'}} onClick={openDialog} size='large' variant='contained'>Sell</Button></div>
                <div style={{marginBottom: '6vw'}}><Button color='secondary' style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '90vw' : '22vw'}} onClick={handleClose} size='large' variant='contained'>Close</Button></div>
            </div>
        )
    }

    const BidCardButtons = ( { mobile }) => {
        const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
        const desktopStyle = {display: 'flex', justifyContent: 'space-between', marginTop: '3vw', width: '50vw'};
        return(
            <div style={mobile ? mobileStyle : desktopStyle}>
                <div style={{marginBottom: '6vw'}}><Button style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '90vw' : '22vw'}} onClick={openDialog} size='large' variant='contained'>Bid</Button></div>
                <div style={{marginBottom: '6vw'}}><Button color='secondary' style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '90vw' : '22vw'}} onClick={handleClose} size='large' variant='contained'>Close</Button></div>
            </div>
        )   
    }

    const ClaimButtons = ( { mobile }) => {
        const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
        const desktopStyle = {display: 'flex', justifyContent: 'space-between', marginTop: '3vw', width: '50vw'};
        return(
            <div style={mobile ? mobileStyle : desktopStyle}>
                <div style={{marginBottom: '6vw'}}><Button style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '90vw' : '22vw'}} onClick={openDialog} size='large' variant='contained'>Claim</Button></div>
                <div style={{marginBottom: '6vw'}}><Button color='secondary' style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '90vw' : '22vw'}} onClick={handleClose} size='large' variant='contained'>Close</Button></div>
            </div>
        )   
    }

    const displayCardInfoType = (view) => {
        switch(view) {
            case 'auction':
                return <AuctionInfo card={card} mobile={isMobile} />
            case 'userCards':
                return <PlayerInfo card={card} mobile={isMobile} />
            case 'claim':
                return <ClaimInfo card={card} mobile={isMobile} />
            default:
                return <PlayerInfo card={card} mobile={isMobile} />
        }
    }

    const displayDialogType = (view) => {
        switch(view) {
            case 'auction':
                return <PlaceBidDialog card={card} mobile={isMobile} />
            case 'userCards':
                return <CreateAuctionDialog mobile={isMobile} />
            case 'claim':
                return <ClaimDialog mobile={isMobile} />
            default:
                return <PlayerInfo card={card} mobile={isMobile} />
        }
    }

    const getButtonType = (view) => {
        switch(view) {
            case 'auction':
                return <BidCardButtons mobile={isMobile} />
            case 'userCards':
                return <SellCardButtons mobile={isMobile} />
            case 'claim':
                return <ClaimButtons mobile={isMobile} />
            default:
                return <PlayerInfo card={card} mobile={isMobile} />
        }
    }

    return (
        <Backdrop style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.86)', overflowY: 'scroll'}} open={true} sx={{zIndex: 1}}>
            <div style={isMobile ? mobileStyle : desktopStyle}>
                <PlayerCard attributes={card.attributeHash} flippable={false} width={isMobile ? '80vw' : '40vw'} number={getPlayerNumberById(card.playerId)} team={getPlayerTeamById(card.playerId)} playerType={getPlayerTypeById(card.playerId)} cardType={card.cardType} />
                <div>
                    {displayCardInfoType(view)}
                    {getButtonType(view)}
                    {displayDialog ? displayDialogType(view) : null}
                </div>
            </div>
        </Backdrop>
    )
}

export default ViewCard;