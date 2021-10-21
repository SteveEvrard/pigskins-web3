import React, { useEffect } from 'react';
import { BigNumber } from "ethers";
import { useDispatch } from "react-redux";
import { signer, Contract, ContractWithSigner } from '../ethereum/ethers';
import { setNotification } from '../store/notification/notificationSlice';


const NotificationHelper = () => {
    
    const dispatch = useDispatch();
    const getAccount = async () => signer.getAddress();

    useEffect(() => {
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
        if(mappedCards.length !== 0) dispatch(setNotification(true));
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
                ContractWithSigner.cardIdToCard(BigNumber.from(auctions[i].cardId)),
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

    return (<div></div>)
}

export default NotificationHelper;
