'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function WalletBar() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({ connector: injected() })
  const { disconnect } = useDisconnect()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
      {isConnected ? (
        <>
          <span className="font-mono text-sm">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={() => connect()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
