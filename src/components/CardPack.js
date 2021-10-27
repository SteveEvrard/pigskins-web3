import React, { useState, useEffect } from 'react';
import { Backdrop, Button, Typography } from '@mui/material';
import PlayerCard from './PlayerCard';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { Contract, ContractWithSigner, signer } from '../ethereum/ethers';
import { BigNumber } from "ethers";
import { setDisplayCards } from '../store/ui/uiSlice';
import CloseIcon from '@mui/icons-material/Close';

const CardPack = ( props ) => {

    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const isMobile = useSelector((state) => state.mobile.value);
    const getAccount = async () => signer.getAddress();

    const handleClose = () => {
        setOpen(false);
        dispatch(setDisplayCards(false));
    };

    useEffect(() => {

        setLoading(true);
        getCardsPurchased();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCardsPurchased = async () => {
        const account = await getAccount();
        const data = await ContractWithSigner.queryFilter(Contract.filters.CardCreated(null, null, null, null, account));

        for(let i = data.length - 1; i >= data.length - 10; i--) {
            setCards(cards => [...cards, mapCardData(data[i])]);
        }
        setLoading(false);
    }

    function mapCardData(card) {
        const cardId = BigNumber.from(card.args.cardId).toString();
        const playerId = BigNumber.from(card.args.playerId).toString();
        const attributeHash = BigNumber.from(card.args.attributeHash).toString();
        const cardType = BigNumber.from(card.args.cardType).toString();
        
        return {cardId, playerId, attributeHash, cardType};
    }

    function mapDataToCards(cards) {
        return cards.map((card, i) => {
            const { cardId, playerId, cardType, attributeHash } = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            return (
                <div key={i}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={true} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={cardType} />
                    <Typography sx={{color: 'white', fontFamily: "Open Sans, sans-serif"}}>Card: {cardId}</Typography>
                </div>
            )
        })
    }

    return (
        <Backdrop style={{display: 'block', overflow: 'scroll', backgroundColor: 'rgba(0, 0, 0, 0.86)'}} open={open} sx={{zIndex: 1}}>
            {isMobile ? <div onClick={handleClose}><CloseIcon sx={{color: 'white', position: 'fixed', top: '15vw', right: '1vw', fontSize: '8vw'}} /></div> : null}
            <div style={{marginTop: isMobile ? '20vw' : '12%'}}>
                {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : <div style={{display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>{mapDataToCards(cards)}</div>}
            </div>
            <div style={{marginTop: '25px', marginBottom: '25px'}}>
                <Button onClick={handleClose} size='large' variant='contained'>Done</Button>
            </div>
        </Backdrop>
    )

}

export default CardPack;