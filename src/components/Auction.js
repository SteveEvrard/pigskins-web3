import React, { useEffect, useState } from 'react';
import NFTContract from '../ethereum/NFTContract';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import ViewCard from './ViewCard';
import Countdown from 'react-countdown';
import web3 from '../ethereum/web3';

let cards = [];
let cardIdsForAuction = [];

const Auction = ( props ) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const isMobile = useSelector((state) => state.mobile.value);
    const account = useSelector((state) => state.account.value);
    const selectedCard = useSelector((state) => state.cardDetail.value);

    useEffect(() => {

        NFTContract.getPastEvents('AuctionOpened', {
            fromBlock: 0,
            toBlock: 'latest'
        }).then(events => {
            cards = [];
            cardIdsForAuction = [];
            for(let i = 0; i < events.length; i++) {
                const { expireDate, cardId, startingBid } = events[i].returnValues;
                if(Date.now() < Number(expireDate.toString() + '000')){ 
                    cardIdsForAuction.push({ expireDate, cardId, startingBid });
                }
            }
            getCardsForAuction();
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setCardToView = (card) => {
        dispatch(setCardDetail(card));
    }

    const getCardsForAuction = async () => {

        setLoading(true);

        try {

            for(let i = 0; i < cardIdsForAuction.length; i++){
                const {cardId, expireDate, startingBid} = cardIdsForAuction[i];
                const time = Number(expireDate.toString() + '000');
                const card = await NFTContract.methods.cards(cardId).call();
                cards.push({...card, time: time, bid: startingBid}); 
            }

            setLoading(false);

        } catch(err) {
            console.log(err);
        }

        setLoading(false);
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
                            <div>{web3.utils.fromWei(`${bid}`, 'ether')} ETH</div>
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