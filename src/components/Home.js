import React from 'react';
import Paper from '@mui/material/Paper';
import { Button, CardHeader, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import homeDesktop from '../images/home-desktop.png';
import fillerCards from '../images/filler-cards.png';
import { useSelector, useDispatch } from 'react-redux';
import { setAccount } from '../store/account/accountSlice';

const Home = ( props ) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isMobile = useSelector((state) => state.mobile.value);
    const account = useSelector((state) => state.account.value);

    const connect = async () => {
        if(isMobile && !window.ethereum) {
            window.open('https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202')
        } else {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            dispatch(setAccount(account));
            window.location.reload();
        }
    }

    function goToPurchase() {
        history.push('/purchase');
    }

    return(
        <div>
            <div style={{display: isMobile ? 'block' : 'flex', justifyContent: 'space-evenly', marginBottom: '-4px'}}>
                <div style={{width: '45vw'}}>
                    <img alt='' style={{width: isMobile ? '100vw' : '45vw'}} src={homeDesktop}/>
                </div>
                <div style={isMobile ? {marginTop: '-5px'} : {width: '60vw'}}>
                    <Paper sx={{backgroundColor: '#eeece6'}} square elevation={0} style={{height: '99%'}}>
                        <CardHeader sx={{padding: 0, paddingTop: '3vw'}} titleTypographyProps={{style: {fontSize: isMobile ? '8vw' : '3vw' }}} title='COLLECTIBLE' />
                        <CardHeader sx={{padding: 0}} titleTypographyProps={{style: {fontSize: isMobile ? '8vw' : '3vw', fontWeight: 600}}} title='NFT CARDS' />
                        <Typography sx={{fontSize: isMobile ? '4vw' : '1.5vw', padding: '2vw'}} component='p'>
                            Collect thousands of different football cards and compete with other players to win ETH!
                        </Typography>
                        <Typography sx={{fontSize: isMobile ? '4vw' : '1.5vw', paddingBottom: '2vw'}} component='p'>
                            Each card has its own unique attributes and rareness!
                        </Typography>
                        {account ? 
                            <Button disableElevation sx={isMobile ? {marginBottom: '10vw'} : {width: '12vw', height: '4vw', fontSize: '1.6vw', fontWeight: 600}} onClick={goToPurchase} variant='contained' color='primary'>PURCHASE</Button>
                            :
                            <Button sx={isMobile ? {marginBottom: '10vw'} : {}} size='large' onClick={connect} variant='contained' color='primary'>Connect</Button>
                        }
                    </Paper>
                </div>
            </div>
            <div style={{display: isMobile ? 'block' : 'flex', backgroundColor: 'white'}}>
                <div style={{width: isMobile ? '100vw' : '35vw', marginLeft: isMobile ? '' : '7vw'}}>
                    <Typography sx={{textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '4vw' : '2vw', padding: '2vw', paddingBottom: 0}} component='h4'>
                        PURCHASE CARD PACKS <span style={{fontWeight: 600}}>NOW</span>
                    </Typography>
                    <Typography sx={{textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '4vw' : '1.2vw', padding: '2vw', paddingTop: '.5vw', paddingBottom: '.5vw'}} component='p'>
                        Each pack contains 10 unique player cards. Cards can be used to compete, trade, and more!
                    </Typography>
                    <div style={{display: 'flex', justifyContent: isMobile ? 'center' : 'left', marginLeft: isMobile ? '' : '2vw'}}>
                        <Button disableElevation sx={isMobile ? {fontWeight: 600, color: '#fff', marginTop: '2vw'} : {width: '8vw', height: '3vw', fontSize: '1.3vw', fontWeight: 600, color: '#fff'}} onClick={goToPurchase} variant='contained' color='darkGreen'>BUY</Button>
                    </div>
                </div>
                <div style={isMobile ? {} : {width: '45vw', margin: 'auto', marginTop: '-3vw'}}>
                    <img alt='' style={{width: isMobile ? '100vw' : '45vw'}} src={fillerCards}/>
                </div>
            </div>
        </div>
    )
}

export default Home;