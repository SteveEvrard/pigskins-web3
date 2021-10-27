import { Typography, Button, Card } from '@mui/material';
import React, { useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { Contract, ContractWithSigner } from '../ethereum/ethers';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';

const Purchase = ( props ) => {

    const dispatch = useDispatch();
    const isMobile = useSelector((state) => state.mobile.value);
    const [processing, setProcessing] = useState(false);
    const [purchaseMade, setPurchaseMade] = useState(false);

    const buyCardPack = async () => {
        setProcessing(true);

        dispatch(setCardDetail({}));
        const purchasePrice = await Contract.cardPackFee();
        console.log('pack', purchasePrice)
        const gas = await ContractWithSigner.estimateGas.purchaseCardPack({value: purchasePrice});

        ContractWithSigner.purchaseCardPack({value: purchasePrice, gasLimit: gas.mul('4').div('3')})
            .then(() => {
                setProcessing(false);
                setPurchaseMade(true);
            })
            .catch(err => {
                console.log(err);
                setProcessing(false);
            });
    }

    return (
        <div style={{marginTop: '2vw'}}>
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
                    {purchaseMade ? <Card sx={{marginTop: '2vw', backgroundColor: '#d8572a', fontSize: isMobile ? '4vw' : '2vw', color: '#fff', fontFamily: "Work Sans, sans-serif", fontWeight: 600}} variant='h4'>Transaction Processing Now. Look For Popup When Transaction Completes to View Your New Cards.</Card> : null}
                    <Button disabled={processing} sx={{marginBottom: isMobile ? '' : '3vw', fontSize: '30px', fontFamily: "Work Sans, sans-serif", height: '65px', width: '50%', marginTop: '30px'}} onClick={buyCardPack} size='large' variant='contained' color='primary'>{processing ? <CircularProgress color='secondary' /> : 'Buy'}</Button>
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
        </div>
    )
}

export default Purchase;