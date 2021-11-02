import { ethers } from "ethers";
import CardAuction from './abi/abi.json';
import CardGame from './abi/CardGameAbi.json';

export const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;

export const cardAuctionContractAddress = '0xc658f7F06264e040C9fA21c0C07F88623fFda2c2';
export const cardGameContractAddress = '0xc6d2d01af86F80A8C81F70f56Ffd9c7c42d1dd01';

export const signer = provider ? provider.getSigner() : null;

export const Contract = new ethers.Contract(cardAuctionContractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);

export const GameContract = new ethers.Contract(cardGameContractAddress, CardGame.abi, provider);
export const GameContractWithSigner = GameContract.connect(signer);