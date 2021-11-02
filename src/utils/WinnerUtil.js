import { ContractWithSigner, GameContract, GameContractWithSigner } from "../ethereum/ethers"
import { BigNumber } from "ethers";
import { calculatePoints } from './PlayerStatUtil';
import { getPlayerApiIdById } from './PlayerUtil';
import { getItems } from '../components/ViewCard';

export const endActiveGamesByWeek = async (week) => {
    const openedGames = await getOpenedGames();
    const gamesWithDetails = await getGameDetails(openedGames);
    const filteredForActiveGames = filterForActiveGames(gamesWithDetails, week);
    const gamesWithPlayers = await getPlayersByGame(filteredForActiveGames);
    const gamesWithActivePlayers = getAllCardsByPlayers(gamesWithPlayers);
    const gamesWithActivePlayersAndCardIds = await getGameDetailsWithPlayerCards(gamesWithActivePlayers);
    const allData = await getPlayerCardDetails(gamesWithActivePlayersAndCardIds);
    const gamesWithScores = await getScoresByPlayer(allData);
    const gamesWithWinners = getGameWinners(gamesWithScores);
    console.log(gamesWithWinners);
    await endGames(gamesWithWinners);
}

const endGames = async (games) => {
    const gameIds = [];
    const winners = [];

    for(let i = 0; i < games.length; i++) {
        gameIds.push(games[i].gameId);
        winners.push(games[i].winner)
    }

    console.log('games', gameIds);
    console.log('winners', winners);
    GameContractWithSigner.endGames(gameIds, winners);
}

const getOpenedGames = async () => {
    return GameContract.queryFilter(GameContract.filters.GameCreated());
}

const getGameDetails = async (games) => {
    const promises = [];

    for(let i = 0; i < games.length; i++) {
        const gameId = BigNumber.from(games[i].args.gameId).toNumber();
        promises.push(
            GameContract.gameIdToGame(gameId)
        )
    }

    return Promise.all(promises);
}

const filterForActiveGames = (games, week) => {
    return games.filter(game => {
        const gameWeek = BigNumber.from(game.week).toString();
        return game.active && gameWeek === week;
    })
}

const getPlayersByGame = async (games) => {
    const promises = [];

    for(let i = 0; i < games.length; i++) {
        const gameId = BigNumber.from(games[i].gameId).toNumber();
        const week = BigNumber.from(games[i].week).toNumber();
        promises.push(
            {gameId: games[i].gameId, week: week, players: await GameContract.getPlayersByGameId(gameId)}
        )
    }

    return Promise.all(promises)
}

const mapPlayersToCards = (game) => {
    const gameId = BigNumber.from(game.gameId).toNumber()
    const addresses = game.players.filter(player => {return player !== '0x0000000000000000000000000000000000000000'})

    return {gameId: gameId, week: game.week, players: addresses};
}

const getAllCardsByPlayers = (games) => {
    const filteredGames = [];

    for(let i = 0; i < games.length; i++) {
        filteredGames.push(mapPlayersToCards(games[i]))
    }

    return filteredGames;
}

const getGameDetailsWithPlayerCards = async (games) => {
    const promises = [];

    for(let i = 0; i < games.length; i++) {
        promises.push(
            {gameId: games[i].gameId, week: games[i].week, players: await getPlayerCards(games[i].gameId, games[i].players)}
        )
    }

    return Promise.all(promises);
}

const getPlayerCards = async (gameId, players) => {
    const promises = [];

    for(let i = 0; i < players.length; i++) {
        promises.push(
            {player: players[i], playerCardIds: await GameContract.getCardEntriesByPlayer(gameId, players[i])}
        )
    }

    return Promise.all(promises);
}

const getCardDetails = async (game) => {
    const promises = [];

    for(let i = 0; i < game.players.length; i++) {
        promises.push(
            {player: game.players[i].player, cards: await getCardInfo(game.players[i].playerCardIds)}
        )
    }

    return Promise.all(promises);
}

const getCardInfo = async (cardIds) => {
    const promises = [];

    for(let i = 0; i < cardIds.length; i++) {
        const cardId = BigNumber.from(cardIds[i]).toNumber();
        promises.push(
            ContractWithSigner.cardIdToCard(cardId)
        )
    }

    return Promise.all(promises)
}

const getPlayerCardDetails = async (games) => {
    const promises = [];

    for(let i = 0; i < games.length; i++) {
        promises.push(
            {gameId: games[i].gameId, week: games[i].week, players: await getCardDetails(games[i])}
        )
    }

    return Promise.all(promises)
}

const getScoresByPlayer = async (games) => {
    const promises = [];

    for(let i = 0; i < games.length; i++) {
        promises.push(
            {gameId: games[i].gameId, players: await getAllPlayerScores(games[i].players, games[i].week)}
        )
    }

    return Promise.all(promises)
}

const getAllPlayerScores = async (players, week) => {
    const promises = [];

    for(let i = 0; i < players.length; i++) {
        promises.push(
            {player: players[i].player, points: await getTeamScore(players[i].cards, week)}
        )
    }

    return Promise.all(promises);
}

const getTeamScore = async (cards, week) => {
    let points = 0;

    for(let i = 0; i < cards.length; i++) {
        const playerPoints = await getSinglePlayerScore(cards[i], week);
        points = points + playerPoints;
    }

    points = Math.round(points * 100) / 100
    console.log('points', points)

    return points;
}

const getSinglePlayerScore = async (card, week) => {
    const playerId = BigNumber.from(card.playerId).toString();
    const apiId = getPlayerApiIdById(playerId);
    const items = getItems(BigNumber.from(card.attributeHash).toString());
    const cardType = BigNumber.from(card.cardType).toString();

    return await calculatePoints(items, cardType, week, apiId);
}

const getGameWinners = (games) => {
    const gamesWithWinners = [];

    for(let i = 0; i < games.length; i++) {
        gamesWithWinners.push(
            {gameId: games[i].gameId, winner: getWinner(games[i].players)}
        )
    }

    return gamesWithWinners;
}

const getWinner = (players) => {
    let winner = '0x0000000000000000000000000000000000000000';
    let highestScore = 0;

    for(let i = 0; i < players.length; i++) {
        if(players[i].points > highestScore) {
            winner = players[i].player;
            highestScore = players[i].points;
        }
    }
    
    return winner;
}