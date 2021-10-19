import React from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import cards from '../images/cards.png';
import { useSelector, useDispatch } from 'react-redux';
import { setAccount } from '../store/account/accountSlice';

const Home = ( props ) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isMobile = useSelector((state) => state.mobile.value);
    const account = useSelector((state) => state.account.value);

    async function getAccount() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        dispatch(setAccount(account));
    }

    function goToPurchase() {
        history.push('/purchase');
    }

    return(
        <div style={{display: isMobile ? 'block' : 'flex', marginTop: '2vw', justifyContent: 'space-evenly'}}>
            <div>
                <img alt='' style={{width: '100%'}} src={cards}/>
            </div>
            <div style={isMobile ? {width: '90vw', margin: 'auto', marginBottom: '3vw'} : {}}>
                <Card style={{marginRight: isMobile ? '0' : '25px', height: '100%'}}>
                    <CardHeader title='Collectible NFT Cards' />
                    <CardContent>
                        <Typography>
                            Collect hundreds of different football cards and compete with other players to win ETH! Each card has their own unique attributes and rareness!
                        </Typography>
                    </CardContent>
                    {account ? 
                        <Button sx={isMobile ? {marginBottom: '10vw'} : {}} size='large' onClick={goToPurchase} variant='contained' color='primary'>Purchase</Button>
                        :
                        <Button sx={isMobile ? {marginBottom: '10vw'} : {}} size='large' onClick={getAccount} variant='contained' color='primary'>Connect</Button>
                    }
                </Card>
            </div>
        </div>
    )
}

export default Home;