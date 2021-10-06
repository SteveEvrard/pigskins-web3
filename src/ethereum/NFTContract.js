import web3 from './web3';
import CardOwnership from './abi/abi.json';

const instance = new web3.eth.Contract(
    CardOwnership.abi,
    '0x9b0AAA1b5fcEDf8D81D9Db20901179dCc6f89C55'
);

export default instance;