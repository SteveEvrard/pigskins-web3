import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import ViewCard from './ViewCard';
import { Contract, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";

let cards = [];

const UserCards = ( props ) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const account = useSelector((state) => state.account.value);
    const selectedCard = useSelector((state) => state.cardDetail.value);
    const isMobile = useSelector((state) => state.mobile.value);

    useEffect(() => {

        dispatch(setCardDetail({}));

        return () => {
            dispatch(setCardDetail({}));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(account) getCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    const getCards = async () => {
        setLoading(true);
        console.log(account);
        ContractWithSigner.queryFilter(Contract.filters.CardCreated(null, null, null, null, account))
        .then(data => {
            cards = [];
            
            for(let i = 0; i < data.length; i++) {
                cards.push(mapCardData(data[i]));
            }
            setLoading(false);
        });
    }

    function mapCardData(card) {
        const cardId = BigNumber.from(card.args.cardId).toString();
        const playerId = BigNumber.from(card.args.playerId).toString();
        const attributeHash = BigNumber.from(card.args.attributeHash).toString();
        const cardType = BigNumber.from(card.args.cardType).toString();
        
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