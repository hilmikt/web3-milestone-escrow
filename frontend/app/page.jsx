'use client'

import { Toaster } from 'react-hot-toast';


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
      <Toaster
        position="bottom-right"
        toastOptions={{
        style: { background: '#0a0b10', color: '#e6e9ef', border: '1px solid #1e2230' }
        }} />
    </main>
  )
}