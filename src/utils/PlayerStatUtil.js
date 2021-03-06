import axios from 'axios';

export const calculatePoints = async (items, cardType, week, playerId) => {
    const stats = await getPlayerStats(week, playerId);
    if(!stats) return 0;
    const passingPoints = getPassingPoints(stats, items, cardType);
    const rushingPoints = getRushingPoints(stats, items, cardType);
    const receivingPoints = getReceivingPoints(stats, items, cardType);
    const specialTeamsPoints = getSpecialTeamsPoints(stats, items, cardType);
    const turnovers = getTurnovers(stats, items);

    const totalPoints = passingPoints + rushingPoints + receivingPoints + specialTeamsPoints - turnovers;

    return calculateBoost(totalPoints, cardType);
}

const getPlayerStats = async (week, playerId) => {
    return await (await axios.get(`https://api.sportsdata.io/v3/nfl/stats/json/PlayerGameStatsByPlayerID/2021/${week}/${playerId}?key=${process.env.REACT_APP_SD_API_KEY}`)).data;
}

const calculateBoost = (points, cardType) => {
    if(cardType === '1') {
        return Math.round((points * 1.1) * 100) / 100;
    } else if(cardType === '2') {
        return Math.round((points * 1.25) * 100) / 100;
    } else if(cardType === '3') {
        return Math.round((points * 1.4) * 100) / 100;
    } else {
        return Math.round(points * 100) / 100;
    }
}

const getPassingPoints = (data, items, cardType) => {
    const yards = data.PassingYards / 25;
    const scores = data.PassingTouchdowns * 4;

    if(cardType === '4') {
        return yards + (scores * 1.5);
    }

    if(items.includes('Water') && items.includes('Crown')) {
        return (yards * 1.3) + (scores * 2);
    } else if(items.includes('Water')) {
        return (yards * 1.3) + scores;
    } else if(items.includes('Crown')) {
        return yards + (scores * 2);
    } else {
        return yards + scores;
    }
}

const getRushingPoints = (data, items, cardType) => {
    const yards = data.RushingYards / 10;
    const scores = data.RushingTouchdowns * 6;

    if(cardType === '4') {
        return yards + (scores * 1.5);
    }

    if(items.includes('Water') && items.includes('Crown')) {
        return (yards * 1.3) + (scores * 2);
    } else if(items.includes('Water')) {
        return (yards * 1.3) + scores;
    } else if(items.includes('Crown')) {
        return yards + (scores * 2);
    } else {
        return yards + scores;
    }
}

const getReceivingPoints = (data, items, cardType) => {
    const yards = data.ReceivingYards / 10;
    const scores = data.ReceivingTouchdowns * 6;
    const catches = data.Receptions;

    if(cardType === '4') {
        return yards + (scores * 1.5) + catches;
    }

    if(items.includes('Water') && items.includes('Crown')) {
        return (yards * 1.3) + (scores * 2) + catches;
    } else if(items.includes('Water')) {
        return (yards * 1.3) + scores + catches;
    } else if(items.includes('Crown')) {
        return yards + (scores * 2) + catches;
    } else {
        return yards + scores + catches;
    }
}

const getTurnovers = (data, items) => {
    if(items.includes('Football')) {
        return 0;
    }
    const interceptions = data.PassingInterceptions * 2;
    const fumbles = data.FumblesLost * 2;

    return interceptions + fumbles;
}

const getSpecialTeamsPoints = (data, items, cardType) => {

    if(cardType === '4') {
        return data.SpecialTeamsTouchdowns * 6 * 1.5;
    }

    if(items.includes('Crown')) {
        return data.SpecialTeamsTouchdowns * 6 * 2;
    } else {
        return data.SpecialTeamsTouchdowns * 6;
    }
}