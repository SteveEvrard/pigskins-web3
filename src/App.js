import './App.css';
import React, { useEffect } from 'react';
import { useWeb3 } from '@openzeppelin/network/react';
import Header from './components/Header';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Purchase from './components/Purchase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserCards from './components/UserCards';
import { useDispatch } from 'react-redux';
import { setAccount } from './store/account/accountSlice';
import { useMediaQuery } from 'react-responsive';
import ViewCard from './components/ViewCard';
import { setMobile } from './store/device/deviceSlice';

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
  const web3Context = useWeb3('wss://mainnet.infura.io/ws/v3/b83130d2e86b4a1e814500707cc18dc1');
  const { accounts } = web3Context;

  useEffect(() => {

    if(!window.ethereum.selectedAddress) window.ethereum.enable()
    
    dispatch(setMobile(isMobile));
    dispatch(setAccount(accounts[0]));

  })

  return (
    <div className="App">
        <ThemeProvider theme={theme}>

          <Header/>

          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/purchase' component={Purchase} />
            <Route path='/cards' exact={true} component={UserCards} />
            <Route path='/cards/:id' component={ViewCard} />
          </Switch>
        </ThemeProvider>
    </div>
  );
}

export default App;
