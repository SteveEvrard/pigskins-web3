import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import ViewCard from './ViewCard';
import { signer, Contract, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import PageContext from './PageContext';

let cards = [];

const UserCards = ( props ) => {

    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const getAccount = async () => signer.getAddress();
    const selectedCard = useSelector((state) => state.cardDetail.value);
    const isMobile = useSelector((state) => state.mobile.value);
    const headerMessage = 'No Cards Owned';
    const message = 'Purchase cards from a card pack or auction to view them here'

    useEffect(() => {

        getCards();
        dispatch(setCardDetail({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCards = async () => {
        const account = await getAccount();
        const allCardIds = await getAllCardIds(account);
        console.log('ids', allCardIds);
        const ownedCards = filterCurrentlyOwnedCards(allCardIds);
        console.log('owned', ownedCards)
        const cardsWithDetails = await getCardDetailsById(ownedCards);
        console.log('details', cardsWithDetails);
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
        let promises = [];

        for(let i = 0; i < cardIds.length; i++) {
            promises.push(
                ContractWithSigner.cards(BigNumber.from(cardIds[i]).toNumber())
            )
        }

        return Promise.all(promises);
    }
    // const getCards = async () => {
    //     setLoading(true);
    //     ContractWithSigner.getUserOwnedCards(account)
    //         .then(data => {
    //             cards = [];
    //             console.log(data);
    //             for(let i = 0; i < data.length; i++) {
    //                 if(BigNumber.from(data[i]).toString() === '999999999999999'){
    //                     continue;
    //                 }
    //                 getCard(data[i])
    //             }
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //             setLoading(false);
    //         });
    // }

    function getCard(cardId) {
        Contract.cards(BigNumber.from(cardId)).then(card => {
            setLoading(true);
            cards.push(mapCardData(card));
            setLoading(false);
        })
    }

    function mapCardData(card) {
        const cardId = BigNumber.from(card.cardId).toString();
        const playerId = BigNumber.from(card.playerId).toString();
        const attributeHash = BigNumber.from(card.attributeHash).toString();
        const cardType = BigNumber.from(card.cardType).toString();
        
        return {cardId, playerId, attributeHash, cardType};
    }

    function displayCards(cards) {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', position: selectedCard.playerId ? 'fixed' : 'inherit' }}>{createCards(cards)}</div>
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
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : displayCards(cards)}
            {selectedCard.playerId ? <ViewCard/> : null}
        </div>
    )

}

export default UserCards;