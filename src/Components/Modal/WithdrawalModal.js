import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContractContext } from '../../web3/ContractProvider';
import { getBalance, getReadablePrice, getVaultShareRatio, setWithdraw } from '../../web3/useContract';
import './Modal.css';

const WithdrawalModal = ({ isShowing, hide, value }) => {
  const [,ethersProvider] = useContractContext();
  const [userBalance, setUserBalance] = useState(0.0);
  const [withdrawBalance, setWithdrawBalance] = useState(0.0);
  const [estimatedBalance, setEstimatedBalance] = useState(0.0);
  const [refreshCount, setRefreshCount] = useState(0);

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

  }, [isShowing, refreshCount])

  async function onChangeWithdrawBalance(e) {
    const newBalance = (e.target.value > userBalance) ? userBalance : e.target.value;
    debugger;  
    const shareRatio = await getVaultShareRatio(ethersProvider, value.vault.address);
    setEstimatedBalance(newBalance / shareRatio);
    setWithdrawBalance(newBalance);

    // const pricePerShare = value.pricePerShare ? value.pricePerShare : (value.vault && value.vault.pricePerShare ? value.vault.pricePerShare: 0 );
    // const decimals = value.decimals ? value.decimals : (value.vault && value.vault.decimals? value.vault.decimals : 0);

    // if (pricePerShare == 0)
    //   setEstimatedBalance(e.target.value);
    // else {
    //   const readablePricePerShare = getReadablePrice(pricePerShare, decimals);    
    //   setEstimatedBalance(e.target.value * readablePricePerShare);
    // }

    // setWithdrawBalance(e.target.value);
  }

  async function onSetWithdraw() {
    if (withdrawBalance <= 0) {
      alert('please input withdraw balance bigger than ZERO');
      return;
    }

    const decimals = value.decimals ? value.decimals : (value.vault && value.vault.decimals ? value.vault.decimals : 0);
    if (decimals <= 0) {
      alert('ERROR: Decimal is ZERO');
      return;
    }

    const result = await setWithdraw(ethersProvider, value.vault.address, withdrawBalance, decimals);
    if (result == true) {
      setWithdrawBalance(0);
    }
    else {
      alert('ERROR: Failed to Withdraw');
    }
    setRefreshCount(refreshCount+1);

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
            <form className="bg-white rounded px-4 pt-4 pb-4 mb-4">
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`user-balance`}>
                    Current User's {value.symbol}
                  </label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                      id={`user-balance`} type="number" disabled value={userBalance}></input>
                </div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`token-symbol`}>
                  From {value.symbol}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol`} type="number" value={withdrawBalance} min={0} step="0.1" max={userBalance} onChange={onChangeWithdrawBalance}></input>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`token-symbol-target`}>
                  To {value.token.symbol}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-target`} disabled value={estimatedBalance} type="number"></input>
              </div>
            </form>
            <div className="justify-center flex space-x-2 mt-4">
              <button 
                onClick={onSetWithdraw}
                type="button" 
                className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                  Withdraw
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>, document.body
    ) : null
  )
}

export default WithdrawalModal;