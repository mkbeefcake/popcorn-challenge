import { ethers } from "ethers";
import { getCachedAbi } from "./abiStorage";
import { BigNumber } from "bignumber.js";

export const smartContractAddress = "0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804";

const erc20abi = require('./erc20.abi.json');

export function getReadablePrice(balance, decimals) {
	const a = new BigNumber(balance.toString());
	const b = new BigNumber(10).pow(decimals.toString());
	const result = a.dividedBy(b);
	return result.toString();
}

export async function getBalance(provider, tokenAddress) {
	try {
		const tokenContract = new ethers.Contract(tokenAddress, erc20abi, provider.getSigner());
		const userAddress = await provider.getSigner().getAddress();
		const tokenBalance = await tokenContract.balanceOf(userAddress);
		const decimals = await tokenContract.decimals();
		// console.log(`tokenBalance = ${tokenBalance}, decimals = ${decimals}`)
		return getReadablePrice(tokenBalance, decimals);
	}
	catch(err) {
		console.error(err)
		return 0
	}
}

export async function getAllowance(provider, tokenAddress, vaultAddress) {
	try {
		const tokenContract = new ethers.Contract(tokenAddress, erc20abi, provider.getSigner());
		const userAddress = await provider.getSigner().getAddress();
		const allowance = await tokenContract.allowance(userAddress, vaultAddress);
		return allowance.toString();
	}
	catch(err) {
		return -1;
	}
}

export async function setAllowance(provider, tokenAddress, vaultAddress) {
	try {
		const tokenContract = new ethers.Contract(tokenAddress, erc20abi, provider.getSigner());
		const userAddress = await provider.getSigner().getAddress();
		await tokenContract.approve(vaultAddress, ethers.constants.MaxUint256);
		return true;
	}
	catch(err) {
		return false;
	}
}

export async function setDeposit(provider, vaultAddress, amount, decimals) {
	try {
		const abi = await getCachedAbi(vaultAddress);	
		const userAddress = await provider.getSigner().getAddress();
		const vaultContract = new ethers.Contract(vaultAddress, abi, provider.getSigner());
		const calculatedAmount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals.toString()));		
		console.log(`amount = ${amount}, decimals = ${decimals} calculatedAmount = ${calculatedAmount.toString()}`);
		await vaultContract["deposit(uint256)"](calculatedAmount.toString());
		return true;
	}
	catch (err) {
		console.log(err);
		return false;
	}
}

export async function setWithdraw(provider, vaultAddress, amount, decimals) {
	try {
		const abi = await getCachedAbi(vaultAddress);	
		const userAddress = await provider.getSigner().getAddress();
		const vaultContract = new ethers.Contract(vaultAddress, abi, provider.getSigner());
		const calculatedAmount = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals.toString()));		
		console.log(`amount = ${amount}, decimals = ${decimals} calculatedAmount = ${calculatedAmount.toString()}`);
		await vaultContract["withdraw(uint256)"](calculatedAmount.toString());
		return true;
	}
	catch (err) {
		console.log(err);
		return false;
	}
}

export async function getVaultShareRatio(provider, vaultAddress) {
	try {
		const abi = await getCachedAbi(vaultAddress);	
		const vaultContract = new ethers.Contract(vaultAddress, abi, provider.getSigner());
		const totalAssets = await vaultContract.totalAssets();
		const totalSupply = await vaultContract.totalSupply();
		const lockedProfit = await vaultContract.lockedProfit();
		const lastReport = await vaultContract.lastReport();
		const lockedProfitDegradation = await vaultContract.lockedProfitDegradation();
		const lastBlockNumber = await provider.getBlockNumber();
		const lastBlock = await provider.getBlock(lastBlockNumber);
		const blockTimestamp = lastBlock.timestamp;
		const DEGRADATION_COEFFICIENT = new BigNumber(10).pow(18);

		// console.log(`${totalAssets.toString()} : ${totalSupply.toString()} : ${lockedProfit.toString()} : ${lastReport.toString()} 
		// 	: ${lockedProfitDegradation.toString()} : ${blockTimestamp.toString()} : ${DEGRADATION_COEFFICIENT.toString()}`)

		// Function : _calculateLockedProfit
		const lockedFundsRatio = new BigNumber(blockTimestamp.toString()).minus(lastReport.toString()).multipliedBy(lockedProfitDegradation.toString());

		let _calculateLockedProfit;
		if (lockedFundsRatio.lt(DEGRADATION_COEFFICIENT)) {
			const temp = lockedFundsRatio.multipliedBy(lockedProfit.toString()).dividedBy(DEGRADATION_COEFFICIENT);
			_calculateLockedProfit = new BigNumber(lockedProfit.toString()).minus(temp);
		}
		else {
			_calculateLockedProfit = new BigNumber(0.0);
		}
		// console.log(`${_calculateLockedProfit.toString()}`);
		
		// Function: _freefund
		const _freefund = new BigNumber(totalAssets.toString()).minus(_calculateLockedProfit);
		const shareRatio = new BigNumber(totalSupply.toString()).dividedBy(_freefund);
		// console.log(`${shareRatio.toString()}`);
		
		return shareRatio.toString();
	}
	catch (err) {
		return 0;
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
	if (vaultInfo == undefined)
		return { vault: {}, token: {} }

	return { vault: vaultInfo, token: vaultInfo.token};
}

export async function fetchTokens(provider) {
	
	const abi = await getCachedAbi(smartContractAddress);	
	const mainContract = new ethers.Contract(smartContractAddress, abi, provider.getSigner());
	const numRelease = await mainContract.numReleases();
	// console.log(`numRelease = ${numRelease}`)

	let vaultPairs = []
	
	for ( let i=0; i<numRelease; i++) {
		const vaultAddress = await mainContract.releases(i)
		const vaultInfo = await getVaultInfo(provider, vaultAddress)
		vaultPairs.push(vaultInfo)
	}

	return vaultPairs.filter(valut => valut != undefined);
}

async function getTokenInfo(provider, tokenAddress) {
	try {
		// const abi = await getCachedAbi(tokenAddress);
		const vaultContract = new ethers.Contract(tokenAddress, erc20abi /*abi*/, provider.getSigner());
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
		const apiVersion = await vaultContract.apiVersion();
		const token = await getTokenInfo(provider, tokenAddress);

		return {
			vaultContract: vaultContract,
			apiVersion: apiVersion,
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
		return undefined;
	}
}



