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
import { signer, provider, contractAddress, ContractWithSigner, Contract } from './ethereum/ethers';
import { BigNumber, ethers } from "ethers";
import { setNotification } from './store/notification/notificationSlice';
import Claim from './components/Claim';

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
  let auction = []


  useEffect(() => {

    dispatch(setMobile(isMobile));
    provider.getBalance(contractAddress).then(data => console.log('balance', ethers.utils.formatEther(BigNumber.from(data).toString()).toString()));
    signer.getAddress().then(acct => {

      dispatch(setAccount(acct));

      ContractWithSigner.queryFilter(Contract.filters.AuctionOpened(null, null, null, null, acct))
      .then(data => {
        const final = data.filter(auction => {
          return Date.now() > Number(BigNumber.from(auction.args.expireDate).toString() + '000')
        });
        console.log('expired auct length', final.length)

        for(let i = 0; i < final.length; i++) {
          filterClosedAuctions(final[i]);
        }
      });

    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const filterClosedAuctions = async (auct) => {

    await ContractWithSigner.queryFilter(Contract.filters.AuctionClosed(BigNumber.from(auct.args.auctionId).toNumber(), null, null, null, null))
      .then(data => {
        console.log('closed', data)
        console.log(auct);
        if(data.length === 0) {
          auction.push(auct);
        }
        if(auction.length > 0){
          dispatch(setNotification(true));
        } 
    })

  }

  return (
    <div className="App">
        <ThemeProvider theme={theme}>

          <Header/>

          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/purchase' component={Purchase} />
            <Route path='/cards' component={UserCards} />
            <Route path='/auction' component={Auction} />
            <Route path='/claim' component={Claim} />
          </Switch>
        </ThemeProvider>
    </div>
  );
}

export default App;
