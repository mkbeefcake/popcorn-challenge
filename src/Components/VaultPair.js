import { useState } from "react"
import DepositeModal from "./Modal/DepositeModal";
import useDepositeModal from "./Modal/useDepositeModal";
import useWithdrawalModal from "./Modal/useWithdrawalModal";
import WithdrawalModal from "./Modal/WithdrawalModal";
import './VaultPair.css';

function VaultPair({value, index}) {
	const [isActive, setIsActive] = useState(false);
  const {isDepositeShowing, toggleDeposite} = useDepositeModal();
  const {isWithdrawShowing, toggleWithdraw} = useWithdrawalModal();

	console.log({value, index});

  async function deposit() {
    toggleDeposite();
  }

  async function withdrawal() {
    toggleWithdraw();
  }

	return (
    <div className="accordion-item border-t-0 border-l-0 border-r-0 rounded-none bg-white border border-gray-200">
      <div className="accordion-title mb-0" onClick={() => setIsActive(!isActive)}>
        <div>
          <b>Name: </b>
          <i>
            {value.name ? value.name : "Error happened"}
          </i>
        </div>
        <div>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && 
      <div className="accordion-content">
        <div><i>
          <p>Symbol : {value.symbol}</p>
          <p>Vault Contract Address : {value.address}</p>
          <p>Decimals : {value.decimals.toString()}</p>
          <p>totalAssets : {value.totalAssets.toString()}</p>
          <p>totalSupply : {value.totalSupply.toString()}</p>
          <p>PricePerShare : {value.pricePerShare.toString()}</p>        
          <p>TokenAddress : {value.token.tokenAddress.toString()}</p>        
          <p>Token Name : {value.token.name.toString()}</p>        
          <p>Token Symbol : {value.token.symbol.toString()}</p>        
          </i>
          <div className="justify-center flex space-x-2 mt-4">
            <button 
              onClick={deposit}
              type="button" 
              className="px-6 flex-intial w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                Deposite
            </button>
            <button 
              onClick={withdrawal}
              type="button" 
              className="px-6 flex-intial w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                Withdrawal
            </button>
          </div>
        </div>
      </div>}
      <DepositeModal isShowing={isDepositeShowing} hide={toggleDeposite} value={value} ></DepositeModal>
      <WithdrawalModal isShowing={isWithdrawShowing} hide={toggleWithdraw} value={value}></WithdrawalModal>
    </div>
	)
}

export default VaultPair