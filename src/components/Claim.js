import React, { useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setCardDetail, setDisplayCard } from '../store/card-detail/cardDetailSlice';
import { getPlayerNumberById, getPlayerTeamById, getPlayerTypeById } from '../utils/PlayerUtil';
import ViewCard from './ViewCard';
import { BigNumber, ethers } from "ethers";
import { signer, Contract, ContractWithSigner } from '../ethereum/ethers';
import { setNotification } from '../store/notification/notificationSlice';
import PageContext from './PageContext';

const Claim = ( props ) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(false);
    const [cards, setCards] = useState([]);
    const isMobile = useSelector((state) => state.mobile.value);
    const selectedCard = useSelector((state) => state.cardDetail.value.card);
    const displayCard = useSelector((state) => state.cardDetail.value.displayCard);
    const headerMessage = 'No Completed Auctions';
    const message = 'Check back once any auctions you posted have expired'
    const getAccount = async () => signer.getAddress();

    useEffect(() => {
        setLoading(true);
        setCardDetail({});
        getCompletedAuctions();
        dispatch(setNotification(false));
        setCards([]);
        return () => {
            setCards([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCard]);

    useEffect(() => {
        setCards([]);
        getCompletedAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCompletedAuctions = async () => {
        const account = await getAccount(); 
        const openedAuctions = await getOpenedAuctionsByAccount(account);
        const expiredAuctions = filterExpiredAuctions(openedAuctions);
        const expiredAuctionIds = mapExpiredAuctionIds(expiredAuctions);
        const closedAuctions = await filterClosedAuctions(expiredAuctions);
        const closedAuctionIds = mapClosedAuctionIds(closedAuctions);
        const unclosedAuctionIds = findUnclosedAuctions(expiredAuctionIds, closedAuctionIds);
        const auctionDetails = await getUnclosedAuctionDetails(unclosedAuctionIds);
        const cardsWithProps = await getCardDetailsByAuctionId(auctionDetails);
        const mappedCards = mapAllCardAuctionInfo(auctionDetails, cardsWithProps);
        const cardsMappedToString = mappedCards.map(card => {
            return mapBigNumberToData(card);
        });
        setCards(cardsMappedToString);
        setLoading(false);
        if(mappedCards.length === 0) setDisplayMessage(true);
    }

    const getOpenedAuctionsByAccount = async (acct) => {
        return await ContractWithSigner.queryFilter(Contract.filters.AuctionOpened(null, null, null, null, acct));
    }

    const filterExpiredAuctions = (auctions) => {
        return auctions.filter(auction => {
            return Date.now() > Number(BigNumber.from(auction.args.expireDate).toString() + '000')
        });
    }

    const filterClosedAuctions = async (auctions) => {
        let promises = [];

        for(let i = 0; i < auctions.length; i++) {
            promises.push(
                ContractWithSigner.queryFilter(Contract.filters.AuctionClosed(BigNumber.from(auctions[i].args.auctionId).toNumber(), null, null, null, null))
            );
        }

        return Promise.all(promises);
    }

    const mapExpiredAuctionIds = (auctions) => {
        return auctions.map(auction => {
            return BigNumber.from(auction.args.auctionId).toString();
        })
    }

    const mapClosedAuctionIds = (auctions) => {
        return auctions.map(auction => {
            return auction.length > 0 ? BigNumber.from(auction[0].args.auctionId).toString() : '';
        })
    }

    const findUnclosedAuctions = (expiredAuctions, closedAuctions) => {
        return expiredAuctions.filter(id => !closedAuctions.includes(id));
    }

    const getCardDetailsByAuctionId = async (auctions) => {
        let promises = [];

        for(let i = 0; i < auctions.length; i++) {
            promises.push(
                ContractWithSigner.cards(BigNumber.from(auctions[i].cardId)),
            )
        }

        return Promise.all(promises);
    }

    const getUnclosedAuctionDetails = async (auctionIds) => {
        let promises = []

        for(let i = 0; i < auctionIds.length; i++) {
            promises.push(
                ContractWithSigner.auctionIdToAuction(BigNumber.from(auctionIds[i]))
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
                    <PlayerCard key={i} attributes={attributeHash} flippable={false} width={isMobile ? '50vw' : '250px'} number={Number(number)} team={team} playerType={playerType} cardType={card.cardType} />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Card sx={{width: isMobile ? '30vw' : '15vw'}}>
                            <div>{bidCount > 0 ? <div><div>SOLD</div><div>{`${ethers.utils.formatEther(`${currentBid}`, 'ether')} ETH`}</div></div> : 'UNSOLD'}</div>
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
            {displayMessage ? <PageContext header={headerMessage} body={message} /> : null}
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : displayCards(cards)}
            {displayCard ? <ViewCard view={'claim'}/> : null}
        </div>
    )
}

export default Claim;