import web3 from './web3';
import CardOwnership from './abi/CardOwnership.json';

const instance = new web3.eth.Contract(
    CardOwnership.abi,
    '0x102b69F2Addc04c38193d48f1Ae8091e7977F2A8'
);

export default instance;