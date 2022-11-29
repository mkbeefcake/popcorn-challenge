import { ethers } from "ethers";
import { getCachedAbi } from "./abiStorage";

export const smartContractAddress = "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804";


export async function fetchTokens(provider) {
	
	const abi = await getCachedAbi(smartContractAddress);	
	const mainContract = new ethers.Contract(smartContractAddress, abi, provider.getSigner());
	const numRelease = await mainContract.numReleases();
	console.log(`numRelease = ${numRelease}`)

	let vaultPairs = []
	
	for ( let i=0; i<numRelease; i++) {
		const vaultAddress = await mainContract.releases(i)
		const vaultInfo = await getVaultInfo(provider, vaultAddress)
		vaultPairs.push(vaultInfo)
	}

	return vaultPairs;
}

async function getTokenInfo(provider, tokenAddress) {
	try {
		const abi = await getCachedAbi(tokenAddress);	
		const vaultContract = new ethers.Contract(tokenAddress, abi, provider.getSigner());
		const name = await vaultContract.name();
		const symbol = await vaultContract.symbol();

		return {
			tokenAddress: tokenAddress,
			name: name,
			symbol: symbol
		}
	}
	catch (err) {
		return {
			tokenAddress: tokenAddress,
			name: "",
			symbol: "",
			err: err
		}
	}
}

async function getVaultInfo(provider, vaultAddress) {

	try {
		const abi = await getCachedAbi(vaultAddress);	
		const vaultContract = new ethers.Contract(vaultAddress, abi, provider.getSigner());
		const name = await vaultContract.name();
		const symbol = await vaultContract.symbol();
		const decimals = await vaultContract.decimals();
		const totalAssets = await vaultContract.totalAssets();
		const totalSupply = await vaultContract.totalSupply();
		const pricePerShare = await vaultContract.pricePerShare();
		const tokenAddress = await vaultContract.token();
		const token = await getTokenInfo(provider, tokenAddress);

		return {
			address: vaultAddress,
			name: name,
			symbol: symbol,
			decimals: decimals,
			totalAssets: totalAssets,
			totalSupply: totalSupply,
			pricePerShare: pricePerShare,
			token: token
		}
	}
	catch(err) {
		return {
			address: vaultAddress,
			err: err,
			name: "",
			symbol: "",
			decimals: "",
			totalAssets: "",
			totalSupply: "",
			pricePerShare: "",
			token: {
				tokenAddress: "",
				name: "",
				symbol: ""
			}
		}
	}
}



