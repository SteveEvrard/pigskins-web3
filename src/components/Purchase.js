import { Typography, Button, Card } from '@mui/material';
import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import CardPack from './CardPack';
import { useDispatch, useSelector } from 'react-redux';
import { Contract, ContractWithSigner, signer } from '../ethereum/ethers';
import { ethers } from "ethers";
import { setCardDetail } from '../store/card-detail/cardDetailSlice';

const Purchase = ( props ) => {

    const dispatch = useDispatch();
    const isMobile = useSelector((state) => state.mobile.value);
    const [processing, setProcessing] = useState(false);
    const [complete, setComplete] = useState(false);
    const getAccount = async () => signer.getAddress();
    const [displayCardPack, setDisplayCardPack] = useState(false);
    const [error, setError] = useState('');

    const buyCardPack = async () => {
        setProcessing(true);

        const account = await getAccount();
        dispatch(setCardDetail({}));

        ContractWithSigner.purchaseCardPack({from: account, value: ethers.utils.parseEther("0.005")})
            .then(() => {
                setDisplayCardPack(false);
                Contract.once(Contract.filters.CardPackPurchased(account), () => {
                    setProcessing(false);
                    setDisplayCardPack(true);
                })
            })
            .catch(err => {
                console.log(err);
                setProcessing(false);
                setComplete(true);
                setError('Error! Please try again.');
                if(err.error) setError(err.error.message);
            });
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
                    <Button disabled={processing} sx={{fontSize: '30px', fontFamily: "Work Sans, sans-serif", height: '65px', width: '50%', marginTop: '30px'}} onClick={buyCardPack} size='large' variant='contained' color='primary'>{processing ? <CircularProgress color='secondary' /> : 'Buy'}</Button>
                    {processing ? <Card sx={{marginTop: '2vw', backgroundColor: '#d8572a', fontSize: isMobile ? '4vw' : '2vw', color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>Retrieving Your Cards From the Blockchain Now! This May Take Up to a Couple Minutes.</Card> : null}
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
            {complete && displayCardPack ? <CardPack/> : null}
        </div>
    )
}

export default Purchase;