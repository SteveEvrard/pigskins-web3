import { Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import NFTContract from '../ethereum/NFTContract';
import web3 from '../ethereum/web3';
import CircularProgress from '@mui/material/CircularProgress';
import CardPack from './CardPack';
import { useSelector } from 'react-redux';

const Purchase = ( props ) => {

    const account = useSelector((state) => state.account.value);
    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [displayCardPack, setDisplayCardPack] = useState(false);

    const buyCardPack = async () => {
        
        setLoading(true);
        setDisplayCardPack(false);

        try {
          await NFTContract.methods.purchaseCardPack()
            .send({from: account, value: web3.utils.toWei('0.005', 'ether')})
            .then(data => { 
                setEvents(data.events);
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
                    <PlayerCard flippable={false} width='350px' number={15} team={'9'} cardType={'3'} attributes={'180000000000'} />
                    <PlayerCard flippable={false} width='350px' number={10} team={'23'} cardType={'0'} attributes={'104444000000'} />
                </div>
                <div style={{marginTop: '30px', width: '50%'}}>
                    <Typography sx={{color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h2'>Purchase Card Pack Now!</Typography>
                    <Typography sx={{color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>Each pack contains 10 unique player cards,</Typography>
                    <Typography sx={{color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>cards can be used to compete, trade, and more!</Typography>
                    <Button disabled={loading} sx={{fontSize: '30px', fontFamily: "Work Sans, sans-serif", height: '65px', width: '50%', marginTop: '30px'}} onClick={buyCardPack} size='large' variant='contained' color='primary'>{loading ? <CircularProgress color='secondary' /> : 'Buy'}</Button>
                </div>
                <div>
                    <PlayerCard flippable={false} width='350px' number={12} team={'19'} cardType={'2'} attributes={'193333300000'} />
                    <PlayerCard flippable={false} width='350px' number={4} team={'11'} cardType={'1'} attributes={'100999000000'} />
                </div>
            </div>
            {displayCardPack ? <CardPack data={events}/> : null}
        </div>
    )
}

export default Purchase;