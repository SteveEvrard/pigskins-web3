import React from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import cards from '../images/cards.png';

const Home = ( props ) => {

    const history = useHistory();

    function goToPurchase() {
        history.push('/purchase');
    }

    return(
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <div>
                <img alt='not found' style={{width: '100%'}} src={cards}/>
            </div>
            <div>
                <Card style={{marginRight: '25px', height: '100%'}}>
                    <CardHeader title='Collectible NFT Cards' />
                    <CardContent>
                        <Typography>
                            Collect hundreds of different football cards. Each with their own attributes and rareness!
                        </Typography>
                    </CardContent>
                    <Button size='large' onClick={goToPurchase} variant='contained' color='primary'>Get Started</Button>
                </Card>
            </div>
        </div>
    )
}

export default Home;