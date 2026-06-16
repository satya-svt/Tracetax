import { ethers } from "ethers"; // Fixes 'Module hardhat has no member ethers'
import TraceTax from "../TraceTax.json"; // Path based on your image

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getTraceTaxContract = async () => {
    if (!window.ethereum) throw new Error("Please install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // This is the user (Politician/Admin)

    return new ethers.Contract(CONTRACT_ADDRESS, TraceTax.abi, signer);
};