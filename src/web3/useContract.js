import { ethers } from "ethers";
import { getCachedAbi } from "./abiStorage";
import { BigNumber } from "bignumber.js";

export const smartContractAddress = "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804";

export async function getBalance(provider, tokenAddress) {
	try {
		const abi = await getCachedAbi(tokenAddress);	
		const tokenContract = new ethers.Contract(tokenAddress, abi, provider.getSigner());
		const userAddress = await provider.getSigner().getAddress();
		const tokenBalance = await tokenContract.balanceOf(userAddress);
		const decimals = await tokenContract.decimals();
		console.log(`tokenBalance = ${tokenBalance}, decimals = ${decimals}`);

		const x = new BigNumber(tokenBalance);
		const result = x.dividedBy(new BigNumber((10 ** decimals).toString()));
		console.log(`result = ${result}`)		
		return result;

		// return tokenBalance.div(BigNumber.from((10 ** decimals).toString()));
	}
	catch(err) {
		console.error(err)
		return 0
	}
}

export async function getDetailFromTokenAddress(provider, tokenAddress) {
	const abi = await getCachedAbi(smartContractAddress);	
	const mainContract = new ethers.Contract(smartContractAddress, abi, provider.getSigner());

	const numVaults = await mainContract.numVaults(tokenAddress);
	if (numVaults < 1) 
		return {}
	
	const vaultAddress = await mainContract.vaults(tokenAddress, numVaults - 1);
	const vaultInfo = await getVaultInfo(provider, vaultAddress);
	return { vault: vaultInfo, token: vaultInfo.token};
}

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
			vaultContract: vaultContract,
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
			vaultContract: null,
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



