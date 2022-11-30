import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContractContext } from '../../web3/ContractProvider';
import { getBalance } from '../../web3/useContract';
import './Modal.css';

const DepositeModal = ({ isShowing, hide, value }) => {

  const [,ethersProvider] = useContractContext();
  const [userBalance, setUserBalance] = useState(0.0);

  useEffect(() => {

    const fetchData = async() => {

      if (ethersProvider) {    
        const balance= await getBalance(ethersProvider, value.token.tokenAddress);
        console.log(`Token = ${value.token.tokenAddress} balance = ${balance}`);
        setUserBalance(balance);
      }  
    }

    if (isShowing)
      fetchData().catch(console.error);

  }, [isShowing])

  return (
    isShowing ? ReactDOM.createPortal(
      <React.Fragment>
        <div className="modal-overlay"/>
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
          <div className="modal">
            <div className="modal-header">
              <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form class="bg-white rounded px-4 pt-4 pb-4 mb-4">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for={`user-balance`}>
                  Current User's {value.token.symbol}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`user-balance`} type="number" disabled value={userBalance}></input>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for={`token-symbol-${value.token.symbol}`}>
                  From {value.token.symbol}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-${value.token.symbol}`} type="number"></input>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for={`token-symbol-${value.symbol}`}>
                  Estimated {value.symbol} (USDC * PricePerShare)
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-${value.symbol}`} type="number"></input>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>, document.body
    ) : null
  )
}

export default DepositeModal;