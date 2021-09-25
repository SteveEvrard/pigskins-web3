import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  //We are in the browser and metamask is running.
  web3 = new Web3(window.ethereum);
}
else 
{
  const provider = new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/v3/b83130d2e86b4a1e814500707cc18dc1'
  );
  web3 = new Web3(provider);
}

export default web3;