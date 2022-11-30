import { FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useContractContext } from '../web3/ContractProvider';
import { fetchTokens, smartContractAddress } from '../web3/useContract';
import VaultPair from './VaultPair';

import './Body.css';
import { fetchToken_v2 } from '../web3/etherscanTransactions';

function Body() {
  const [vaultPairs, setVaultPairs] = useState([]);
  const [, ethersProvider] = useContractContext();
  const [loading, setLoading] = useState(false);

	useEffect(() => {

    const fetchData = async() => {

      if (ethersProvider) {
        setLoading(true);
        const _pairs = await fetchTokens(ethersProvider);        
        setVaultPairs(_pairs);
        setLoading(false);
      }  
    }

    fetchData().catch(console.error);
    		
	}, [ethersProvider])

  return (
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
      <p className="text-2xl text-gray-600 mb-5">
        <strong>Smart Contract Address (MainNet) :</strong> <i>{smartContractAddress}</i>
      </p>
      <p className="text-2xl text-gray-600 mb-5">
        <i>Vault Templates</i>
      </p>
      { 
        loading ? (
          <div className='loader-container'>
            <div className='spinner'></div>
          </div>
        ) : (
          <div className="accordion accordion-flush">
          {vaultPairs.map((vault, index)=> (
            <VaultPair value={vault} index={index}></VaultPair>
          ))}
        </div>
        )       
      }
    </div>
  )
}

export default Body