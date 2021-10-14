import { ethers } from "ethers";
import CardAuction from './abi/abi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const contractAddress = '0x17d0bd2EEe6c6fb61cE8c95557c41635c17B9924';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(contractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);