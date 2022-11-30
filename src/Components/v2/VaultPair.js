import { useState } from "react"
import { getDetailFromTokenAddress, getReadablePrice } from "../../web3/useContract";
import DepositeModal from "../Modal/DepositeModal";
import useDepositeModal from "../Modal/useDepositeModal";
import useWithdrawalModal from "../Modal/useWithdrawalModal";
import WithdrawalModal from "../Modal/WithdrawalModal";
import './VaultPair.css';
import { useContractContext } from '../../web3/ContractProvider';

function VaultPair_v2({value, index}) {
	const [isActive, setIsActive] = useState(false);
  const [vaultPair, setVaultPair] = useState(value);
  const [isMore, setIsMore] = useState(false);
  const {isDepositeShowing, toggleDeposite} = useDepositeModal();
  const {isWithdrawShowing, toggleWithdraw} = useWithdrawalModal();
  const [, ethersProvider] = useContractContext();

  async function deposit() {
    toggleDeposite();
  }

  async function withdrawal() {
    toggleWithdraw();
  }

  async function analyze() {
    if (vaultPair.token && vaultPair.token.tokenAddress) {
      const info = await getDetailFromTokenAddress(ethersProvider, vaultPair.token.tokenAddress);
      const newVaultPair = {...vaultPair, vault : info.vault, token: info.token};
      newVaultPair.name = newVaultPair.vault.name;
      newVaultPair.symbol = newVaultPair.vault.symbol;
      setVaultPair(newVaultPair);
      setIsMore(true);
    }
  }

	return (
    <div className="accordion-item border-t-0 border-l-0 border-r-0 rounded-none bg-white border border-gray-200" key={`accordion-${index}`}>
      <div className="accordion-title mb-0" onClick={() => setIsActive(!isActive)}>
        <div>
          <b>Name: </b>
          <i>
            {vaultPair.name ? vaultPair.name.toString() : (vaultPair.vault && vaultPair.vault.name) }
          </i>
        </div>
        <div>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && 
      <div className="accordion-content">
        <div><i>
          <p>Symbol : {vaultPair.symbol ? vaultPair.symbol.toString() : (vaultPair.vault && vaultPair.vault.symbol)}</p>
          <p>TxHash : {vaultPair.hash && vaultPair.hash.toString()}</p>
          <p>TokenAddress : {vaultPair.token && vaultPair.token.tokenAddress && vaultPair.token.tokenAddress.toString()}</p>
          <p>Governance : {vaultPair.governance && vaultPair.governance.toString()}</p>
          <p>Guardian : {vaultPair.guardian && vaultPair.guardian.toString()}</p>
          <p>Rewards : {vaultPair.rewards && vaultPair.rewards.toString()}</p>
          <p>=================</p>
          <p>Api Version : {vaultPair.vault && vaultPair.vault.apiVersion && vaultPair.vault.apiVersion.toString()}</p>
          <p>Vault Address : {vaultPair.vault && vaultPair.vault.address && vaultPair.vault.address.toString()}</p>
          <p>Decimals : {vaultPair.vault && vaultPair.vault.decimals && vaultPair.vault.decimals.toString()}</p>
          <p>totalAssets : {vaultPair.vault && vaultPair.vault.totalAssets && getReadablePrice(vaultPair.vault.totalAssets.toString(), vaultPair.vault.decimals.toString())}</p>
          <p>totalSupply : {vaultPair.vault && vaultPair.vault.totalSupply && getReadablePrice(vaultPair.vault.totalSupply.toString(), vaultPair.vault.decimals.toString())}</p>
          <p>pricePerShare : {vaultPair.vault && vaultPair.vault.pricePerShare && getReadablePrice(vaultPair.vault.pricePerShare.toString(), vaultPair.vault.decimals.toString())}</p>
          <p>=================</p>
          <p>Token name : {vaultPair.token && vaultPair.token.name && vaultPair.token.name.toString()}</p>
          <p>Token symbol : {vaultPair.token && vaultPair.token.symbol && vaultPair.token.symbol.toString()}</p>
          </i>
          <div className="justify-center flex space-x-2 mt-4">
            <button 
              onClick={analyze}
              type="button" 
              disabled={isMore}
              className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                More
            </button>
            <button 
              onClick={deposit}
              type="button" 
              disabled={!isMore}
              className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                Deposite
            </button>
            <button 
              onClick={withdrawal}
              type="button" 
              disabled={!isMore}
              className="disabled:opacity-25 px-6 flex-inital w-40 py-2.5 bg-blue-600 text-white font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">					
                Withdrawal
            </button>
          </div>
        </div>
      </div>}
      <DepositeModal isShowing={isDepositeShowing} hide={toggleDeposite} value={vaultPair} ></DepositeModal>
      <WithdrawalModal isShowing={isWithdrawShowing} hide={toggleWithdraw} value={vaultPair}></WithdrawalModal>
    </div>
	)
}

export default VaultPair_v2