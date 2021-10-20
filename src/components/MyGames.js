import React, { useEffect, useState } from 'react';
import { ContractWithSigner, Contract, signer } from '../ethereum/ethers';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { BigNumber, ethers } from 'ethers';
import CircularProgress from '@mui/material/CircularProgress';
import JoinGameDialog from './dialogs/JoinGameDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setGame } from '../store/games/gameSlice';
import { useHistory } from 'react-router-dom';
import PageContext from './PageContext';

const MyGames = ( props ) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    const [loading, setLoading] = useState(false);
    const [myGames, setMyGames] = useState([]);
    const [displayMessage, setDisplayMessage] = useState(false);
    const headerMessage = 'No Active Games';
    const message = 'Please Check Open Games to Join a New Game';

    useEffect(() => {
        getOpenGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getOpenGames = async () => {
        setLoading(true);
        const playerAccount = await getAccount();
        const allGamesJoined = await getAllGamesByUser(playerAccount);
        const allGamesJoinedWithDetails = await getGameDetails(allGamesJoined);
        const allOpenGames = filterForOpenGames(allGamesJoinedWithDetails);
        const gamesWithPlayers = await mapPlayersToGameDetails(allOpenGames);
        const mappedGameDetails = mapData(gamesWithPlayers);
        setLoading(false);
        setMyGames(mappedGameDetails);
    }

    const getAllGamesByUser = async ( account ) => {
        return ContractWithSigner.queryFilter(Contract.filters.GameJoined(null, account))
    }

    const getGameDetails = async ( games ) => {
        const promises = [];

        for(let i = 0; i < games.length; i++) {
            promises.push(
                ContractWithSigner.gameIdToGame(games[i].args[0])
            )
        }

        return Promise.all(promises);
    }

    const filterForOpenGames = ( games ) => {
        return games.filter(game => {
            return game.open;
        })
    }

    const getPlayersByGameId = async ( gameId ) => {
        return await ContractWithSigner.getPlayersByGameId(BigNumber.from(gameId).toNumber());
    }

    const mapPlayersToGameDetails = async ( games ) => {
        const mappedData = games.map(async (game) => {
            const players = await getPlayersByGameId(game.gameId);
            return {...game, players: players}
        });

        return Promise.all(mappedData);
    }

    const mapData = ( games ) => {
        const mappedDetails = [];

        for(let i = 0; i < games.length; i++) {
            const entryFee = BigNumber.from(games[i].entryFee).toString();
            const gameId = BigNumber.from(games[i].gameId).toString();
            const numberOfCardsPerPlayer = BigNumber.from(games[i].numberOfCardsPerPlayer).toString();
            const numberOfPlayers = BigNumber.from(games[i].numberOfPlayers).toString();
    
            mappedDetails.push({active: games[i].active, entryFee, gameId, numberOfCardsPerPlayer, numberOfPlayers, open: games[i].open, players: games[i].players, winner: games[i].winner});
        }
        if(games.length === 0) setDisplayMessage(true);

        return mappedDetails;
    }

    const getNumberOfActivePlayers = ( players ) => {
        let activePlayers = 0;

        for(let i = 0; i < players.length; i++) {
            if(players[i] !== '0x0000000000000000000000000000000000000000') {
                activePlayers++;
            }
        }

        return activePlayers;
    }

    const handleDisplay = (game) => {
        dispatch(setGame(game))
        history.push(`/my-games/${game.gameId}`)
    }

    const createGameTiles = ( games ) => {
        return games.map((game, i) => {
            return(
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '3vw' : '1vw'}} key={i}>
                    <div style={{width: isMobile ? '90vw' : '55vw'}}>
                        <Card sx={{color: 'white', backgroundColor: '#31572c'}}>
                            <CardContent sx={{display: 'flex', justifyContent: 'space-between'}}>
                                {!isMobile ? <div style={{marginTop: '1vw', fontSize: '3vw', fontWeight: 600, textAlign: 'left'}}>{ ethers.utils.formatEther(game.entryFee) } ETH</div> : null}
                                <div>
                                    {isMobile ? <div style={{fontWeight: 600, textAlign: 'left'}}>{ ethers.utils.formatEther(game.entryFee) } ETH</div> : null}
                                    <div style={{fontSize: isMobile ? '' : '2vw', fontWeight: 600, textAlign: 'left'}}>{ game.numberOfCardsPerPlayer } Cards</div>
                                    <div style={{fontSize: isMobile ? '' : '2vw', fontWeight: 600, textAlign: 'left'}}>Players {getNumberOfActivePlayers(game.players)}/{game.numberOfPlayers}</div>
                                </div>
                                <Button onClick={() => handleDisplay(game)} sx={{fontSize: isMobile ? '' : '2vw' ,width: isMobile ? '40vw' : '20vw'}} variant='contained'>View</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )
        })
    }

    return (
        <div style={{marginTop: '2vw'}}>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: '#fff'}}>
                My Games
            </Typography>
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : createGameTiles(myGames)}
            {displayDialog ? <JoinGameDialog /> : null}
        </div>
    )
}

export default MyGames;