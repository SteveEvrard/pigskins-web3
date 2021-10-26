import { GameContract } from "../ethereum/ethers"
import { BigNumber } from "ethers";

export const endActiveGames = async () => {
    const openedGames = await getOpenedGames();
    const gamesWithDetails = await getGameDetails(openedGames);
    const filteredForActiveGames = filterForActiveGames(gamesWithDetails);
    const gamesWithPlayers = await getPlayersByGame(filteredForActiveGames);
    const allData = await getAllCardsByPlayers(gamesWithPlayers);
    console.log(allData);
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

const filterForActiveGames = (games) => {
    return games.filter(game => {
        return game.active
    })
}

const getPlayersByGame = async (games) => {
    const promises = [];

    for(let i = 0; i < games.length; i++) {
        const gameId = BigNumber.from(games[i].gameId).toNumber();
        promises.push(
            {...games[i], players: await GameContract.getPlayersByGameId(gameId)}
        )
    }

    return Promise.all(promises)
}

const mapPlayersToCards = async (game) => {
    const gameId = BigNumber.from(game.gameId).toNumber()
    const addresses = game.players.filter(player => {return player !== '0x0000000000000000000000000000000000000000'})
    const mapPlayerToCards = new Map();
    const promises = [];

    for(let i = 0; i < addresses.length; i++) {
        console.log('mapPlayersToCards')
        promises.push(
            mapPlayerToCards.set(addresses[i], await GameContract.getCardEntriesByPlayer(gameId, addresses[i]))
        )
    }

    return Promise.all(promises);
}

const getAllCardsByPlayers = async (games) => {
    const promises = [];
    const mapGameToPlayersAndCards = new Map();

    for(let i = 0; i < games.length; i++) {
        console.log('getAllCardsByPlayers')
        promises.push(
            mapGameToPlayersAndCards.set(BigNumber.from(games[i].gameId).toNumber(), await mapPlayersToCards(games[i]))
        )
    }

    return Promise.all(promises);
}