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
import detectEthereumProvider from '@metamask/detect-provider';
import { signer } from './ethereum/ethers';

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

  // const getAccount = async () =>  {
  //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   const account = accounts[0];
  //   dispatch(setAccount(account));
  // }

  useEffect(() => {

    signer.getAddress().then(account => {
      dispatch(setAccount(account));
    })
    dispatch(setMobile(isMobile));
    // dispatch(setAccount(accounts[0]));

  })

  return (
    <div className="App">
        <ThemeProvider theme={theme}>

          <Header/>

          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/purchase' component={Purchase} />
            <Route path='/cards' component={UserCards} />
            <Route path='/auction' component={Auction} />
          </Switch>
        </ThemeProvider>
    </div>
  );
}

export default App;
