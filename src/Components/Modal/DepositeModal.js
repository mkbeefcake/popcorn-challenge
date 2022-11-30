import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContractContext } from '../../web3/ContractProvider';
import { getBalance, getReadablePrice } from '../../web3/useContract';
import './Modal.css';

const DepositeModal = ({ isShowing, hide, value }) => {

  const [,ethersProvider] = useContractContext();
  const [userBalance, setUserBalance] = useState(0.0);
  const [depositeBalance, setDepositeBalance] = useState(0.0);
  const [estimatedTokenBalance, setEstimatedTokenBalance] = useState(0.0);

  const [isApproval, setIsApproval] = useState(false);
  const [isDeposite, setIsDeposite] = useState(false);

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

  function onChangeDepositBalance(e) {
    if (e.target.value > userBalance)
      e.target.value = userBalance;
      
    const pricePerShare = value.pricePerShare ? value.pricePerShare : (value.vault && value.vault.pricePerShare ? value.vault.pricePerShare: 0 );
    const decimals = value.decimals ? value.decimals : (value.vault && value.vault.decimals? value.vault.decimals : 0);

    if (pricePerShare == 0)
      setEstimatedTokenBalance(e.target.value);
    else {
      const readablePricePerShare = getReadablePrice(pricePerShare, decimals);    
      setEstimatedTokenBalance(e.target.value * readablePricePerShare);
    }

    setDepositeBalance(e.target.value);
  };

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
                    id={`token-symbol-${value.token.symbol}`} type="number" value={depositeBalance} step="0.1" min="0.0" max={userBalance} onChange={onChangeDepositBalance} ></input>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for={`token-symbol-${value.symbol}`}>
                  Estimated {value.symbol} (USDC * PricePerShare)
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-${value.symbol}`} disabled value={estimatedTokenBalance} type="number"></input>
              </div>
            </form>
            <div className="justify-center flex space-x-2 mt-4">
              <button 
                disabled={!isApproval}
                type="button" 
                className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                  Approval
              </button>
              <button 
                disabled={!isDeposite}
                type="button" 
                className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                  Deposite
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>, document.body
    ) : null
  )
}

export default DepositeModal;