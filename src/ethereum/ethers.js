import { ethers } from "ethers";
import CardAuction from './abi/abi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const contractAddress = '0xF8ac1622e0f5214e700261FBb043186FF4d41942';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(contractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);