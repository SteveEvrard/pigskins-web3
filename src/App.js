import './App.css';
import React, { useEffect } from 'react';
import Header from './components/Header';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Purchase from './components/Purchase';
import Auction from './components/Auction';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserCards from './components/UserCards';
import { useDispatch } from 'react-redux';
import { setAccount } from './store/account/accountSlice';
import { useMediaQuery } from 'react-responsive';
import { setMobile } from './store/device/deviceSlice';
import { signer, provider, contractAddress } from './ethereum/ethers';
import { BigNumber, ethers } from "ethers";
import Claim from './components/Claim';
import Info from './components/Info';
import Games from './components/Games';
import Admin from './components/Admin';
import JoinGame from './components/JoinGame';
import MyGames from './components/MyGames';
import GameDetails from './components/GameDetails';
import NotificationHelper from './utils/NotificationUtil';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#d8572a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff'
    },
    selected: {
      main: '#252422'
    },
    third: {
      main: '#7ebc89'
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    }
  }
});

const App = () => {

  const isMobile = useMediaQuery({
    query: '(max-width: 428px)'
  });
  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(setMobile(isMobile));
    provider.getBalance(contractAddress).then(data => console.log('balance', ethers.utils.formatEther(BigNumber.from(data).toString()).toString()));

    getAccount();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getAccount = async () => {
    await signer.getAddress().then(acct => dispatch(setAccount(acct)));
  }

  return (
    <div className="App">
        <ThemeProvider theme={theme}>

          <Header/>
          <NotificationHelper/>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/purchase' component={Purchase} />
            <Route path='/games' exact={true} component={Games} />
            <Route path='/games/:id' component={JoinGame} />
            <Route path='/my-games' exact={true} component={MyGames} />
            <Route path='/my-games/:id' component={GameDetails} />
            <Route path='/cards' component={UserCards} />
            <Route path='/auction' component={Auction} />
            <Route path='/claim' component={Claim} />
            <Route path='/info' component={Info} />
            <Route path='/admin' component={Admin} />
          </Switch>
        </ThemeProvider>
    </div>
  );
}

export default App;
