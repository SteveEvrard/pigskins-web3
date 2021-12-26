import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameContract, GameContractWithSigner, signer } from '../ethereum/ethers';
import { Divider, List, ListItem, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PersonIcon from '@mui/icons-material/Person';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

const LeaderBoard = ( props ) => {

    const [loading, setLoading] = useState(false);
    const [winners, setWinners] = useState([]);
    const [account, setAccount] = useState('');
    const getAccount = async () => signer.getAddress();
    const isMobile = useSelector((state) => state.mobile.value);

    useEffect(() => {
        getWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getWinners = async () => {
        setLoading(true);
        const user = await getAccount();
        setAccount(user);
        const allGamesEnded = await getAllGamesEnded();
        const winningPlayers = filterForWinningPlayers(allGamesEnded);
        const uniqueWinners = getUniqueWinners(winningPlayers);
        const winnersWithStats = getWinnerStats(uniqueWinners, allGamesEnded);
        setWinners(winnersWithStats);
        setLoading(false);
    }

    const getAllGamesEnded = async () => {
        return GameContractWithSigner.queryFilter(GameContract.filters.GameEnded());
    }

    const filterForWinningPlayers = (games) => {
        const winners = [];
        games.forEach(game => {
            winners.push(game.args.winner);
        });
        return winners;
    }

    const getUniqueWinners = (winners) => {
        const uniqueWinners = [];

        for(let i = 0; i < winners.length; i++) {
            if(!uniqueWinners.includes(winners[i])) {
                uniqueWinners.push(winners[i]);
            }
        }

        return uniqueWinners;
    }

    const getWinnerStats = (winners, games) => {
        const winnerStats = [];

        for(let i = 0; i < winners.length; i++) {
            const winner = winners[i];
            let winCount = 0;
            let totalEthWon = 0;
            for(let j = 0; j < games.length; j++) {
                if(games[j].args.winner === winner) {
                    winCount++;
                    const prize = BigNumber.from(games[j].args.prize).toString()
                    const eth = ethers.utils.formatUnits(prize);
                    totalEthWon += Number(eth);
                }
            }

            winnerStats.push({winner: winner, winCount: winCount, ethWon: Math.round(totalEthWon * 100000) / 100000});
        }

        return winnerStats;
    }

    const shortenAddress = (address) => {
        return address.substring(0, 8);
    }

    const WinnerTile = ( {details, place} ) => {

        return (
            <ListItem sx={{display: 'flex'}}>
                <div style={isMobile ? {} : {display: 'flex', justifyContent: 'center', width: '100vw'}}>
                    <div style={{width: '90vw', display: 'flex', justifyContent: 'space-between'}}>
                        <Typography sx={{color: 'black', marginTop: isMobile ? '1vw' : '', fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>
                            {place.toString()+ '. ' + shortenAddress(details.winner)}
                            {place === 1 ? <LooksOneIcon sx={{color: 'gold', marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '1vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                            {place === 2 ? <LooksTwoIcon sx={{color: '#9a9a9a', marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '1vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                            {place === 3 ? <Looks3Icon sx={{color: '#CD7F32', marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '1vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                            {details.winner === account ? <PersonIcon sx={{marginBottom: isMobile ? '-1vw' : '-.5vw', marginLeft: '1vw'}} fontSize={isMobile ? 'medium' : 'larger'}/> : null}
                        </Typography>
                        <div style={{display: 'flex', justifyContent: 'space-between', width: '25vw'}}>
                            <Typography sx={{color: 'black', textAlign: 'right', marginTop: isMobile ? '1vw' : '', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>{details.winCount}</Typography>
                            <Typography sx={{color: 'black', textAlign: 'right', marginTop: isMobile ? '1vw' : '', fontFamily: "Work Sans, sans-serif", fontWeight: 600, fontSize: isMobile ? '5vw' : '3vw'}}>{details.ethWon}</Typography>
                        </div>
                    </div>
                </div>
            </ListItem>
        )
    }

    const WinnerList = () => {

        console.log(winners);
        winners.sort((a, b) => {
            if(b.winCount === a.winCount){
                return b.ethWon - a.ethWon;
            }
            return b.winCount - a.winCount;
        })

        return (
            <List>
                <div style={{display: 'flex', justifyContent: 'right', width: '100vw'}}>
                    <Typography sx={{position: isMobile ? 'absolute' : '', top: isMobile ? '-6vw' : '', right: isMobile ? '17vw' : '', width: '10vw', marginRight: isMobile ? '8vw' : '11vw', marginBottom: isMobile ? '3vw' : '', fontWeight: 800, fontSize: isMobile ? '5vw' : '5vw', color: 'black'}}>
                        Wins
                    </Typography>
                    <Typography sx={{position: isMobile ? 'absolute' : '', top: isMobile ? '-6vw' : '', right: isMobile ? '0vw' : '', width: '10vw', marginRight: isMobile ? '7vw' : '4vw', marginBottom: isMobile ? '3vw' : '', fontWeight: 800, fontSize: isMobile ? '5vw' : '5vw', color: 'black'}}>
                        ETH
                    </Typography>
                </div>
                {
                    winners.map((details, i) => {
                        return (
                            <div key={i}>
                                <Divider />
                                <WinnerTile place={i + 1} details={details} />
                            </div>
                        )
                    })
                }
                <Divider />
            </List>
        )
    }

    return (
        <div>
            <div style={{padding: '2vw 0'}}>
                <Typography sx={{width: '100vw', marginBottom: isMobile ? '3vw' : '', fontSize: isMobile ? '8vw' : '5vw', color: 'black'}}>
                    LEADERBOARD
                </Typography>
            </div>
            {loading ? <CircularProgress style={{marginTop: isMobile ? '35vw' : '20vw'}} color='darkGreen' size={200} /> : <WinnerList />}
        </div>
    )
}

export default LeaderBoard;