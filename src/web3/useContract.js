import { ethers } from "ethers";
import { getCachedAbi } from "./abiStorage";

export const smartContractAddress = "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804";


export async function fetchTokens(provider) {
	debugger;

	// const abi = '[{"stateMutability":"view","type":"function","name":"releases","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"address"}]}, {"stateMutability":"view","type":"function","name":"numReleases","inputs":[],"outputs":[{"name":"","type":"uint256"}]}]'

	const abi = await getCachedAbi(smartContractAddress);	
	const mainContract = new ethers.Contract(smartContractAddress, abi, provider.getSigner());
	const numRelease = await mainContract.numReleases();
	console.log(`numRelease = ${numRelease}`)

	const release = await mainContract.releases(0)
	console.log(`numRelease = ${release}`)
}

export async function createMainContract() {
}


