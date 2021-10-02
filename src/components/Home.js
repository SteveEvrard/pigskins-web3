import React from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import cards from '../images/cards.png';
import { useSelector } from 'react-redux';

const Home = ( props ) => {

    const history = useHistory();
    const isMobile = useSelector((state) => state.mobile.value);
    console.log(isMobile);

    function goToPurchase() {
        history.push('/purchase');
    }

    return(
        <div style={{display: isMobile ? 'block' : 'flex', justifyContent: 'space-evenly'}}>
            <div>
                <img alt='' style={{width: '100%'}} src={cards}/>
            </div>
            <div style={isMobile ? {width: '90vw', margin: 'auto'} : {}}>
                <Card style={{marginRight: isMobile ? '0' : '25px', height: '100%'}}>
                    <CardHeader title='Collectible NFT Cards' />
                    <CardContent>
                        <Typography>
                            Collect hundreds of different football cards. Each with their own attributes and rareness!
                        </Typography>
                    </CardContent>
                    <Button sx={isMobile ? {marginBottom: '10vw'} : {}} size='large' onClick={goToPurchase} variant='contained' color='primary'>Get Started</Button>
                </Card>
            </div>
        </div>
    )
}

export default Home;