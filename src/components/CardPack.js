import React, { useState } from 'react';
import { Backdrop, Button } from '@mui/material';
import PlayerCard from './PlayerCard';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useSelector } from 'react-redux';

const CardPack = ( props ) => {

    let data = props.data.CardCreated;
    const [open, setOpen] = useState(true);
    const isMobile = useSelector((state) => state.mobile.value);
    const handleClose = () => {
        setOpen(false);
    };

    function mapDataToCards(cards) {
        return cards.map((card, i) => {
            return (
                <div>
                    <PlayerCard key={i} flippable={true} width={isMobile ? '50vw' : '250px'}team={getPlayerTeamById(card.returnValues.playerId)} number={getPlayerNumberById(card.returnValues.playerId)} attributes={card.returnValues.attributeHash} playerType={getPlayerTypeById(card.returnValues.playerId)} cardType={card.returnValues.cardType} />
                </div>
            )
        })
    }

    return (
        <Backdrop style={{display: 'block', overflow: 'scroll', backgroundColor: 'rgba(0, 0, 0, 0.86)'}} open={open} sx={{zIndex: 1}}>
            <div style={{marginTop: isMobile ? '20vw' : '12%'}}>
                <div style={{display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>{mapDataToCards(data)}</div>
            </div>
            <div style={{marginTop: '25px', marginBottom: '25px'}}>
                <Button onClick={handleClose} size='large' variant='contained'>Done</Button>
            </div>
        </Backdrop>
    )

}

export default CardPack;