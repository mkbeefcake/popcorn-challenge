import React, { useCallback, useContext, useEffect, useState } from "react";
import Web3Modal from 'web3modal'

const ContractContext = React.createContext();

const useContractContext = () => useContext(ContractContext);

function ContractProvider({children}) {
	const [web3Modal, setWeb3Modal] = useState(null)
	const [ethersProvider, setEthersProvider] = useState(null)

	useEffect(() => {
		const newWeb3Modal = new Web3Modal({
			cacheProvider: true,
			network: "mainnet",
		});
		setWeb3Modal(newWeb3Modal);
	}, [])

	const setProvider = (provider) => {
		setEthersProvider(provider)
	}

	return <ContractContext.Provider value={[web3Modal, ethersProvider, setProvider]} >{children}</ContractContext.Provider>
}

export {ContractProvider, useContractContext}