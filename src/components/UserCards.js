import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { getPlayerNumberById, getPlayerPositionById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail, setDisplayCard } from '../store/card-detail/cardDetailSlice';
import ViewCard from './ViewCard';
import { signer, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import PageContext from './PageContext';
import { Typography } from '@mui/material';
import CardFilter from './CardFilter';
import { setPosition, setRarity } from '../store/card-filter/cardFilterSlice';

const UserCards = ( props ) => {

    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const getAccount = async () => signer.getAddress();
    const displayCard = useSelector((state) => state.cardDetail.value.displayCard);
    const isMobile = useSelector((state) => state.mobile.value);
    const selectedPosition = useSelector((state) => state.cardFilter.value.position);
    const selectedRarity = useSelector((state) => state.cardFilter.value.rarity);
    const headerMessage = 'No Cards Owned';
    const message = 'Purchase cards from a card pack or auction to view them here'

    useEffect(() => {

        getCards();
        dispatch(setDisplayCard(false));
        dispatch(setCardDetail({}));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        return () => {
            dispatch(setPosition('Position'));
            dispatch(setRarity('Rarity'));
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCards = async () => {
        setLoading(true);
        const account = await getAccount();
        const allCardIds = await getAllCardIds(account);
        const ownedCards = filterCurrentlyOwnedCards(allCardIds);
        const cardsWithDetails = await getCardDetailsById(ownedCards);
        const mappedCards = cardsWithDetails.map(card => {
            return mapCardData(card)
        });
        setLoading(false);
        setCards(mappedCards);
        if(mappedCards.length === 0) setDisplayMessage(true);
    }

    const getAllCardIds = async (acct) => {
        return ContractWithSigner.getUserOwnedCards(acct);
    }

    const filterCurrentlyOwnedCards = (cardIds) => {
        return cardIds.filter(cardId => {
            return BigNumber.from(cardId).toString() !== '999999999999999'
        })
    }

    const getCardDetailsById = async (cardIds) => {
        const promises = [];

        for(let i = 0; i < cardIds.length; i++) {
            promises.push(
                ContractWithSigner.cardIdToCard(BigNumber.from(cardIds[i]).toNumber())
            )
        }

        return Promise.all(promises);
    }

    function mapCardData(card) {
        const cardId = BigNumber.from(card.cardId).toString();
        const playerId = BigNumber.from(card.playerId).toString();
        const attributeHash = BigNumber.from(card.attributeHash).toString();
        const cardType = BigNumber.from(card.cardType).toString();
        const inUse = card.inUse;
        
        return {cardId, playerId, attributeHash, cardType, inUse};
    }

    const handleCardDisplay = (card) => {
        dispatch(setDisplayCard(true));
        dispatch(setCardDetail(card));
    }

    function displayCards(cards) {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>{createCards(cards)}</div>
        )
    }

    const filterCards = (cards) => {
        const filteredByPosition = cards.filter((card) => {
            if(selectedPosition === 'Position' || selectedPosition === 'All') {
                return true;
            }
            const position = getPlayerPositionById(card.playerId);
            return position === selectedPosition;
        });

        const filteredByRarity = filteredByPosition.filter((card) => {
            if(selectedRarity === 'Rarity' || selectedRarity ===  'All') {
                return true;
            }
            if((selectedRarity === '0') || (selectedRarity === '1') || (selectedRarity === '2') || (selectedRarity === '3')) {
                return card.cardType === selectedRarity;
            }

            return Number(card.cardType) > 3;
        });

        return filteredByRarity;
    }


    function createCards(cards) {
        const filteredCards = filterCards(cards);

        return filteredCards.map((card, i) => {
            const { cardId, playerId, cardType, attributeHash, inUse } = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            const cardToView = { cardId, playerId, cardType, attributeHash, team, number, playerType, inUse };
            return (
                <div key={i} style={{cursor: 'pointer'}} onClick={() => handleCardDisplay(cardToView)}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={false} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={cardType} />
                </div>
            )
        });
    }

    return (
        <div style={{marginTop: '2vw'}}>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: isMobile ? '8vw' : '6vw', color: '#fff'}}>
                My Cards
            </Typography>
            <CardFilter/>
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : displayCards(cards)}
            {displayCard ? <ViewCard view={'userCards'}/> : null}
        </div>
    )

}

export default UserCards;