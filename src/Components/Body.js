import React, { useEffect } from 'react'
import { fetchTokens, smartContractAddress } from '../web3/useContract';

function Body() {

	useEffect(() => {

    // fetchTokens();
    		
	}, [])

  return (
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
        <p className="text-2xl text-gray-600 mb-5">
            Smart Contract Address : {smartContractAddress}
        </p>
    </div>
  )
}

export default Body