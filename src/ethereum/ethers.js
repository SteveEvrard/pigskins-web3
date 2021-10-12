import { ethers } from "ethers";
import CardAuction from './abi/abi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const contractAddress = '0x0E3E252a2f6275B4946a2CA2F2c2a70256b37e75';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(contractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);