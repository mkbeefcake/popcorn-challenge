import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContractContext } from '../../web3/ContractProvider';
import { getBalance, getReadablePrice } from '../../web3/useContract';
import './Modal.css';

const WithdrawalModal = ({ isShowing, hide, value }) => {
  const [,ethersProvider] = useContractContext();
  const [userBalance, setUserBalance] = useState(0.0);
  const [withdrawBalance, setWithdrawBalance] = useState(0.0);
  const [estimatedBalance, setEstimatedBalance] = useState(0.0);

  useEffect(() => {

    const fetchData = async() => {

      if (ethersProvider) {    
        const vaultAddress = value.address ? value.address : (value.vault && value.vault.address ? value.vault.address: 0 );
        const balance= await getBalance(ethersProvider, vaultAddress);
        console.log(`Token = ${vaultAddress} balance = ${balance}`);
        setUserBalance(balance);
      }  
    }

    if (isShowing)
      fetchData().catch(console.error);

  }, [isShowing])

  function onChangeWithdrawBalance(e) {
    if (e.target.value > userBalance)
      e.target.value = userBalance;
      
    const pricePerShare = value.pricePerShare ? value.pricePerShare : (value.vault && value.vault.pricePerShare ? value.vault.pricePerShare: 0 );
    const decimals = value.decimals ? value.decimals : (value.vault && value.vault.decimals? value.vault.decimals : 0);

    if (pricePerShare == 0)
      setEstimatedBalance(e.target.value);
    else {
      const readablePricePerShare = getReadablePrice(pricePerShare, decimals);    
      setEstimatedBalance(e.target.value * readablePricePerShare);
    }

    setWithdrawBalance(e.target.value);
  }

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
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for={`user-balance`}>
                    Current User's {value.symbol}
                  </label>
                  <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                      id={`user-balance`} type="number" disabled value={userBalance}></input>
                </div>
                <label class="block text-gray-700 text-sm font-bold mb-2" for={`token-symbol-${value.symbol}`}>
                  From {value.symbol}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-${value.symbol}`} type="number" value={withdrawBalance} min="0.0" step="0.1" max={userBalance} onChange={onChangeWithdrawBalance}></input>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for={`token-symbol-${value.token.symbol}`}>
                  To {value.token.symbol}
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-${value.token.symbol}`} disabled value={estimatedBalance} type="number"></input>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>, document.body
    ) : null
  )
}

export default WithdrawalModal;