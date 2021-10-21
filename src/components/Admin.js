import React, { useState } from 'react';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ethers } from "ethers";
import { ContractWithSigner, Contract, signer } from '../ethereum/ethers';

const Admin = ( props ) => {

    const [players, setPlayers] = useState(10);
    const [cards, setCards] = useState(6);
    const [fee, setFee] = useState(0.1);
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

    const createGame = async () => {
        const account = await getAccount();
        const priceInWei = ethers.utils.parseEther(fee.toString());
        setProcessing(true);

        ContractWithSigner.createGame(players, cards, priceInWei, {from: account})
            .then(() => {
                Contract.once(Contract.filters.GameCreated(), () => {
                    setProcessing(false);
                })
            })
            .catch(err => {
                console.log(err);
                setProcessing(false);
            })
    }

    const withdraw = async () => {
        const account = await getAccount();
        const amount = ethers.utils.parseEther('0.01');
        setProcessing(true);

        ContractWithSigner.withdraw(amount, {from: account}).then(() => {
            setProcessing(false)
        })
        .catch((err) => {
            console.log(err);
            setProcessing(false);
        })
    }

    return (
        <div>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: '#fff'}}>
                Create Games
            </Typography>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '75vw'}}>
                    <TextField
                        autoFocus
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
                        autoFocus
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
                        autoFocus
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
                </div>
            </div>
            <div>
                {processing ? 
                    <div style={{marginTop: '5vw', display: 'flex', justifyContent: 'center'}}><CircularProgress size={100} color='secondary' /></div>
                    :
                    <div>
                        <div><Button onClick={createGame} sx={{marginTop: '5vw'}} variant='contained'>Create</Button></div>
                        <div><Button onClick={withdraw} sx={{marginTop: '5vw'}} variant='contained'>Withdraw ETH</Button></div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Admin;