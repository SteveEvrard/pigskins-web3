import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, List, ListItem, Typography } from '@mui/material';
import { signer, GameContractWithSigner, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import GameDetailDialog from './dialogs/GameDetailDialog';
import PersonIcon from '@mui/icons-material/Person';
import { setCardIds, setDisplayDialog } from '../store/games/gameSlice';
import { calculatePoints } from '../utils/PlayerStatUtil';
import { getPlayerApiIdById } from '../utils/PlayerUtil';
import { getItems } from './ViewCard';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const GameDetails = ( props ) => {

    const history = useHistory();
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    const dispatch = useDispatch();
    const [players, setPlayers] = useState([]);
    const [account, setAccount] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);
    const game = useSelector((state) => state.game.value.game);

    useEffect(() => {
        getCards();
        setSelectedCards([]);
        setPlayers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const backToGames = () => {
        history.push('/my-games');
    }

    const getCards = async () => {
        setLoading(true);
        const user = await getAccount();
        const week = Number(game.week);
        setAccount(user);
        const activePlayers = filterActivePlayers(game);
        const playerWithCardIds = await mapPlayerToCardIds(activePlayers);
        await getScoreByPlayer(playerWithCardIds, week);

        setLoading(false);
    }

    const getScoreByPlayer = async (players, week) => {
        const promises = [];

        for(let i = 0; i < players.length; i++) {
            promises.push(
                getScore(players[i], week)
            )
        }

        return Promise.all(promises);
    }

    const getScore = async (player, week) => {
        const cardsWithDetails = await getCardDetails(player.cards);
        const totalScore = await getTeamScore(cardsWithDetails, week);
        setPlayers(players => [...players, {...player, points: totalScore}]);
    }

    const getCardDetails = async (cards) => {
        const promises = [];

        for(let i = 0; i < cards.length; i++) {
            promises.push(
                ContractWithSigner.cardIdToCard(BigNumber.from(cards[i]).toNumber())
            )
        }

        return Promise.all(promises);
    }

    const getSinglePlayerScore = async (card, week) => {
        const playerId = BigNumber.from(card.playerId).toString();
        const apiId = getPlayerApiIdById(playerId);
        const items = getItems(BigNumber.from(card.attributeHash).toString());
        const cardType = BigNumber.from(card.cardType).toString();

        return await calculatePoints(items, cardType, week, apiId);
    }

    const getTeamScore = async (cards, week) => {
        let points = 0;

        for(let i = 0; i < cards.length; i++) {
            const playerPoints = await getSinglePlayerScore(cards[i], week);
            points = points + playerPoints;
        }

        points = Math.round(points * 100) / 100

        return points;
    }

    const filterActivePlayers = (game) => {
        return game.players.filter(player => {
            return player !== '0x0000000000000000000000000000000000000000'
        })
    }

    const mapPlayerToCardIds = async (players) => {
        const promises = [];

        for(let i = 0; i < players.length; i++) {
            promises.push(
                {player: players[i], cards: await GameContractWithSigner.getCardEntriesByPlayer(BigNumber.from(game.gameId), players[i])}
            )
        }

        return Promise.all(promises);
    }

    const shortenAddress = (address) => {
        return address.substring(0, 6) + '...' + address.substring(38);
    }

    const PlayerTile = ( {player, place} ) => {

        return (
            <ListItem sx={{display: 'flex'}}>
                <div style={isMobile ? {} : {display: 'flex', justifyContent: 'center', width: '100vw'}}>
                    <div style={{width: '90vw', display: 'flex', justifyContent: 'space-between'}}>
                        <Typography sx={{color: 'white', marginTop: isMobile ? '1vw' : '', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>
                            {place.toString()+ '. ' + shortenAddress(player.player)}
                            {place === 1 && player.points > 0 ? <LocalFireDepartmentIcon color='primary' sx={{marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '1vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                            {player.player === account ? <PersonIcon sx={{marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '1vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                        </Typography>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: isMobile ? '30vw' : '25vw'}}>
                            <Typography sx={{color: 'white', textAlign: 'right', marginTop: isMobile ? '1vw' : '', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>{player.points >= 0 ? player.points : <CircularProgress color='secondary' size={30}/>}</Typography>
                            <Button sx={{width: isMobile ? '' : '15vw', marginLeft: '1vw', fontSize: isMobile ? '' : '2vw'}} onClick={() => handleDisplayCards(player.cards)} variant='contained'>View</Button>
                        </div>
                    </div>
                </div>
            </ListItem>
        )
    }

    const handleDisplayCards = (cardIds) => {
        dispatch(setCardIds(formatIds(cardIds)));
        dispatch(setDisplayDialog(true));
    }

    const formatIds = (cardIds) => {
        const ids = [];
        for(let i = 0; i < cardIds.length; i++) {
            ids.push(
                BigNumber.from(cardIds[i]).toNumber()
            )
        }
        return ids;
    }

    const PlayerList = () => {

        players.sort((a, b) => {
            return b.points - a.points
        })

        return (
            <List sx={{top: '20vw'}}>
                {
                    players.map((player, i) => {
                        return (
                            <div key={i}>
                                <Divider />
                                <PlayerTile place={i + 1} player={player} />
                            </div>
                        )
                    })
                }
                <Divider />
            </List>
        )
    }

    return (
        <div>
            {displayDialog ? <GameDetailDialog mobile={isMobile} cards={selectedCards}/> : null}
            <div style={{position: 'fixed', backgroundColor: '#7ebc89', zIndex: 1, padding: '2vw 0'}}>
                <Typography sx={{width: '100vw', marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: isMobile ? '8vw' : '6vw', color: '#fff'}}>
                    <span style={{cursor: 'pointer'}} onClick={backToGames}><ArrowBackIcon sx={{backgroundColor: 'white', borderRadius: '4px', position: 'fixed', left: '3vw', fontSize: isMobile ? '13vw' : '7vw'}} color='third' /></span>Game Details
                </Typography>
            </div>
            {loading ? <CircularProgress style={{marginTop: isMobile ? '35vw' : '20vw'}} color='secondary' size={200} /> : <PlayerList />}
        </div>
    )
}

export default GameDetails;