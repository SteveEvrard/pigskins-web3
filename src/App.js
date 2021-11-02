import './App.css';
import React, { useEffect } from 'react';
import Header from './components/Header';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Purchase from './components/Purchase';
import Auction from './components/Auction';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserCards from './components/UserCards';
import { useDispatch, useSelector } from 'react-redux';
import { setAccount } from './store/account/accountSlice';
import { useMediaQuery } from 'react-responsive';
import { setMobile } from './store/device/deviceSlice';
import { signer } from './ethereum/ethers';
import Claim from './components/Claim';
import Info from './components/Info';
import Games from './components/Games';
import Admin from './components/Admin';
import JoinGame from './components/JoinGame';
import MyGames from './components/MyGames';
import GameDetails from './components/GameDetails';
import NotificationHelper from './utils/NotificationUtil';
import MyAuction from './components/MyAuctions';
import AlertMessage from './utils/EventListenerUtil';

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
  const account = useSelector((state) => state.account.value);


  useEffect(() => {

    dispatch(setMobile(isMobile));

    getAccount();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getAccount = async () => {
    if(signer) {
      await signer.getAddress().then(acct => dispatch(setAccount(acct)));
    }
  }

  return (
    <div className="App">
        <ThemeProvider theme={theme}>

          <Header/>
          <NotificationHelper/>
          <AlertMessage/>
          
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/purchase' component={Purchase} />
            <Route path='/games' exact={true} component={Games} />
            <Route path='/games/:id' component={JoinGame} />
            <Route path='/my-games' exact={true} component={MyGames} />
            <Route path='/my-games/:id' component={GameDetails} />
            <Route path='/my-auction' component={MyAuction} />
            <Route path='/cards' component={UserCards} />
            <Route path='/auction' component={Auction} />
            <Route path='/claim' component={Claim} />
            <Route path='/info' component={Info} />
            {account === process.env.REACT_APP_ACCOUNT_OWNER ? <Route path='/admin' component={Admin} /> : null}
          </Switch>
        </ThemeProvider>
    </div>
  );
}

export default App;
