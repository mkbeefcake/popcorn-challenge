import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useContractContext } from '../../web3/ContractProvider';
import { getAllowance, getBalance, getReadablePrice, getVaultShareRatio, setAllowance, setDeposit } from '../../web3/useContract';
import './Modal.css';

const DepositeModal = ({ isShowing, hide, value }) => {

  const [,ethersProvider] = useContractContext();
  const [userBalance, setUserBalance] = useState(0.0);
  const [depositeBalance, setDepositeBalance] = useState(0.0);
  const [estimatedTokenBalance, setEstimatedTokenBalance] = useState(0.0);

  const [isApproved, setIsApproved] = useState(false);
  const [allowDeposite, setAllowDeposite] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {

    const fetchData = async() => {

      if (ethersProvider) {    

        // get user's balance
        const balance= await getBalance(ethersProvider, value.token.tokenAddress);
        console.log(`Token = ${value.token.tokenAddress} balance = ${balance}`);
        setUserBalance(balance);

        // get user's approval status
        const allowance = await getAllowance(ethersProvider, value.token.tokenAddress, value.vault.address);
        if (allowance > 0) {
          setIsApproved(true);
          setAllowDeposite(true);
        }
        else {
          setIsApproved(false);
          setAllowDeposite(false);
        }
      }  
    }

    if (isShowing) {
      fetchData().catch(console.error);      
    }

  }, [isShowing, refreshCount])

  async function onChangeDepositBalance(e) {
    const newBalance = (e.target.value > userBalance) ? userBalance : e.target.value;
    
    const shareRatio = await getVaultShareRatio(ethersProvider, value.vault.address);
    setEstimatedTokenBalance(newBalance * shareRatio);
    setDepositeBalance(newBalance);
  };

  async function onSetAllowance() {
    const allowed = await setAllowance(ethersProvider, value.token.tokenAddress, value.vault.address);
    if (allowed == true) {
      setIsApproved(true);
      setAllowDeposite(true);
    }
    else {
      setIsApproved(false);
      setAllowDeposite(false);
    }
    setRefreshCount(refreshCount+1);
  }

  async function onSetDeposit() {
    if (depositeBalance <= 0 ) {
      alert('please input deposite balance bigger than ZERO');
      return;
    }

    const decimals = value.decimals ? value.decimals : (value.vault && value.vault.decimals ? value.vault.decimals : 0);
    if (decimals <= 0) {
      alert('ERROR: Decimal is ZERO');
      return;
    }
    const result = await setDeposit(ethersProvider, value.vault.address, depositeBalance, decimals);
    if (result == true) {
      setDepositeBalance(0);
    }
    else {
      alert('ERROR: Failed to deposit');
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`user-balance`}>
                  Current User's {value.token.symbol}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`user-balance`} type="number" disabled value={userBalance}></input>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`token-symbol`}>
                  From {value.token.symbol}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol`} type="number" min={0} step="0.1" max={userBalance} onChange={onChangeDepositBalance}></input>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`token-symbol-target`}>
                  Estimated {value.symbol}
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id={`token-symbol-target`} disabled value={estimatedTokenBalance} type="number"></input>
              </div>
            </form>
            <div className="justify-center flex space-x-2 mt-4">
              <button 
                onClick={onSetAllowance}
                disabled={isApproved}
                type="button" 
                className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                  Approval
              </button>
              <button 
                onClick={onSetDeposit}
                disabled={!(isApproved && allowDeposite)}
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