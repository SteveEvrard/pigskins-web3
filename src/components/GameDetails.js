import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Divider, List, ListItem, Typography } from '@mui/material';
import { signer, ContractWithSigner } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import JoinGameDialog from './dialogs/JoinGameDialog';
import PersonIcon from '@mui/icons-material/Person';

const GameDetails = ( props ) => {

    const history = useHistory();
    const displayDialog = useSelector((state) => state.game.value.displayDialog);
    // const dispatch = useDispatch();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const backToGames = () => {
        history.push('/my-games');
    }

    const getCards = async () => {
        setLoading(true);
        const user = await getAccount();
        setAccount(user);
        console.log(game);
        const activePlayers = filterActivePlayers(game);
        console.log(activePlayers);
        const playerWithCardIds = await mapPlayerToCardIds(activePlayers);
        console.log(playerWithCardIds);
        setPlayers(playerWithCardIds);
        // const allCardIds = await getAllCardIds(account);
        // const ownedCards = filterCurrentlyOwnedCards(allCardIds);
        // const cardsWithDetails = await getCardDetailsById(ownedCards);
        // const availableCards = filterForAvailableCards(cardsWithDetails);
        // const mappedCards = availableCards.map(card => {
        //     return mapCardData(card)
        // });

        setLoading(false);
        // setCards(mappedCards);
        // if(mappedCards.length === 0) setDisplayMessage(true);
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
                {player: players[i], cards: await ContractWithSigner.getCardEntriesByPlayer(BigNumber.from(game.gameId), players[i])}
            )
        }

        return Promise.all(promises);
    }

    const PlayerTile = ( player ) => {

        const shortenAddress = (address) => {
            console.log(typeof address)
            
            return address.substring(0, 6) + '...' + address.substring(38);
        }
        return (
            <ListItem sx={{display: 'flex', cursor: 'pointer'}}>
                <div>
                    <div style={{width: '90vw', display: 'flex', justifyContent: 'space-between'}}>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>
                            {shortenAddress(player.player)}
                            {player.player === account ? <PersonIcon sx={{marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '2vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                        </Typography>
                        <Typography sx={{color: 'white', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>0</Typography>
                    </div>
                </div>
            </ListItem>
        )
    }

    const PlayerList = () => {

        return (
            <List sx={{top: '20vw'}}>
                {
                    players.map((player, i) => {
                        return (
                            <div key={i}>
                                <Divider />
                                <PlayerTile player={player.player} />
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
                    <span style={{cursor: 'pointer'}} onClick={backToGames}><ArrowBackIcon sx={{backgroundColor: 'white', borderRadius: '4px', position: 'fixed', left: '3vw', fontSize: isMobile ? '13vw' : '7vw'}} color='third' /></span>Game Details
                </Typography>
            </div>
            {loading ? <CircularProgress style={{marginTop: '35vw'}} color='secondary' size={200} /> : <PlayerList />}
        </div>
    )
}

export default GameDetails;