import { Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import NFTContract from '../ethereum/NFTContract';
import web3 from '../ethereum/web3';
import CircularProgress from '@mui/material/CircularProgress';
import CardPack from './CardPack';

const Purchase = ( props ) => {

    const [loading, setLoading] = useState(false);
    const [displayCardPack, setDisplayCardPack] = useState(false);

    useEffect(() => {

    }, [displayCardPack])

    let cards = [
        {cardId: 0, playerId: 5, attributeHash: 1000, cardType: 0},
        {cardId: 1, playerId: 23, attributeHash: 1000, cardType: 0},
        {cardId: 2, playerId: 0, attributeHash: 1000, cardType: 1},
        {cardId: 3, playerId: 1, attributeHash: 1000, cardType: 0},
        {cardId: 4, playerId: 9, attributeHash: 1000, cardType: 0},
        {cardId: 5, playerId: 28, attributeHash: 1000, cardType: 3},
        {cardId: 6, playerId: 11, attributeHash: 1000, cardType: 0},
        {cardId: 7, playerId: 29, attributeHash: 1000, cardType: 0},
        {cardId: 8, playerId: 30, attributeHash: 1000, cardType: 2},
        {cardId: 9, playerId: 19, attributeHash: 1000, cardType: 1}
    ];

    const buyCardPack = async () => {
        
        setLoading(true);
        setDisplayCardPack(false);

        try {
          await NFTContract.methods.purchaseCardPack()
            .send({from: props.account, value: web3.utils.toWei('0.005', 'ether')})
            .then(data => { 
                setLoading(false);
                setDisplayCardPack(true);
             });
        } catch(err) {
          console.log(err);
        }

        setLoading(false);
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                <div>
                    <PlayerCard flippable={false} width='350px' team={'9'} cardType={'3'} attrHash={1000} />
                    <PlayerCard flippable={false} width='350px' team={'23'} cardType={'0'} attrHash={1000} />
                </div>
                <div style={{marginTop: '30px', width: '50%'}}>
                    <Typography sx={{color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h2'>Purchase Card Pack Now!</Typography>
                    <Typography sx={{color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>Each pack contains 10 unique player cards,</Typography>
                    <Typography sx={{color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>cards can be used to compete, trade, and more!</Typography>
                    <Button disabled={loading} sx={{fontSize: '30px', fontFamily: "Work Sans, sans-serif", height: '65px', width: '50%', marginTop: '30px'}} onClick={buyCardPack} size='large' variant='contained' color='primary'>{loading ? <CircularProgress color='secondary' /> : 'Buy'}</Button>
                </div>
                <div>
                    <PlayerCard flippable={false} width='350px' team={'19'} cardType={'2'} attrHash={1000} />
                    <PlayerCard flippable={false} width='350px' team={'11'} cardType={'1'} attrHash={1000} />
                </div>
            </div>
            {displayCardPack ? <CardPack cards={cards}/> : null}
        </div>
    )
}

export default Purchase;