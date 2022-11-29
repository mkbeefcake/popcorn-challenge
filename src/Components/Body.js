import React, { useEffect } from 'react'
import { useContractContext } from '../web3/ContractProvider';
import { fetchTokens, smartContractAddress } from '../web3/useContract';

function Body() {

  const [, ethersProvider] = useContractContext();

	useEffect(() => {

    if (ethersProvider)
      fetchTokens(ethersProvider);
    		
	}, [ethersProvider])

  return (
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
        <p className="text-2xl text-gray-600 mb-5">
            Smart Contract Address : {smartContractAddress}
        </p>
    </div>
  )
}

export default Body