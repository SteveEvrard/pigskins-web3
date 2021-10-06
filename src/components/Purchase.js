import { Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import NFTContract, { contractAddress } from '../ethereum/NFTContract';
import web3 from '../ethereum/web3';
import CircularProgress from '@mui/material/CircularProgress';
import CardPack from './CardPack';
import { useSelector } from 'react-redux';

const Purchase = ( props ) => {

    const account = useSelector((state) => state.account.value);
    const isMobile = useSelector((state) => state.mobile.value);
    const [errors, setErrors] = useState('');
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
            setErrors(err.message.toString());
        }
        setLoading(false);
    }

    // const buyCardPackMobile = async () => {
        
    //     setLoading(true);
    //     setDisplayCardPack(false);

    //     const data = NFTContract.methods.purchaseCardPack().encodeABI();

    //     const params = [{
    //         from: account,
    //         to: contractAddress,
    //         data: data,
    //         value: web3.utils.toHex(web3.utils.toWei('0.005', 'ether'))
    //     }]

    //     try {
    //         await window.ethereum.request({
    //             method: 'eth_sendTransaction',
    //             params,
    //         })
    //         .then(data => { 
    //             console.log('DATA Mobile', data)
    //             NFTContract.events.CardPackPurchased()
    //         });
    //     } catch(err) {
    //         console.log(err);
    //     }
    //     setLoading(false);
    // }

    return (
        <div>
            <div>{errors}</div>
            <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                {!isMobile ? 
                <div>
                    <PlayerCard flippable={false} width='350px' number={15} team={'9'} cardType={'3'} attributes={'18000033333330'} />
                    <PlayerCard flippable={false} width='350px' number={10} team={'23'} cardType={'0'} attributes={'104444033333330'} />
                </div> : null}
                <div style={{marginTop: '30px', width: '90vw'}}>
                    <Typography sx={{fontSize: isMobile ? '12vw' : '7vw', color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h2'>Purchase Card Pack Now!</Typography>
                    <Typography sx={{fontSize: isMobile ? '7vw' : '3vw', color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>Each pack contains 10 unique player cards.</Typography>
                    <Typography sx={{fontSize: isMobile ? '7vw' : '3vw', color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>Cards can be used to compete, trade, and more!</Typography>
                    <Button disabled={loading} sx={{fontSize: '30px', fontFamily: "Work Sans, sans-serif", height: '65px', width: '50%', marginTop: '30px'}} onClick={buyCardPack} size='large' variant='contained' color='primary'>{loading ? <CircularProgress color='secondary' /> : 'Buy'}</Button>
                    {isMobile ? 
                        <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '5vw'}}>
                            <PlayerCard flippable={false} width='50vw' number={12} team={'19'} cardType={'2'} attributes={'193333305678900'} />
                            <PlayerCard flippable={false} width='50vw' number={4} team={'11'} cardType={'1'} attributes={'100999000000'} />
                        </div> : null
                    }
                </div>
                {!isMobile ? 
                <div>
                    <PlayerCard flippable={false} width='350px' number={12} team={'19'} cardType={'2'} attributes={'193333303333300'} />
                    <PlayerCard flippable={false} width='350px' number={4} team={'11'} cardType={'1'} attributes={'100999000000'} />
                </div> : null}
            </div>
            {displayCardPack ? <CardPack data={events}/> : null}
        </div>
    )
}

export default Purchase;