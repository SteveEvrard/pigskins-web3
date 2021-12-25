import React, { useState } from 'react';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ethers } from "ethers";
import { ContractWithSigner, GameContractWithSigner, GameContract, signer } from '../ethereum/ethers';
import { endActiveGamesByWeek } from '../utils/WinnerUtil';

const Admin = ( props ) => {

    const [secret, setSecret] = useState('');
    const [players, setPlayers] = useState(10);
    const [cards, setCards] = useState(6);
    const [fee, setFee] = useState(0.1);
    const [cardPackPrice, setCardPackPrice] = useState(0.1);
    const [week, setWeek] = useState(0);
    const [processing, setProcessing] = useState(false);
    const getAccount = async () => signer.getAddress();

    const handlePlayersChange = (event) => {
        setPlayers(event.target.value);
    };

    const handleCardChange = (event) => {
        setCards(event.target.value);
    };

    const handleFeeChange = (event) => {
        setFee(event.target.value);
    };

    const handlePurchasePriceChange = (event) => {
        setCardPackPrice(event.target.value);
    };

    const handleWeekChange = (event) => {
        setWeek(event.target.value);
    };

    const handleSecretChange = (event) => {
        setSecret(event.target.value);
    }

    const createGame = async () => {
        const priceInWei = ethers.utils.parseEther(fee.toString());
        setProcessing(true);

        GameContractWithSigner.createGame(players, cards, priceInWei, week)
            .then(() => {
                GameContract.once(GameContract.filters.GameCreated(), () => {
                    setProcessing(false);
                })
            })
            .catch(err => {
                console.log(err);
                setProcessing(false);
            })
    }

    const withdraw = async () => {
        const amount = ethers.utils.parseEther('5');
        setProcessing(true);

        ContractWithSigner.withdraw(amount).then(() => {
            setProcessing(false)
        })
        .catch((err) => {
            console.log(err);
            setProcessing(false);
        })
    }

    const createCustomCard = async () => {
        setProcessing(true);
        ContractWithSigner.mintCustomCard('0xbC042A410A990144aE4F91Dd89293299c9bF283E', 19, 2, 99999999999999).then(() => {
            setProcessing(false);
        })
        .catch(err => {
            console.log(err);
            setProcessing(false)
        })
    }

    const setSecretCall = async () => {
        const account = await getAccount();
        setProcessing(true);

        GameContractWithSigner.setSecret(secret, {from: account}).then(() => {
            setProcessing(false);
        })
    }

    const setCardPurchase = async () => {
        const amount = ethers.utils.parseEther(cardPackPrice.toString());
        setProcessing(true);

        ContractWithSigner.setCardPackFee(amount).then(() => {
            setProcessing(false);
        })
    }

    const setPlayerCount = async (count) => {
        setProcessing(true);

        ContractWithSigner.setTotalPlayers(count).then(() => {
            setProcessing(false);
        })
    }

    const CreateGameComponent = () => {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '75vw'}}>
                        <TextField
                            error={ players <= 0 }
                            color='selected'
                            margin='dense'
                            id='name'
                            label='Total Players'
                            type='number'
                            fullWidth
                            variant='outlined'
                            value={players}
                            onChange={handlePlayersChange}
                        />
                        <TextField
                            error={ cards <= 0 }
                            color='selected'
                            margin='dense'
                            id='name'
                            label='Total Cards'
                            type='number'
                            fullWidth
                            variant='outlined'
                            value={cards}
                            onChange={handleCardChange}
                        />
                        <TextField
                            error={ fee <= 0 }
                            color='selected'
                            margin='dense'
                            id='name'
                            label='Entry Fee'
                            type='number'
                            fullWidth
                            variant='outlined'
                            value={fee}
                            onChange={handleFeeChange}
                        />
                        <TextField
                            error={ week <= 0 }
                            color='selected'
                            margin='dense'
                            id='name'
                            label='Week'
                            type='number'
                            fullWidth
                            variant='outlined'
                            value={week}
                            onChange={handleWeekChange}
                        />
                    </div>
                </div>
                <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={createGame} sx={{marginTop: '5vw'}} variant='contained'>Create</Button></div>
                    </div>
                }
                </div>
            </div>
        )
    }

    const CreateCustomCardComponent = () => {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '75vw'}}>
                    </div>
                </div>
                <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={createCustomCard} sx={{marginTop: '5vw'}} variant='contained'>Mint</Button></div>
                    </div>
                }
                </div>
            </div>
        )
    }

    const SetSecretComponent = () => {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '75vw'}}>
                        <TextField
                            color='selected'
                            margin='dense'
                            label='Secret'
                            fullWidth
                            variant='outlined'
                            value={secret}
                            onChange={handleSecretChange}
                        />
                    </div>
                </div>
                <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={setSecretCall} sx={{marginTop: '5vw'}} variant='contained'>Set</Button></div>
                    </div>
                }
                </div>
            </div>
        )
    }

    const SetPurchaseComponent = () => {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '75vw'}}>
                        <TextField
                            color='selected'
                            margin='dense'
                            label='Pack Price'
                            fullWidth
                            variant='outlined'
                            value={cardPackPrice}
                            onChange={handlePurchasePriceChange}
                        />
                    </div>
                </div>
                <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={setCardPurchase} sx={{marginTop: '5vw'}} variant='contained'>Set</Button></div>
                    </div>
                }
                </div>
            </div>
        )
    }

    const WithdrawButton = () => {
        return (
            <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={withdraw} sx={{marginTop: '5vw'}} variant='contained'>Withdraw ETH</Button></div>
                    </div>
                }
            </div>
        )
    }

    const SetPlayersButton = () => {
        return (
            <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={() => setPlayerCount(194)} sx={{marginTop: '5vw'}} variant='contained'>Set Players</Button></div>
                    </div>
                }
            </div>
        )
    }

    const EndGameButton = () => {
        return (
            <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='darkGreen' /></div>
                    :
                    <div>
                        <div><Button onClick={() => endActiveGamesByWeek('16')} sx={{marginTop: '5vw'}} variant='contained'>End Games</Button></div>
                    </div>
                }
            </div>
        )
    }

    return (
        <div>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: 'black'}}>
                Admin Dashboard
            </Typography>
            <CreateGameComponent />
            <WithdrawButton />
            <EndGameButton />
            <SetSecretComponent />
            <CreateCustomCardComponent />
            <SetPurchaseComponent />
            <SetPlayersButton />
        </div>
    )
}

export default Admin;