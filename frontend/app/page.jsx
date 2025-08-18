'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ESCROW_ADDRESS, ESCROW_ABI } from '../lib/escrow';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toWei } from '../lib/eth.mjs';

function WalletBar() {
  const { isConnected, address } = useAccount();
  const { connect, isPending } = useConnect({ connector: injected({ target:'metaMask', shimDisconnect:true }) });
  const { disconnect } = useDisconnect();

  // ⬇️ Prevent SSR/CSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const pickMetaMask = () => {
    if (typeof window === 'undefined') return undefined;
    const eth = window.ethereum;
    if (!eth) return undefined;
    if (eth.providers?.length) return eth.providers.find((p)=>p.isMetaMask) ?? eth;
    return eth;
  };

  const onConnect = async () => {
    const mm = pickMetaMask();
    if (!mm) { alert('No MetaMask found. Install/enable it and reload.'); return; }
    await mm.request({ method:'eth_requestAccounts' });
    connect();
  };

  if (!isConnected) {
    return (
      <div className="status">
        <span className="label">Status:</span>
        <span className="badge">Disconnected</span>
        <button className="btn btn--primary" onClick={onConnect} disabled={isPending}>
          {isPending ? 'Connecting…' : 'Connect MetaMask'}
        </button>
      </div>
    );
  }

  return (
    <div className="status">
      <span className="label">Connected:</span>
      <span className="badge">{address.slice(0,6)}…{address.slice(-4)}</span>
      <button className="btn" onClick={()=>disconnect()}>Disconnect</button>
    </div>
  );
}

export default function Home(){
  // Simulated roles purely for UX; contract already guards with modifiers in your version
  const [role, setRole] = useState('client'); // 'client' | 'freelancer'
  const [createAmt, setCreateAmt] = useState('0.2');
  const [fundAmt, setFundAmt] = useState('0.2');
  const [id, setId] = useState('0');
  const [toast, setToast] = useState(null); // { kind:'success'|'error', msg:string }

  const { data: count, refetch: refetchCount } = useReadContract({
    address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName: 'milestoneCount'
  });

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: mining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withToast = (fn) => async () => {
    try { await fn(); }
    catch (e) { setToast({ kind:'error', msg: e?.shortMessage || e?.message || String(e) }); }
  };

  const onCreate = withToast(async () => {
    const amt = toWei(createAmt);
    writeContract({ address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName:'createMilestone', args:[amt] });
  });

  const onFund = withToast(async () => {
    const value = toWei(fundAmt);
    writeContract({
      address: ESCROW_ADDRESS, abi: ESCROW_ABI,
      functionName:'fundMilestone', args:[BigInt(id)], value
    });
  });

  const onApprove = withToast(async () => {
    writeContract({ address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName:'approveMilestone', args:[BigInt(id)] });
  });

  const onRelease = withToast(async () => {
    writeContract({ address: ESCROW_ADDRESS, abi: ESCROW_ABI, functionName:'releaseMilestone', args:[BigInt(id)] });
  });

  // refresh count on confirmed tx
  if (isSuccess) { refetchCount?.(); setTimeout(()=>setToast({kind:'success', msg:'Transaction confirmed'}), 0); }

  return (
    <div className="container">
      <h1 className="h1">Milestone Escrow (localhost)</h1>

      <WalletBar />

      <div className="row" style={{marginTop:12}}>
        <span className="label">Acting as:</span>
        <Button variant={role==='client'?'primary':undefined} onClick={()=>setRole('client')}>Client</Button>
        <Button variant={role==='freelancer'?'primary':undefined} onClick={()=>setRole('freelancer')}>Freelancer</Button>
        <span className="label">Tip: use different accounts in MetaMask to simulate roles.</span>
      </div>

      <Card title="Create Milestone" right={<span className="label">Expected amount in ETH</span>}>
        <div className="row">
          <Input value={createAmt} onChange={(e)=>setCreateAmt(e.target.value)} inputMode="decimal" />
          <Button variant="primary" onClick={onCreate} disabled={isPending||mining}>Create</Button>
        </div>
      </Card>

      <Card title="Fund / Approve / Release">
        <div className="row">
          <div style={{flex:1}}>
            <div className="label">Milestone ID</div>
            <Input value={id} onChange={(e)=>setId(e.target.value)} />
          </div>
          <div style={{flex:1}}>
            <div className="label">Fund amount (ETH)</div>
            <Input value={fundAmt} onChange={(e)=>setFundAmt(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <div className="row" style={{marginTop:10}}>
          <Button onClick={onFund} disabled={isPending||mining || role!=='client'}>Fund</Button>
          <Button onClick={onApprove} disabled={isPending||mining || role!=='client'}>Approve</Button>
          <Button variant="success" onClick={onRelease} disabled={isPending||mining || role!=='freelancer'}>Release</Button>
        </div>

        <div className="row" style={{marginTop:8}}>
          <span className="label">Milestones on chain:</span>
          <span className="badge">{String(count || 0)}</span>
          {(isPending||mining) && <span className="badge">pending…</span>}
          {writeError && <span className="badge" style={{borderColor:'var(--danger)', color:'#fecaca'}}>
            {writeError.shortMessage || writeError.message}
          </span>}
        </div>
      </Card>

      {toast && (
        <div className={`toast ${toast.kind==='error'?'toast--error':'toast--success'}`}
             onAnimationEnd={()=>setToast(null)}
             role="status">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
