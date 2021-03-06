import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Divider, List, ListItem, Typography } from '@mui/material';
import { signer, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import PlayerCard from './PlayerCard';
import { getPlayerNameById, getPlayerNumberById, getPlayerPositionById, getPlayerTeamById, getPlayerTypeById, getPlayerApiIdById } from '../utils/PlayerUtil';
import PageContext from './PageContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import JoinGameDialog from './dialogs/JoinGameDialog';
import { setDisplayDialog, setSelectedCardsView } from '../store/games/gameSlice';
import { getItems } from './ViewCard';
import axios from 'axios';
import CardFilter from './CardFilter';
import { setPosition, setRarity } from '../store/card-filter/cardFilterSlice';

const JoinGame = ( props ) => {

    const history = useHistory();
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    const game = useSelector((state) => state.game.value.game);
    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);
    const selectedPosition = useSelector((state) => state.cardFilter.value.position);
    const selectedRarity = useSelector((state) => state.cardFilter.value.rarity);
    const headerMessage = 'No Cards Owned';
    const message = 'Purchase cards from a card pack or auction to view them here'

    useEffect(() => {
        getCards();
        setSelectedCards([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        return () => {
            dispatch(setPosition('Position'));
            dispatch(setRarity('Rarity'));
        }

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
        const week = game.week;
        const account = await getAccount();
        const allCardIds = await getAllCardIds(account);
        const ownedCards = filterCurrentlyOwnedCards(allCardIds);
        const cardsWithDetails = await getCardDetailsById(ownedCards);
        const availableCards = filterForAvailableCards(cardsWithDetails);
        const mappedCards = availableCards.map(card => {
            return mapCardData(card, week)
        });
        const finalCards = await handlePromises(mappedCards);
        setLoading(false);
        setCards(finalCards);
        if(finalCards.length === 0) setDisplayMessage(true);
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
        const promises = [];

        for(let i = 0; i < cardIds.length; i++) {
            promises.push(
                ContractWithSigner.cardIdToCard(BigNumber.from(cardIds[i]).toNumber())
            )
        }

        return Promise.all(promises);
    }

    const getPlayerDetails = async (card, currentWeek) => {

        const playerId = BigNumber.from(card.playerId).toNumber();
        const playerApiId = getPlayerApiIdById(playerId)
        const data = (await axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/Player/${playerApiId}?key=${process.env.REACT_APP_SD_API_KEY}`)).data;
        const stats = (await axios.get(`https://api.sportsdata.io/v3/nfl/stats/json/PlayerGameStatsByPlayerID/2021/${currentWeek}/${playerApiId}?key=${process.env.REACT_APP_SD_API_KEY}`)).data;
        const kickoffTime = stats.GameDate;
        return {...data, kickoffTime: kickoffTime};
    }

    const mapCardData = async (card, currentWeek) => {
        const data = await getPlayerDetails(card, currentWeek);
        const gameStarted = Date.now() > Date.parse(data.kickoffTime);
        const injuryStatus = getInjuryStatusLetter(data.InjuryStatus);
        const cardId = BigNumber.from(card.cardId).toString();
        const playerId = BigNumber.from(card.playerId).toString();
        const attributeHash = BigNumber.from(card.attributeHash).toString();
        const cardType = BigNumber.from(card.cardType).toString();
        const opponent = data.UpcomingGameWeek.toString() === currentWeek ? data.UpcomingGameOpponent : 'N/A';
        
        return {cardId, playerId, attributeHash, injury: injuryStatus, cardType, opponent: opponent, gameStarted: gameStarted};
    }

    const getInjuryStatusLetter = (injury) => {
        switch(injury) {
            case 'Out':
                return 'O'
            case 'Probable':
                return 'P'
            case 'Questionable':
                return 'Q'
            case 'Doubtful':
                return 'D'
            default:
                return ''
        }
    }

    const handlePromises = async (cardDetails) => {
        return Promise.all(cardDetails);
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
        if((!selectedCards.includes(card) && (selected === maxEntries)) || (card.opponent === 'N/A') || (card.gameStarted)) {
        // if((!selectedCards.includes(card) && (selected === maxEntries))) {
            return {pointerEvents: 'none', backgroundColor: 'gray'};
        }
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

    const CardTile = ( cardData ) => {

        const card = cardData.card;
        const position = getPlayerPositionById(card.playerId);

        return (
            <ListItem onClick={() => handleSelect(card)} sx={{...checkDisabled(card), display: 'flex', cursor: 'pointer'}}>
                <PlayerCard attributes={card.attributeHash} flippable={false} width={isMobile ? '20vw' : '10vw'} number={getPlayerNumberById(card.playerId)} team={getPlayerTeamById(card.playerId)} playerType={getPlayerTypeById(card.playerId)} cardType={card.cardType} />
                <div style={{width: '100vw', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '55vw'}}>
                        <Typography sx={{fontWeight: 600, fontSize: isMobile ? '4.5vw' : '2vw'}}>{getPlayerNameById(card.playerId)}<span style={{color:'red'}}>{' ' + card.injury}</span></Typography>
                        <Typography sx={{fontWeight: 600, fontSize: isMobile ? '4.5vw' : '2vw'}}>{position}</Typography>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography sx={{fontWeight: 600, fontSize: isMobile ? '3.5vw' : '2vw'}}>Items: {getItems(card.attributeHash)}</Typography>
                            <Typography sx={{fontWeight: 600, fontSize: isMobile ? '3.5vw' : '2vw'}}>OPP: {card.opponent}</Typography>
                        </div>
                    </div>
                    <Checkbox checked={selectedCards.includes(card)} color='darkGreen' />
                </div>
            </ListItem>
        )
    }

    const CardList = () => {
        const filteredCards = filterCards(cards);

        return (
            <List sx={{top: isMobile ? '45vw' : '21vw'}}>
                {
                    filteredCards.map((card, i) => {
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
            <div style={{padding: '1vw 0', backgroundColor: 'white', zIndex: '1', position: 'fixed', paddingTop: isMobile ? '2vw' : '1vw'}}>
                <Typography sx={{width: '100vw', marginBottom: '3vw', fontSize: isMobile ? '8vw' : '6vw'}}>
                    <span style={{cursor: 'pointer'}} onClick={backToGames}><ArrowBackIcon sx={{backgroundColor: '#2e8b57', borderRadius: '4px', position: 'fixed', left: '3vw', fontSize: isMobile ? '13vw' : '7vw'}} color='secondary' /></span>Select Cards
                </Typography>
                {isMobile ? <CardFilter /> : null}
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    {isMobile ? null : <CardFilter />}
                    <div>
                        <div style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '2vw', position: 'relative', zIndex: 2}}>
                            QB: {getCardCountByPosition('QB')}/1
                            RB: {getCardCountByPosition('RB')}/2
                        </div>
                        <div style={{fontWeight: 600, fontSize: isMobile ? '4vw' : '2vw', position: 'relative', zIndex: 2}}>
                            WR: {getCardCountByPosition('WR')}/2
                            TE: {getCardCountByPosition('TE')}/1
                        </div>
                    </div>
                    <Button onClick={openDialog} disabled={selectedCards.length !== 6} sx={{fontSize: isMobile ?  '' : '2vw', width: '30vw'}} variant='contained'>Join</Button>
                </div>
            </div>
            {loading ? <CircularProgress style={{marginTop: isMobile ? '50vw' : '25vw'}} color='darkGreen' size={200} /> : <CardList />}
            {displayMessage ? <PageContext parent={'join-game'} header={headerMessage} body={message} /> : null}
        </div>
    )
}

export default JoinGame;