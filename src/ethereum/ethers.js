import { ethers } from "ethers";
import CardAuction from './abi/abi.json';
import CardGame from './abi/CardGameAbi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const cardAuctionContractAddress = '0x2066bdB3148F726A1AFF55878C81BBd0990b64E6';
export const cardGameContractAddress = '0x1cC3DEC0baD2929F9381b0a014699226576119F7';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(cardAuctionContractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);

export const GameContract = new ethers.Contract(cardGameContractAddress, CardGame.abi, provider);
export const GameContractWithSigner = GameContract.connect(signer);