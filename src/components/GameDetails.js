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
import axios from 'axios';
import { getPlayerApiIdById } from '../utils/PlayerUtil';
import { getItems } from './ViewCard';

const GameDetails = ( props ) => {

    const history = useHistory();
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    const dispatch = useDispatch();
    const [players, setPlayers] = useState([]);
    const [account, setAccount] = useState('');
    const [week, setWeek] = useState('');
    const [selectedCards, setSelectedCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);
    const game = useSelector((state) => state.game.value.game);

    useEffect(() => {
        getCards();
        setSelectedCards([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const backToGames = () => {
        history.push('/my-games');
    }

    const getCards = async () => {
        setLoading(true);
        const currentWeek = await (await axios.get(`https://api.sportsdata.io/v3/nfl/scores/json/CurrentWeek?key=${process.env.REACT_APP_SD_API_KEY}`)).data;
        setWeek(currentWeek);
        const user = await getAccount();
        setAccount(user);
        const activePlayers = filterActivePlayers(game);
        const playerWithCardIds = await mapPlayerToCardIds(activePlayers);
        setPlayers(playerWithCardIds);

        setLoading(false);
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

    const PlayerTile = ( player ) => {

        const [score, setScore] = useState(-1);
        useEffect(() => {
            getScore(player.player.cards);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const getScore = async (cards) => {
            const cardsWithDetails = await getCardDetails(cards);
            const totalScore = await getTeamScore(cardsWithDetails);
            setScore(totalScore)
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

        const getSinglePlayerScore = async (card) => {
            const playerId = BigNumber.from(card.playerId).toString();
            const apiId = getPlayerApiIdById(playerId);
            const items = getItems(BigNumber.from(card.attributeHash).toString());
            const cardType = BigNumber.from(card.cardType).toString();

            return await calculatePoints(items, cardType, week, apiId);
        }

        const getTeamScore = async (cards) => {
            let points = 0;

            for(let i = 0; i < cards.length; i++) {
                const playerPoints = await getSinglePlayerScore(cards[i]);
                points = points + playerPoints;
            }

            return points;
        }

        return (
            <ListItem sx={{display: 'flex'}}>
                <div>
                    <div style={{width: '90vw', display: 'flex', justifyContent: 'space-between'}}>
                        <Typography sx={{color: 'white', marginTop: isMobile ? '1vw' : '', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>
                            {shortenAddress(player.player.player)}
                            {player.player.player === account ? <PersonIcon sx={{marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '2vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                        </Typography>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: isMobile ? '35vw' : '25vw'}}>
                            <Typography sx={{color: 'white', textAlign: 'right', marginTop: isMobile ? '1vw' : '', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>{score >= 0 ? score : <CircularProgress color='secondary' size={30}/>}</Typography>
                            <Button sx={{width: isMobile ? '' : '15vw', fontSize: isMobile ? '' : '2vw'}} onClick={() => handleDisplayCards(player.player.cards)} variant='contained'>View</Button>
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

        return (
            <List sx={{top: '20vw'}}>
                {
                    players.map((player, i) => {
                        return (
                            <div key={i}>
                                <Divider />
                                <PlayerTile player={player} />
                            </div>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <div>
            {displayDialog ? <GameDetailDialog mobile={isMobile} cards={selectedCards}/> : null}
            <div style={{position: 'fixed', backgroundColor: '#7ebc89', zIndex: 1, padding: '2vw 0'}}>
                <Typography sx={{width: '100vw', marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: '#fff'}}>
                    <span style={{cursor: 'pointer'}} onClick={backToGames}><ArrowBackIcon sx={{backgroundColor: 'white', borderRadius: '4px', position: 'fixed', left: '3vw', fontSize: isMobile ? '13vw' : '7vw'}} color='third' /></span>Game Details
                </Typography>
            </div>
            {loading ? <CircularProgress style={{marginTop: '35vw'}} color='secondary' size={200} /> : <PlayerList />}
        </div>
    )
}

export default GameDetails;