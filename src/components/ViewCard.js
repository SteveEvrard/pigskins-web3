import React from 'react';
import { Backdrop, Button, Divider, List } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import PlayerCard from './PlayerCard';
import { getTeamName, getPlayerNameById, getPlayerNumberById, getPlayerTeamById, getPlayerTypeById, getPlayerPositionById } from '../utils/PlayerUtil';
import { ListItem } from '@mui/material';
import { resolveCrown, resolveFootball, resolveWater } from '../utils/ImageCreator';
import blank from '../images/blank.png';

const ViewCard = ( props ) => {

    const dispatch = useDispatch();
    const card = useSelector((state) => state.cardDetail.value);
    const isMobile = useSelector((state) => state.mobile.value);
    const cardTypes = {
        0: 'Common',
        1: 'Rare',
        2: 'Exotic',
        3: 'Legendary'
    }

    const mobileStyle = {display: 'block', color: 'white', marginTop: '20vw'};
    const mobileListStyle = {margin: 'auto', fontFamily: "Work Sans, sans-serif", backgroundColor: '#31572c', fontSize: '5vw', width: '90vw'};

    const desktopStyle = {display: 'flex', color: 'white', marginTop: '7vw'};
    const desktopListStyle = {fontFamily: "Work Sans, sans-serif", backgroundColor: '#31572c', fontSize: '3.5vw', width: '50vw'};

    const handleClose = () => {
        dispatch(setCardDetail({}));
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
        <Backdrop style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.86)'}} open={true} sx={{zIndex: 1}}>
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
                    <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '6vw'}}>
                        <Button style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: '20vw'}} onClick={handleClose} size='large' variant='contained'>Sell</Button>
                        <Button color='secondary' style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '1.3vw', width: '20vw'}} onClick={handleClose} size='large' variant='contained'>Close</Button>
                    </div>
                </List>
            </div>
        </Backdrop>
    )
}

export default ViewCard;