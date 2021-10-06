import web3 from './web3';
import CardOwnership from './abi/abi.json';

const instance = new web3.eth.Contract(
    CardOwnership.abi,
    '0x950c9675D953511beA4FCab4CC3bBbC3a3CA2a4B'
);

export default instance;