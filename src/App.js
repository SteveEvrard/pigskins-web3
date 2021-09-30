import './App.css';
import React from 'react';
import { useWeb3 } from '@openzeppelin/network/react';
import Header from './components/Header';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Purchase from './components/Purchase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserCards from './components/UserCards';
import { useDispatch } from 'react-redux';
import { setAccount } from './store/account/accountSlice';

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
  },
  buyButton: {

  }
});

const App = () => {

  const dispatch = useDispatch();
  const web3Context = useWeb3('wss://mainnet.infura.io/ws/v3/b83130d2e86b4a1e814500707cc18dc1');
  const { accounts } = web3Context;
  dispatch(setAccount(accounts[0]));

  // const createCard = async () => {
  //   try {
  //     await NFTContract.methods.mintCustomCard('0x3bfF843835CABB198912e10629843Fc65E336C84', 0, 0, 12345678963).send({from: account});
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  // const getOwner = async () => {
  //   try {
  //     let id = await NFTContract.methods.cards(2).call();
  //     console.log('OWNER:', id);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  return (
    <div className="App">
        <ThemeProvider theme={theme}>

          <Header/>

          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/purchase' component={Purchase} />
            <Route path='/cards' component={UserCards} />
          </Switch>
        </ThemeProvider>
    </div>
  );
}

export default App;
