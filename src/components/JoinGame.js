import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Divider, List, ListItem, Typography } from '@mui/material';
import { signer, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import PlayerCard from './PlayerCard';
import { getPlayerNameById, getPlayerNumberById, getPlayerPositionById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import PageContext from './PageContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import JoinGameDialog from './dialogs/JoinGameDialog';
import { setDisplayDialog, setSelectedCardsView } from '../store/games/gameSlice';
import { getItems } from './ViewCard';

const JoinGame = ( props ) => {

    const history = useHistory();
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);
    const headerMessage = 'No Cards Owned';
    const message = 'Purchase cards from a card pack or auction to view them here'

    useEffect(() => {
        getCards();
        setSelectedCards([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const backToGames = () => {
        history.push('/games')
    }

    const openDialog = () => {
        dispatch(setSelectedCardsView(selectedCards));
        dispatch(setDisplayDialog(true));
    }

    const getCards = async () => {
        setLoading(true);
        const account = await getAccount();
        const allCardIds = await getAllCardIds(account);
        const ownedCards = filterCurrentlyOwnedCards(allCardIds);
        const cardsWithDetails = await getCardDetailsById(ownedCards);
        const availableCards = filterForAvailableCards(cardsWithDetails);
        const mappedCards = availableCards.map(card => {
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

    const filterForAvailableCards = (cards) => {
        return cards.filter(card => {
            return !card.inUse
        })
    }

    const getCardDetailsById = async (cardIds) => {
        let promises = [];

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
        
        return {cardId, playerId, attributeHash, cardType};
    }

    const handleSelect = (selectedCard) => {
        if(selectedCards.includes(selectedCard)) {
            const removedCard = selectedCards.filter(card => card !== selectedCard);
            setSelectedCards(removedCard);
        } else {
            setSelectedCards(selectedCards => [...selectedCards, selectedCard])
        }
    }

    const getCardCountByPosition = (position) => {
        let count = 0;

        selectedCards.forEach(card => {
            if(getPlayerPositionById(card.playerId) === position) {
                count++;
            }
        })

        return count;
    }

    const getPositionEntries = (position) => {
        switch(position) {
            case 'QB':
                return 1;
            case 'RB': 
                return 2;
            case 'WR':
                return 2;
            case 'TE': 
                return 1;
            default:
                return '';
        }
    }

    const checkDisabled = (card) => {
        const position = getPlayerPositionById(card.playerId);
        const selected = getCardCountByPosition(position);
        const maxEntries = getPositionEntries(position);
        if(!selectedCards.includes(card) && (selected === maxEntries)) {
            return {pointerEvents: 'none', backgroundColor: 'gray'};
        }
    }

    const CardTile = ( cardData ) => {

        const card = cardData.card;
        const position = getPlayerPositionById(card.playerId);

        return (
            <ListItem onClick={() => handleSelect(card)} sx={{...checkDisabled(card), display: 'flex', cursor: 'pointer'}}>
                <PlayerCard attributes={card.attributeHash} flippable={false} width={isMobile ? '20vw' : '15vw'} number={getPlayerNumberById(card.playerId)} team={getPlayerTeamById(card.playerId)} playerType={getPlayerTypeById(card.playerId)} cardType={card.cardType} />
                <div style={{width: '100vw', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>{getPlayerNameById(card.playerId)}</Typography>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>{position}</Typography>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '4vw' : '2vw'}}>Items: {getItems(card.attributeHash)}</Typography>
                    </div>
                    <Checkbox checked={selectedCards.includes(card)} color='secondary' />
                </div>
            </ListItem>
        )
    }

    const CardList = () => {

        return (
            <List sx={{top: '30vw'}}>
                {
                    cards.map((card, i) => {
                        return (
                            <div key={i}>
                                <Divider />
                                <CardTile card={card} />
                            </div>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <div>
            {displayDialog ? <JoinGameDialog mobile={isMobile} cards={selectedCards}/> : null}
            <div style={{position: 'fixed', backgroundColor: '#7ebc89', zIndex: 1, padding: '2vw 0'}}>
                <Typography sx={{width: '100vw', marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: '#fff'}}>
                    <span style={{cursor: 'pointer'}} onClick={backToGames}><ArrowBackIcon sx={{backgroundColor: 'white', borderRadius: '4px', position: 'fixed', left: '3vw', fontSize: isMobile ? '13vw' : '7vw'}} color='third' /></span>Select Cards
                </Typography>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <div>
                        <div style={{fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '4vw' : '2vw', position: 'relative', zIndex: 2, color: 'white'}}>
                            QB: {getCardCountByPosition('QB')}/1
                            RB: {getCardCountByPosition('RB')}/2
                        </div>
                        <div style={{fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '4vw' : '2vw', position: 'relative', zIndex: 2, color: 'white'}}>
                            WR: {getCardCountByPosition('WR')}/2
                            TE: {getCardCountByPosition('TE')}/1
                        </div>
                    </div>
                    <Button onClick={openDialog} disabled={selectedCards.length !== 6} sx={{fontSize: isMobile ?  '' : '2vw', width: '30vw'}} variant='contained'>Join</Button>
                </div>
            </div>
            {loading ? <CircularProgress style={{marginTop: '35vw'}} color='secondary' size={200} /> : <CardList />}
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
        </div>
    )
}

export default JoinGame;