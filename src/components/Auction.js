import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail, setDisplayCard } from '../store/card-detail/cardDetailSlice';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import ViewCard from './ViewCard';
import Countdown from 'react-countdown';
import { BigNumber, ethers } from "ethers";
import { Contract, ContractWithSigner } from '../ethereum/ethers';
import PageContext from './PageContext';

const Auction = ( props ) => {

    const dispatch = useDispatch();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const displayCard = useSelector((state) => state.cardDetail.value.displayCard);
    const isMobile = useSelector((state) => state.mobile.value);
    const selectedCard = useSelector((state) => state.cardDetail.value);

    const headerMessage = 'No Cards for Sale';
    const message = 'No cards are open for auction at this time. Please check back later.';

    useEffect(() => {

        setCardDetail({});
        setLoading(true);
        getOpenAuctions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCard]);

    const getOpenAuctions = async () => {
        const allAuctions = await getAllAuctions();
        const openAuctions = filterExpiredAuctions(allAuctions);
        const auctionDetails = await getOpenAuctionDetails(openAuctions);
        const openAuctionDetails = filterOpenAuctions(auctionDetails);
        const cardDetails = await getCardDetailsByAuctionId(openAuctions);
        const mappedCards = mapAllCardAuctionInfo(openAuctionDetails, cardDetails);
        const cardsMappedToString = mappedCards.map(card => {
            return mapBigNumberToData(card);
        });
        setCards(cardsMappedToString);
        setLoading(false);
        if(mappedCards.length === 0) setDisplayMessage(true);
    }

    const getAllAuctions = async () => {
        return ContractWithSigner.queryFilter(Contract.filters.AuctionOpened());
    }

    const filterExpiredAuctions = (auctions) => {
        return auctions.filter(auction => {
            return Date.now() < Number(BigNumber.from(auction.args.expireDate).toString() + '000')
        });
    }

    const getOpenAuctionDetails = async (auctions) => {
        const promises = []

        for(let i = 0; i < auctions.length; i++) {
            promises.push(
                ContractWithSigner.auctionIdToAuction(BigNumber.from(auctions[i].args.auctionId))
            )
        }

        return Promise.all(promises);
    }

    const filterOpenAuctions = (auctions) => {
        return auctions.filter(auction => {
            return auction.open
        });
    }

    const getCardDetailsByAuctionId = async (auctions) => {
        const promises = [];

        for(let i = 0; i < auctions.length; i++) {
            promises.push(
                ContractWithSigner.cardIdToCard(BigNumber.from(auctions[i].args.cardId)),
            )
        }

        return Promise.all(promises);
    }

    const mapAllCardAuctionInfo = (auctionDetails, cardInfo) => {
        const mappedData = auctionDetails.map(auction => {
            const cardDetails = cardInfo.find(card => BigNumber.from(card.cardId).eq(BigNumber.from(auction.cardId)))
            return {...cardDetails, ...auction}
        })

        return mappedData;
    }

    const mapBigNumberToData = (card) => {
        const attributeHash = BigNumber.from(card.attributeHash).toString();
        const auctionId = BigNumber.from(card.auctionId).toString();
        const bidCount = BigNumber.from(card.bidCount).toString();
        const cardId = BigNumber.from(card.cardId).toString();
        const cardType = BigNumber.from(card.cardType).toString();
        const currentBid = BigNumber.from(card.currentBid).toString();
        const expireDate = BigNumber.from(card.expireDate).toString() + '100';
        const playerId = BigNumber.from(card.playerId).toString();

        return {attributeHash, auctionId, bidCount, cardId, cardType, currentBid, expireDate, playerId}
    }

    const handleCardDisplay = (card) => {
        dispatch(setDisplayCard(true));
        dispatch(setCardDetail(card));
    }

    function displayCards(cards) {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>{createCards(cards)}</div>
        )
    }

    function createCards(cards) {
        
        return cards.map((card, i) => {

            const {attributeHash, auctionId, bidCount, cardId, cardType, currentBid, expireDate, playerId} = card;
            const team = getPlayerTeamById(playerId);
            const number = getPlayerNumberById(playerId);
            const playerType = getPlayerTypeById(playerId);
            const cardToView = {attributeHash, auctionId, bidCount, cardId, cardType, currentBid, expireDate, playerId, team, number, playerType};
            
            return (
                <div key={i} style={{marginBottom: '3vw', cursor: 'pointer'}} onClick={() => handleCardDisplay(cardToView)}>
                    <PlayerCard key={i} attributes={attributeHash} flippable={false} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={cardType} />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Card sx={{width: isMobile ? '30vw' : '15vw', fontFamily: 'Roboto Slab, sans-serif', backgroundColor: '#2e8b57', color: '#fff', fontWeight: 600}}>
                            <Countdown zeroPadDays={0} date={Number(expireDate)}></Countdown>
                            <div>{ethers.utils.formatEther(`${currentBid}`, 'ether')} ETH</div>
                            <div>BIDS: {bidCount}</div>
                        </Card>
                    </div>
                </div>
            )
        });
    }

    return (
        <div style={{marginTop: '2vw'}}>
            <Typography sx={{marginBottom: '3vw', fontSize: isMobile ? '8vw' : '6vw'}}>
                Card Auction
            </Typography>
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='darkGreen' size={200} /> : displayCards(cards)}
            {displayCard ? <ViewCard view={'auction'}/> : null}
        </div>
    )
}

export default Auction;