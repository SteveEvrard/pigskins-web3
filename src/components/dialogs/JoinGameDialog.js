import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setDisplayDialog } from '../../store/games/gameSlice';
import { GameContract, GameContractWithSigner, signer } from '../../ethereum/ethers';
import { BigNumber, ethers } from "ethers";
import AlertMessage from './AlertMessage';
import { getPlayerNameById, getPlayerPositionById } from '../../utils/PlayerUtil';

const JoinGameDialog = ( { mobile } ) => {
    
    const mobileStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '6vw'};
    const desktopStyle = {display: 'block', justifyContent: 'space-evenly', marginTop: '1vw'};
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();
    const game = useSelector((state) => state.game.value.game);
    const cards = useSelector((state) => state.game.value.selectedCards);
    const cardIds = cards.map(card => BigNumber.from(card.cardId))
    const [processing, setProcessing] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');
    const sortOrder = ['QB', 'RB', 'WR', 'TE'];
    let sorted = cards.slice();
    sorted = Array.from(sorted);
    sorted.sort((a, b) => {
        return sortOrder.indexOf(getPlayerPositionById(a.playerId)) - sortOrder.indexOf(getPlayerPositionById(b.playerId))
    })

    const handleCancel = () => {
        dispatch(setDisplayDialog(false));
        setError('');
    };

    const joinGame = async () => {
        setProcessing(true);

        const account = await getAccount();
        const gameId = BigNumber.from(game.gameId).toNumber();
        const entryFee = ethers.utils.formatEther(BigNumber.from(game.entryFee.toString()));

        GameContractWithSigner.joinGame(gameId, cardIds, {from: account, value: ethers.utils.parseEther(entryFee)})
            .then(() => {
                GameContract.once(GameContract.filters.GameJoined(null, account), () => {
                    setProcessing(false);
                    setComplete(true);
                })
            })
            .catch(err => {
                console.log(err);
                setProcessing(false);
                setComplete(true);
                setError('Error! Please try again.');
                if(err.error) setError(err.error.message);
            })
    }

    return (
        <Dialog PaperProps={{style: mobile ? {minWidth: '80vw'} : {width: '40vw'}}} open={true}>
            <DialogTitle sx={{paddingBottom: '0', fontSize: mobile ? '6vw' : '3vw', fontWeight: 600, fontFamily: "Work Sans, sans-serif", backgroundColor: '#fff', color: 'black', textAlign: 'center'}}>Your Team</DialogTitle>
            <DialogContent sx={{backgroundColor: '#fff', paddingTop: '20px !important'}}>
                { complete ? 
                <AlertMessage shouldRoute={true} successMessage='Game Joined! Good Luck!' error={error} mobile={mobile} />
                :
                processing ? 
                <div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='primary' /></div>
                :
                <div>
                    {
                        sorted.map((card, i) => {
                            return (
                                <div style={{fontWeight: 600, fontSize: mobile ? '5vw' : '2vw', fontFamily: "Work Sans, sans-serif"}} key={i}>
                                    {getPlayerPositionById(card.playerId) + ': ' + getPlayerNameById(card.playerId)}
                                </div>
                            )
                        })
                    }
                    <div style={mobile ? mobileStyle : desktopStyle}>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button style={{fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={joinGame} size='large' variant='contained'>Join {ethers.utils.formatEther(BigNumber.from(game.entryFee))} ETH</Button></div>
                        <div style={{display: 'flex', justifyContent: 'center', marginBottom: mobile ? '3vw' : '1vw'}}><Button style={{color: 'black', backgroundColor: 'lightgrey', fontWeight: 600, fontSize: mobile ? '4vw' : '1.3vw', width: mobile ? '70vw' : '26vw'}} onClick={handleCancel} size='large' variant='contained'>Cancel</Button></div>
                    </div>
                </div>
                }
            </DialogContent>
        </Dialog>
    )
}

export default JoinGameDialog;