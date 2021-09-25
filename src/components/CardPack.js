import React, { useState } from 'react';
import { Backdrop, Button } from '@mui/material';
import PlayerCard from './PlayerCard';
import { getPlayerTeamById } from '../utils/PlayerUtil';

const CardPack = ( props ) => {

    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    const topRow = props.cards.slice(0, props.cards.length / 2);
    const bottomRow = props.cards.slice(props.cards.length / 2);

    function mapDataToCards(cards) {
        return cards.map((card, i) => {
            return (
                <PlayerCard key={i} flippable={true} width='250px' team={getPlayerTeamById(card.playerId)} attributeHash={card.attributeHash} cardType={card.cardType} />
            )
        })
    }

    return (
        <Backdrop style={{display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.86)'}} open={open} sx={{zIndex: 1}}>
            <div style={{marginTop: '12%'}}>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>{mapDataToCards(topRow)}</div>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>{mapDataToCards(bottomRow)}</div>
            </div>
            <div style={{marginTop: '25px'}}>
                <Button onClick={handleClose} size='large' variant='contained'>Done</Button>
            </div>
        </Backdrop>
    )

}

export default CardPack;