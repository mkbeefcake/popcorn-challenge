import { ethers } from "ethers";
import { getCachedAbi } from "./abiStorage";

export const smartContractAddress = "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804";

export async function fetchTokens() {
	const abi = await getCachedAbi(smartContractAddress);
	const mainContract = new ethers.Contract(smartContractAddress, abi);
	const numRelease = await mainContract.numReleases();
}

export async function createMainContract() {
}


