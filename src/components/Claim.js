import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail } from '../store/card-detail/cardDetailSlice';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import ViewCard from './ViewCard';
import { BigNumber, ethers } from "ethers";
import { signer, Contract, ContractWithSigner } from '../ethereum/ethers';
import { setNotification } from '../store/notification/notificationSlice';
import PageContext from './PageContext';

// let cards = [];

const Claim = ( props ) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const [cards, setCards] = useState([]);
    const isMobile = useSelector((state) => state.mobile.value);
    const selectedCard = useSelector((state) => state.cardDetail.value);
    const headerMessage = 'No Completed Auctions';
    const message = 'Check back once any auctions you posted have expired'

    useEffect(() => {
        setLoading(true);
        setCardDetail({});
        getClaims();
        dispatch(setNotification(false));
        setCards([]);
        return () => {
            setCards([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCard]);

    useEffect(() => {
        setCards([]);
    }, [])

    const getClaims = async () => {
        await signer.getAddress().then(acct => {
            ContractWithSigner.queryFilter(Contract.filters.AuctionOpened(null, null, null, null, acct))
            .then(data => {

                const expiredAuctions = data.filter(auction => {
                    return Date.now() > Number(BigNumber.from(auction.args.expireDate).toString() + '000')
                });

                for(let i = 0; i < expiredAuctions.length; i++) {
                    filterClosedAuctions(expiredAuctions[i]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
        })
    }

    const filterClosedAuctions = async (auct) => {

        await ContractWithSigner.queryFilter(Contract.filters.AuctionClosed(BigNumber.from(auct.args.auctionId).toNumber(), null, null, null, null))
            .then(data => {
                if(data.length === 0) {
                    const {cardId, expireDate} = mapAuctionData(auct);
                    Contract.cards(BigNumber.from(auct.args.cardId)).then(data => {
                        Contract.cardToCurrentBid(BigNumber.from(cardId)).then( bidInfo => {
                            const cardSold = BigNumber.from(bidInfo).gt(BigNumber.from(auct.args.startingBid));
                            getCardDetails(data, expireDate, BigNumber.from(bidInfo).toString(), cardSold);
                        });
                    });
                }
        })
        .catch(err => console.log(err));
    
      }

    function getCardDetails(card, expireDate, startingBid, sold) {
        setCards(cards => [...cards, {...mapCardData(card), time: expireDate, bid: startingBid, sold: sold}]);
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
            const { playerId, cardType, attributeHash, cardId, bid } = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            return (
                <div key={i} style={{marginBottom: '3vw', cursor: 'pointer'}} onClick={() => setCardToView({team, number, playerId, cardType, attributeHash, cardId, bid})}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={false} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={card.cardType} />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Card sx={{width: isMobile ? '30vw' : '15vw'}}>
                            <div>{card.sold ? <div><div>SOLD</div><div>{`${ethers.utils.formatEther(`${bid}`, 'ether')} ETH`}</div></div> : 'UNSOLD'}</div>
                        </Card>
                    </div>
                </div>
            )
        });
    }

    return (
        <div>
            <Typography sx={{marginBottom: '3vw', fontFamily: "Work Sans, sans-serif", fontSize: '8vw', color: '#fff'}}>
                Completed Auctions
            </Typography>
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : displayCards(cards)}
            {selectedCard.playerId ? <ViewCard isClaim={true} isAuction={false}/> : null}
        </div>
    )
}

export default Claim;