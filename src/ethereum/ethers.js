import { ethers } from "ethers";
import CardAuction from './abi/abi.json';
import CardGame from './abi/CardGameAbi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const cardAuctionContractAddress = '0x6Bdd52359e68d0Ca59439253E8F94d233ABcff4b';
export const cardGameContractAddress = '0xc800B634E03BBf4856cef491312FF54d3803B265';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(cardAuctionContractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);

export const GameContract = new ethers.Contract(cardGameContractAddress, CardGame.abi, provider);
export const GameContractWithSigner = GameContract.connect(signer);