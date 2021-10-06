import React, { useState, useEffect } from 'react';
import { Backdrop, Button } from '@mui/material';
import PlayerCard from './PlayerCard';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useSelector } from 'react-redux';
import NFTContract from '../ethereum/NFTContract';
import CircularProgress from '@mui/material/CircularProgress';

let cards = [];

const CardPack = ( props ) => {

    // let data = props.data.CardCreated;
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const isMobile = useSelector((state) => state.mobile.value);
    const account = useSelector((state) => state.account.value);

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {

        setLoading(true);

        NFTContract.getPastEvents('CardCreated', {
            filter: {owner: account},
            fromBlock: 0,
            toBlock: 'latest'
        }).then(events => {
            console.log('events', events)
            cards = [];
            for(let i = events.length - 1; i >= events.length - 10; i--) {
                cards.push(mapCardData(events[i]));
            }
            console.log('cards', cards)
            setLoading(false);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function mapCardData(card) {
        const {cardId, playerId, attributeHash, cardType} = card.returnValues;
        
        return {cardId, playerId, attributeHash, cardType};
    }

    function mapDataToCards(cards) {
        return cards.map((card, i) => {
            const { cardId, playerId, cardType, attributeHash } = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            return (
                <div key={i}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={true} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={cardType} />
                </div>
            )
        })
    }

    return (
        <Backdrop style={{display: 'block', overflow: 'scroll', backgroundColor: 'rgba(0, 0, 0, 0.86)'}} open={open} sx={{zIndex: 1}}>
            <div style={{marginTop: isMobile ? '20vw' : '12%'}}>
                {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : <div style={{display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>{mapDataToCards(cards)}</div>}
            </div>
            <div style={{marginTop: '25px', marginBottom: '25px'}}>
                <Button onClick={handleClose} size='large' variant='contained'>Done</Button>
            </div>
        </Backdrop>
    )

}

export default CardPack;