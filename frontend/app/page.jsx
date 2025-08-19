'use client'

import WalletBar from '../components/WalletBar'
import MilestoneForm from '../components/MilestoneForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Milestone Escrow (localhost)
      </h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <WalletBar />
        <MilestoneForm />
      </div>
    </main>
  )
}