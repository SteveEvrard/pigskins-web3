import React, { useEffect, useState } from 'react';
import NFTContract from '../ethereum/NFTContract';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import ViewCard from './ViewCard';

let cards = [];

const UserCards = ( props ) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    // const account = useSelector((state) => state.account.value);
    const selectedCard = useSelector((state) => state.cardDetail.value);
    const isMobile = useSelector((state) => state.mobile.value);

    useEffect(() => {

        dispatch(setCardDetail({}));
        setLoading(true);
        NFTContract.getPastEvents('CardCreated', {
            fromBlock: 0,
            toBlock: 'latest'
        }).then(events => {
            cards = [];
            for(let i = 0; i < events.length; i++) {
                cards.push(mapCardData(events[i]));
            }
            setLoading(false);
        });

        return () => {
            dispatch(setCardDetail({}));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function mapCardData(card) {
        const {cardId, playerId, attributeHash, cardType} = card.returnValues;
        
        return {cardId, playerId, attributeHash, cardType};
    }

    function displayCards(cards) {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>{createCards(cards)}</div>
        )
    }

    const setCardToView = (card) => {
        dispatch(setCardDetail(card));
    }

    function createCards(cards) {
        return cards.map((card, i) => {
            const { cardId, playerId, cardType, attributeHash } = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            return (
                <div key={i} style={{cursor: 'pointer'}} onClick={() => setCardToView({cardId, team, number, playerId, cardType, attributeHash})}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={false} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={card.cardType} />
                </div>
            )
        });
    }

    return (
        <div>
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : null}
            {!loading ? displayCards(cards) : null}
            {selectedCard.playerId ? <ViewCard/> : null}
        </div>
    )

}

export default UserCards;