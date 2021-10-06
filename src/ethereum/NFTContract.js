import web3 from './web3';
import CardOwnership from './abi/abi.json';

const instance = new web3.eth.Contract(
    CardOwnership.abi,
    '0x9aBdD48a92FBA3e702902E6B29CB7D4345381205'
);

export default instance;