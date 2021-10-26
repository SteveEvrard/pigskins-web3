import { ethers } from "ethers";
import CardAuction from './abi/abi.json';
import CardGame from './abi/CardGameAbi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const cardAuctionContractAddress = '0x4Ba2bE79cDaEA1ed2b863a8185110304477D92c7';
export const cardGameContractAddress = '0x9Ef6f8Ed3e357a5D29A34043CF3e5A742Bc70221';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(cardAuctionContractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);

export const GameContract = new ethers.Contract(cardGameContractAddress, CardGame.abi, provider);
export const GameContractWithSigner = GameContract.connect(signer);