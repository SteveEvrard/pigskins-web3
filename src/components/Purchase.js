import { Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import CardPack from './CardPack';
import { useSelector } from 'react-redux';
import { Contract, ContractWithSigner } from '../ethereum/ethers';
import { ethers } from "ethers";

const Purchase = ( props ) => {

    const account = useSelector((state) => state.account.value);
    const isMobile = useSelector((state) => state.mobile.value);
    const [loading, setLoading] = useState(false);
    const [displayCardPack, setDisplayCardPack] = useState(false);

    const buyCardPack = async () => {
        
        ContractWithSigner.purchaseCardPack({from: account, value: ethers.utils.parseEther("0.005")})
            .then(data => {
                setLoading(true);
                setDisplayCardPack(false);
                Contract.once(Contract.filters.CardPackPurchased(account), () => {
                    setLoading(false);
                    setDisplayCardPack(true);
                })
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
        setLoading(false);
    }

    return (
        <div>
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
            {displayCardPack ? <CardPack/> : null}
        </div>
    )
}

export default Purchase;