'use client';

function pickMetaMask() {
  if (typeof window === 'undefined') return undefined;
  const eth = window.ethereum;
  if (!eth) return undefined;
  // If multiple providers, pick the one that is MetaMask
  if (eth.providers?.length) {
    return eth.providers.find((p) => p.isMetaMask) ?? eth;
  }
  return eth;
}

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ESCROW_ADDRESS, ESCROW_ABI } from '../lib/escrow';

const onConnect = () => {
  const mm = pickMetaMask();
  if (!mm || !mm.isMetaMask) {
    alert('No MetaMask detected. Please install/enable MetaMask and reload.');
    return;
  }
  connect(); // your existing wagmi connect
};

function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({ connector: injected({ target: 'metaMask', shimDisconnect: true }) });
  const { disconnect } = useDisconnect();

  // pick MetaMask (guards against multiple injected providers)
  const pickMetaMask = () => {
    if (typeof window === 'undefined') return undefined;
    const eth = window.ethereum;
    if (!eth) return undefined;
    if (eth.providers?.length) return eth.providers.find((p) => p.isMetaMask) ?? eth;
    return eth;
  };

  const onConnect = () => {
    const mm = pickMetaMask();
    if (!mm || !mm.isMetaMask) {
      alert('No MetaMask detected. Install/enable MetaMask and reload.');
      return;
    }
    connect(); // now in scope
  };

  if (!isConnected) return <button onClick={onConnect}>Connect Wallet (MetaMask)</button>;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>Connected: {address.slice(0, 6)}…{address.slice(-4)}</span>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}

export default function Home() {
  const [milestoneId, setMilestoneId] = useState(0);
  const [amountEth, setAmountEth] = useState('0.1');
  const [creatingAmt, setCreatingAmt] = useState('0.1');

  const { data: count } = useReadContract({
    address: ESCROW_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'milestoneCount'
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const create = async () => {
    // amount in wei
    const amtWei = BigInt(Math.floor(Number(creatingAmt) * 1e18).toString());
    writeContract({ address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName: 'createMilestone', args: [amtWei] });
  };

  const fund = async () => {
    const valueWei = BigInt(Math.floor(Number(amountEth) * 1e18).toString());
    writeContract({
      address: ESCROW_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'fundMilestone',
      args: [BigInt(milestoneId)],
      value: valueWei
    });
  };

  const approve = async () => {
    writeContract({ address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName: 'approveMilestone', args: [BigInt(milestoneId)] });
  };

  const release = async () => {
    writeContract({ address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName: 'releaseMilestone', args: [BigInt(milestoneId)] });
  };

  return (
    <main style={{ maxWidth: 720, margin: '32px auto', padding: 16, display: 'grid', gap: 16 }}>
      <h1>Milestone Escrow (localhost)</h1>
      <ConnectButton />

      <section style={{ padding: 12, border: '1px solid #eee', borderRadius: 12 }}>
        <h3>Create Milestone</h3>
        <label>
          Expected amount (ETH):{' '}
          <input value={creatingAmt} onChange={(e) => setCreatingAmt(e.target.value)} />
        </label>
        <div>
          <button onClick={create} disabled={isMining}>Create</button>
        </div>
      </section>

      <section style={{ padding: 12, border: '1px solid #eee', borderRadius: 12 }}>
        <h3>Fund / Approve / Release</h3>
        <label>
          Milestone ID:{' '}
          <input value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)} />
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
          <label>
            Fund amount (ETH):{' '}
            <input value={amountEth} onChange={(e) => setAmountEth(e.target.value)} />
          </label>
          <button onClick={fund} disabled={isMining}>Fund</button>
          <button onClick={approve} disabled={isMining}>Approve</button>
          <button onClick={release} disabled={isMining}>Release</button>
        </div>
      </section>

      <p>Milestones on chain: {String(count || 0)}</p>
      {isMining && <p>⏳ Waiting for transaction…</p>}
      {isSuccess && <p>✅ Tx confirmed: {hash}</p>}
    </main>
  );
}
