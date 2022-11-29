import { ethers, providers } from 'ethers'
import React, { useEffect, useState } from "react"
import Web3Modal from 'web3modal'

import { useContractContext } from '../web3/ContractProvider';

function ConnectWallet() {

	const [address, setAddress] = useState("")
	const [network, setNetwork] = useState("")
	const [web3Modal,,setProvider] = useContractContext();

	async function connectWallet() {
		const provider = await web3Modal.connect();

		addListeners(provider);
		
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const userAddress = await ethersProvider.getSigner().getAddress();
		setNetwork(await ethersProvider.getNetwork())
		setAddress(userAddress);
		setProvider(ethersProvider)
	}

	async function disconnectWallet() {
		await web3Modal.clearCachedProvider();
		setAddress("");
		setNetwork("");
		setProvider(null);
	}

	async function addListeners(web3ModalProvider) {
		web3ModalProvider.on("accountsChanged", (account) => {
			window.location.reload();
		})

		web3ModalProvider.on("chainChanged", (chainId) => {
			window.location.reload();
		})
	}

	return(
		<div>
			{
			address == "" ?
				<button 
					onClick={connectWallet}
					type="button" 
					className="px-6 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
						Connect
				</button>
			:
				<button 
					onClick={disconnectWallet}
					type="button" 
					className="px-6 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
						Disconnect
				</button>
			}
			<p className='pt-2'><b>User address :</b> <i>{address}</i></p>
			<p className='pt-2'><b>Network :</b> <i>{JSON.stringify(network)}</i></p>
		</div>
	)

}

export default ConnectWallet