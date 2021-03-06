import React, { useState, useEffect } from 'react';
import { Divider,  List, ListItem, CircularProgress, Dialog, DialogContent, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ContractWithSigner } from '../../ethereum/ethers';
import { BigNumber } from "ethers";
import { getPlayerNameById, getPlayerNumberById, getPlayerPositionById, getPlayerTeamById, getPlayerTypeById } from '../../utils/PlayerUtil';
import { setDisplayDialog } from '../../store/games/gameSlice';
import PlayerCard from '../PlayerCard';
import { getItems } from '../ViewCard';
import CloseIcon from '@mui/icons-material/Close';
import { calculatePoints } from '../../utils/PlayerStatUtil';
import { getPlayerApiIdById } from '../../utils/PlayerUtil';

const GameDetailDialog = ( { mobile } ) => {
    
    const dispatch = useDispatch();
    const cardIds = useSelector((state) => state.game.value.cardIds);
    const game = useSelector((state) => state.game.value.game);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const sortOrder = ['QB', 'RB', 'WR', 'TE'];
    let sorted = cards.slice();
    sorted = Array.from(sorted);
    sorted.sort((a, b) => {
        return sortOrder.indexOf(getPlayerPositionById(a.playerId)) - sortOrder.indexOf(getPlayerPositionById(b.playerId))
    })

    useEffect(() => {
        getTeamInfo();

        return () => {
            handleCancel();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCancel = () => {
        dispatch(setDisplayDialog(false));
    };

    const getTeamInfo = async () => {
        setLoading(true);

        const cardsById = await getCardsById(cardIds);
        const mappedCards = cardsById.map(card => {
            return mapCardData(card)
        });
        setCards(mappedCards);
        setLoading(false);
    }

    const getCardsById = async (cardIds) => {
        const promises = [];

        for(let i = 0; i < cardIds.length; i++){
            promises.push(
                ContractWithSigner.cardIdToCard(cardIds[i])
            )
        }

        return Promise.all(promises);
    }

    const mapCardData = (card) => {
        const cardId = BigNumber.from(card.cardId).toString();
        const playerId = BigNumber.from(card.playerId).toString();
        const attributeHash = BigNumber.from(card.attributeHash).toString();
        const cardType = BigNumber.from(card.cardType).toString();
        
        return {cardId, playerId, attributeHash, cardType};
    }

    const CardTile = ( cardData ) => {

        const card = cardData.card
        const position = getPlayerPositionById(card.playerId);  
        const [score, setScore] = useState(0);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            getScore()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const getScore = async () => {
            const playerScore = await getSinglePlayerScore(card);
            setScore(playerScore);
            setLoading(false);
        }

        const getSinglePlayerScore = async (card) => {
            const week = game.week;
            const playerId = BigNumber.from(card.playerId).toString();
            const apiId = getPlayerApiIdById(playerId);
            const items = getItems(BigNumber.from(card.attributeHash).toString());
            const cardType = BigNumber.from(card.cardType).toString();

            return await calculatePoints(items, cardType, week, apiId);
        }

        return (
            <ListItem sx={{padding: 0, display: 'flex', cursor: 'pointer'}}>
                <PlayerCard attributes={card.attributeHash} flippable={false} width={mobile ? '20vw' : '6vw'} number={getPlayerNumberById(card.playerId)} team={getPlayerTeamById(card.playerId)} playerType={getPlayerTypeById(card.playerId)} cardType={card.cardType} />
                <div style={{width: mobile ? '55vw' : '80%', display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '55vw'}}>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: mobile ? '4vw' : '1.5vw'}}>{getPlayerNameById(card.playerId)}</Typography>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: mobile ? '4vw' : '1.5vw'}}>{position}</Typography>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: mobile ? '3vw' : '1vw'}}>Items: {getItems(card.attributeHash)}</Typography>
                        </div>
                    </div>
                    <div style={{margin: 'auto'}}>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: mobile ? '5vw' : '3vw'}}>{loading ? <CircularProgress color='darkGreen' size={30}/> : score}</Typography>
                    </div>
                </div>
            </ListItem>
        )
    }

    const CardList = () => {

        return (
            <List sx={{marginTop: mobile ? '9vw' : '5vw'}}>
                <Divider />
                {
                    sorted.map((card, i) => {
                        return (
                            <div key={i}>
                                <CardTile card={card} />
                                <Divider />
                            </div>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <Dialog PaperProps={{style: mobile ? {minWidth: '80vw'} : {width: mobile ? '30vw' : '70vw'}}} open={true}>
            <DialogContent sx={{border: 'white', borderStyle: 'solid', padding: 0, backgroundColor: '#2e8b57'}}>
                <div onClick={handleCancel} style={{zIndex: 1, cursor: 'pointer', position: 'absolute', right: 0}}><CloseIcon sx={{color: '#fff', fontSize: mobile ? '12vw' : '5vw'}}></CloseIcon></div>
                {loading ? <CircularProgress style={{marginLeft: '15vw'}} color='darkGreen' size={200} /> : <CardList />}
            </DialogContent>
        </Dialog>
    )
}

export default GameDetailDialog;