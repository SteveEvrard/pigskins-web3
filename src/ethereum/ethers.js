import { ethers } from "ethers";
import CardAuction from './abi/abi.json';
import CardGame from './abi/CardGameAbi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const cardAuctionContractAddress = '0x19fA2b38Dd28E65d2Df37E5A1dC18103aA2E0dc7';
export const cardGameContractAddress = '0x9F3f47A45818a6AB8baaAc6aA7445Fc57fF3109d';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(cardAuctionContractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);

export const GameContract = new ethers.Contract(cardGameContractAddress, CardGame.abi, provider);
export const GameContractWithSigner = GameContract.connect(signer);