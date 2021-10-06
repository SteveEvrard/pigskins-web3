import web3 from './web3';
import CardOwnership from './abi/abi.json';

export const contractAddress = '0x7d1061Af0dC764d8245eDFB62677fda62D91687d';

const instance = new web3.eth.Contract(
    CardOwnership.abi,
    contractAddress
);

export default instance;