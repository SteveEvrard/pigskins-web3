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

const Games = ( props ) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);
    const [account, setAccount] = useState('');
    const [displayMessage, setDisplayMessage] = useState(false);
    const headerMessage = 'No Open Games';
    const message = 'Games Will Be Opened Shortly. Please Check Back Soon to Join.';

    useEffect(() => {
        getOpenGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getOpenGames = async () => {
        setLoading(true);
        const playerAccount = await getAccount();
        setAccount(playerAccount);
        const allGames = await getAllOpenedGames();
        const allGameIds = filterForGameIds(allGames);
        const gameDetails = await getGameDetailsById(allGameIds);
        const gamesWithPlayers = await mapPlayersToGameDetails(gameDetails);
        const mappedGameDetails = mapData(gamesWithPlayers);
        setGames(mappedGameDetails);
        setLoading(false);
    }

    const getAllOpenedGames = async () => {
        return ContractWithSigner.queryFilter(Contract.filters.GameCreated())
    }

    const filterForGameIds = ( games ) => {
        const ids = [];
        
        games.forEach(game => {
            ids.push(BigNumber.from(game.args.gameId).toNumber());
        })

        return ids;
    }

    const getGameDetailsById = ( gameIds ) => {
        const promises = [];

        for(let i = 0; i < gameIds.length; i++) {
            promises.push(
                ContractWithSigner.gameIdToGame(gameIds[i])
            )
        }

        return Promise.all(promises);
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
        history.push(`/games/${game.gameId}`)
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
                                <Button disabled={game.players.includes(account)} onClick={() => handleDisplay(game)} sx={{fontSize: isMobile ? '' : '2vw' ,width: isMobile ? '40vw' : '20vw'}} variant='contained'>Join</Button>
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
                Open Games
            </Typography>
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : createGameTiles(games)}
            {displayDialog ? <JoinGameDialog /> : null}
        </div>
    )
}

export default Games;