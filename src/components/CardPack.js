import React, { useState } from 'react';
import { Backdrop, Button } from '@mui/material';
import PlayerCard from './PlayerCard';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';

const CardPack = ( props ) => {

    let data = props.data.CardCreated;
    console.log('CARD DATA', data);
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    // useEffect(() => {

    //     console.log('ID in cardpack', props.id)
    //     getCards(props.id);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    const topRow = data.slice(0, data.length / 2);
    const bottomRow = data.slice(data.length / 2);

    function mapDataToCards(cards) {
        return cards.map((card, i) => {
            console.log('CARD', card);
            return (
                <PlayerCard key={i} flippable={true} width='250px' team={getPlayerTeamById(card.returnValues.playerId)} number={getPlayerNumberById(card.returnValues.playerId)} attributes={card.returnValues.attributeHash} type={getPlayerTypeById(card.returnValues.playerId)} cardType={card.returnValues.cardType} />
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