'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ESCROW_ADDRESS, ESCROW_ABI } from '../lib/escrow'
import { parseEther } from 'viem'
import { toast } from 'react-hot-toast'

export default function MilestoneForm() {
  const [milestoneId, setMilestoneId] = useState('')
  const [amountEth, setAmountEth] = useState('')

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleTx = async (fn, args = [], value = '0') => {
    try {
      writeContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: fn,
        args,
        value: parseEther(value),
      })
      toast.loading('Transaction pending...')
    } catch (err) {
      console.error(err)
      toast.error('Transaction failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">Milestone Actions</h2>

      <div className="space-y-2">
        <label className="block text-sm">Expected amount (ETH)</label>
        <input
          type="text"
          value={amountEth}
          onChange={(e) => setAmountEth(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => handleTx('createMilestone', [], amountEth)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Milestone
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Milestone ID</label>
        <input
          type="text"
          value={milestoneId}
          onChange={(e) => setMilestoneId(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleTx('fundMilestone', [milestoneId], amountEth)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fund
          </button>
          <button
            onClick={() => handleTx('approveMilestone', [milestoneId])}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleTx('releaseMilestone', [milestoneId])}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Release
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Waiting for tx…</p>}
      {isSuccess && <p className="text-sm text-green-600">Transaction confirmed ✅</p>}
    </div>
  )
}
