import { useState } from "react"
import './VaultPair.css';

function VaultPair({value, index}) {
	const [isActive, setIsActive] = useState(false);

	console.log({value, index});

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
          <p>TokenAddress : {value.tokenAddress.toString()}</p>        
          </i>
        </div>
      </div>}
    </div>
	)
}

export default VaultPair