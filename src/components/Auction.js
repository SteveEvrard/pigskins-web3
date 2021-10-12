import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import ViewCard from './ViewCard';
import Countdown from 'react-countdown';
import { BigNumber, ethers } from "ethers";
import { Contract, ContractWithSigner } from '../ethereum/ethers';

let cards = [];

const Auction = ( props ) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const isMobile = useSelector((state) => state.mobile.value);
    const selectedCard = useSelector((state) => state.cardDetail.value);

    useEffect(() => {

        setCardDetail({});
        setLoading(true);
        getCardsForAuction();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCard]);

    const getCardsForAuction = async () => {
        ContractWithSigner.queryFilter(Contract.filters.AuctionOpened())
        .then(data => {
            cards = [];
            for(let i = 0; i < data.length; i++) {
                const {cardId, expireDate} = mapAuctionData(data[i]);
                if(Date.now() < expireDate){ 
                    Contract.cards(BigNumber.from(data[i].args.cardId)).then(data => {
                        Contract.cardToCurrentBid(BigNumber.from(cardId)).then( bidInfo => {
                            getCardDetails(data, expireDate, BigNumber.from(bidInfo).toString());
                        })
                    });
                }
            }
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    function getCardDetails(card, expireDate, startingBid) {
        setLoading(true);
        cards.push({...mapCardData(card), time: expireDate, bid: startingBid})
        setLoading(false);
    }

    function mapAuctionData(card) {
        const cardId = BigNumber.from(card.args.cardId).toString();
        const expireDate = Number(BigNumber.from(card.args.expireDate).toString() + '000');
        const startingBid = BigNumber.from(card.args.startingBid).toString();
        
        return {cardId, expireDate, startingBid};
    }

    function mapCardData(card) {
        const cardId = BigNumber.from(card.cardId).toString();
        const playerId = BigNumber.from(card.playerId).toString();
        const attributeHash = BigNumber.from(card.attributeHash).toString();
        const cardType = BigNumber.from(card.cardType).toString();
        
        return {cardId, playerId, attributeHash, cardType};
    }

    const setCardToView = (card) => {
        dispatch(setCardDetail(card));
    }

    function displayCards(cards) {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>{createCards(cards)}</div>
        )
    }

    function createCards(cards) {
        return cards.map((card, i) => {
            const { playerId, cardType, attributeHash, time, cardId, bid } = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            return (
                <div key={i} style={{marginBottom: '3vw', cursor: 'pointer'}} onClick={() => setCardToView({team, number, playerId, cardType, attributeHash, cardId, bid})}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={false} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={card.cardType} />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Card sx={{width: isMobile ? '30vw' : '15vw'}}>
                            <Countdown zeroPadDays={0} date={time}></Countdown>
                            <div>{ethers.utils.formatEther(`${bid}`, 'ether')} ETH</div>
                        </Card>
                    </div>
                </div>
            )
        });
    }

    return (
        <div>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: '#fff'}}>
                Card Auction
            </Typography>
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : null}
            {!loading ? displayCards(cards) : null}
            {selectedCard.playerId ? <ViewCard isAuction={true}/> : null}
        </div>
    )
}

export default Auction;