import axios from 'axios';
import { smartContractAddress } from '../web3/useContract';
import { getCachedAbi } from './abiStorage';
import { ethers } from "ethers";

const InputDataDecoder = require('ethereum-input-data-decoder');

async function getTransactionList() {
	const url = `https://api.etherscan.io/api?module=account&action=txlist&address=0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804&startblock=0&endblock=99999999&sort=asc&apikey=2X5NG8QU35PZV13P7PWPH56YDUUEB2GAZZ`;
	const resp = await axios.get(url);
	return resp.data.result; 
}

export async function fetchToken_v2(provider) {
	const abi = await getCachedAbi(smartContractAddress);
	const mainContract = new ethers.Contract(smartContractAddress, abi, provider.getSigner());

	const decoder = new InputDataDecoder(abi);

	const transactions = await getTransactionList();
	const newExperimentTransactions = 
			transactions
				.filter(tr => tr.methodId == "0x5b73aa0d" || tr.methodId == "0x5bd4b0f2")
				.map(tr => {
					const decoded = decoder.decodeData(tr.input)
					// if (decoded.inputs[5] == undefined || decoded.inputs[5] == '')
					// 	return undefined;

					return {
						token : {
							tokenAddress: "0x" + decoded.inputs[0],
						}, 
						governance: "0x" + decoded.inputs[1],
						guardian: "0x" + decoded.inputs[2],
						rewards: "0x" + decoded.inputs[3],
						name: decoded.inputs[4],
						symbol: decoded.inputs[5],
						hash: tr.hash,
					}
				})
				.filter(tr => tr != undefined);
	console.log(`Count of newExperimentTransactions = ${newExperimentTransactions.length}`);
	return newExperimentTransactions;
}