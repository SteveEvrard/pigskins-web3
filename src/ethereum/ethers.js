import { ethers } from "ethers";
import CardAuction from './abi/abi.json';
import CardGame from './abi/CardGameAbi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const cardAuctionContractAddress = '0x0E46A3144d0299F6502A259bE3f161E1B32D3385';
export const cardGameContractAddress = '0x398E39318B0fF3FF97a0482cB80D72201Fe0DF6d';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(cardAuctionContractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);

export const GameContract = new ethers.Contract(cardGameContractAddress, CardGame.abi, provider);
export const GameContractWithSigner = GameContract.connect(signer);