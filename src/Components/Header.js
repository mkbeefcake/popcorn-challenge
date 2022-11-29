import React from 'react'
import ConnectWallet from './ConnectWallet'

function Header() {
  return (
    <header>
        <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
            <p className="text-3xl text-gray-700 font-bold mb-5">
                Frontend Dev Assignment Popcor
            </p>
            <ConnectWallet></ConnectWallet>

        </div>
    </header>
  )
}

export default Header