import { ethers } from "ethers";
import CardAuction from './abi/abi.json';

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const contractAddress = '0x1983334f7d7F2bceB0090f50960B1B19C5d34548';

export const signer = provider.getSigner();

export const Contract = new ethers.Contract(contractAddress, CardAuction.abi, provider);
export const ContractWithSigner = Contract.connect(signer);