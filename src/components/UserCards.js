import React, { useEffect, useState } from 'react';
import NFTContract from '../ethereum/NFTContract';
import PlayerCard from './PlayerCard';
import CircularProgress from '@mui/material/CircularProgress';
import { getPlayerTeamById } from '../utils/PlayerUtil';

let cards = [];

const UserCards = ( props ) => {

    const account = props.account;
    const [cardsLoaded, setCardsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNFTs();

        return () => {
            cards = []
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getNFTs = async () => {

        setLoading(true);

        try {
            const nftCount = await NFTContract.methods.balanceOf(account).call();
            let count = 0;
            // await NFTContract.events.CardCreated({filter: {owner: account}}).call().then(data => console.log(data));

            for(let i = 0; i < nftCount; i++){
                const owner = await NFTContract.methods.ownerOf(i).call();
                if(owner === account){
                    const card = await NFTContract.methods.cards(i).call();
                    cards.push(card); 
                    // eslint-disable-next-line no-unused-vars
                    count++;
                }
            }

            setCardsLoaded(true);
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
            const team = getPlayerTeamById(card.playerId);
            return (
                <PlayerCard key={i} flippable={false} width='250px' team={team} attributeHash={card.attributeHash} cardType={card.cardType} />
            )
        });
    }

    return (
        <div>
            {loading ? <CircularProgress style={{marginTop: '10%'}} color='secondary' size={200} /> : null}
            {cardsLoaded ? displayCards(cards) : null}
        </div>
    )

}

export default UserCards;