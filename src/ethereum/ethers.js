import { ethers } from "ethers";
import CardAuction from './abi/abi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const contractAddress = '0x89cbB8bdE4BBF17082f8400725FEEf5AAf0Bc983';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(contractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);