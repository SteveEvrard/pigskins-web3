import web3 from './web3';
import CardOwnership from './abi/CardOwnership.json';

const instance = new web3.eth.Contract(
    CardOwnership.abi,
    '0xB393Dd61d192d031dE16F6622E070a12A9D9Fd9F'
);

export default instance;