import { FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useContractContext } from '../../web3/ContractProvider';
import { smartContractAddress } from '../../web3/useContract';

import './Body.css';
import { fetchToken_v2 } from '../../web3/etherscanTransactions';
import VaultPair_v2 from './VaultPair';

function Body_v2() {
  const [vaultPairs, setVaultPairs] = useState([]);
  const [, ethersProvider] = useContractContext();
  const [loading, setLoading] = useState(false);

	useEffect(() => {

    const fetchData = async() => {

      if (ethersProvider) {
        setLoading(true);
        const vaultPairs = await fetchToken_v2(ethersProvider);
        setVaultPairs(vaultPairs);
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
      { 
        loading ? (
          <div className='loader-container'>
            <div className='spinner'></div>
          </div>
        ) : (
          <div className="accordion accordion-flush">
          {vaultPairs.map((vault, index)=> (
            <VaultPair_v2 value={vault} index={index}></VaultPair_v2>
          ))}
        </div>
        )       
      }
    </div>
  )
}

export default Body_v2