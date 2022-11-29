import React, { useCallback, useContext, useEffect, useState } from "react";
import Web3Modal from 'web3modal'

const ContractContext = React.createContext({
	web3Modal: null,
	mainContract: null,
});

const useContractContext = () => useContext(ContractContext);

function ContractProvider({children}) {
	const [web3Modal, setWeb3Modal] = useState(null)

	useEffect(() => {
		const newWeb3Modal = new Web3Modal({
			cacheProvider: true,
			network: "mainnet",
		});
		setWeb3Modal(newWeb3Modal);
	}, [])

	return <ContractContext.Provider value={[web3Modal]} >{children}</ContractContext.Provider>
}

export {ContractProvider, useContractContext}