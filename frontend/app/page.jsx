'use client';

import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { ESCROW_ADDRESS, ESCROW_ABI } from '../lib/escrow';

// ---------- styles (inline, no Tailwind) ----------
const colors = {
  bg: '#0b0c0f',
  card: '#111319',
  border: '#1e2230',
  text: '#e6e9ef',
  muted: '#9aa4b2',
  inputBg: '#0a0b10',
  primary: '#7c3aed', // purple
  primaryDark: '#6d28d9',
  success: '#22c55e',
  danger: '#ef4444',
};

const container = { maxWidth: 980, margin: '0 auto', padding: 24 };
const h1 = { fontSize: 44, fontWeight: 900, margin: '18px 0 24px 0' };
const card = {
  background: colors.card,
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 18,
  boxShadow: '0 10px 24px rgba(0,0,0,.25)',
};
const sectionTitle = { margin: '0 0 12px 0', fontSize: 20, fontWeight: 700 };
const row = { display: 'flex', gap: 10, alignItems: 'center' };
const input = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: `1px solid ${colors.border}`,
  background: colors.inputBg,
  color: colors.text,
  outline: 'none',
};
const label = { display: 'block', fontSize: 13, color: colors.muted, marginBottom: 6 };
const btn = (variant = 'primary') => {
  const base = {
    padding: '9px 14px',
    borderRadius: 10,
    border: '1px solid transparent',
    cursor: 'pointer',
    fontWeight: 600,
  };
  if (variant === 'primary')
    return { ...base, background: colors.primary, borderColor: colors.primary, color: '#fff' };
  if (variant === 'outline')
    return { ...base, background: 'transparent', borderColor: colors.border, color: colors.text };
  if (variant === 'success')
    return { ...base, background: colors.success, borderColor: colors.success, color: '#06120a' };
  if (variant === 'danger')
    return { ...base, background: colors.danger, borderColor: colors.danger, color: '#fff' };
  return base;
};
// ---------------------------------------------------

function WalletBar() {
  const { isConnected, address } = useAccount();
  const { connect, isPending } = useConnect({
    connector: injected({ target: 'metaMask', shimDisconnect: true }),
  });
  const { disconnect } = useDisconnect();

  // avoid SSR/CSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const pickMetaMask = () => {
    if (typeof window === 'undefined') return undefined;
    const eth = window.ethereum;
    if (!eth) return undefined;
    if (eth.providers?.length) return eth.providers.find((p) => p.isMetaMask) ?? eth;
    return eth;
  };

  const onConnect = async () => {
    const mm = pickMetaMask();
    if (!mm || !mm.isMetaMask) {
      alert('No MetaMask detected. Enable/install it and reload.');
      return;
    }
    await mm.request({ method: 'eth_requestAccounts' });
    connect();
  };

  return (
    <div style={{ ...card, marginBottom: 16 }}>
      {!isConnected ? (
        <div style={row}>
          <button style={btn('primary')} onClick={onConnect} disabled={isPending}>
            {isPending ? 'Connecting…' : 'Connect Wallet'}
          </button>
          <span style={{ color: colors.muted, fontSize: 13 }}>MetaMask only for this prototype.</span>
        </div>
      ) : (
        <div style={{ ...row, justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: colors.muted, marginRight: 8 }}>Connected:</span>
            <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          </div>
          <button style={btn('outline')} onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  // shared state
  const [expectedEth, setExpectedEth] = useState('0.10');
  const [milestoneId, setMilestoneId] = useState('0');
  const [fundEth, setFundEth] = useState('0.10');

  // wagmi
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: mining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const tx = (fn, args = [], valueEth = '0') =>
    writeContract({
      address: ESCROW_ADDRESS,
      abi: ESCROW_ABI,
      functionName: fn,
      args,
      value: parseEther(String(valueEth)),
    });

  const pending = isPending || mining;

  return (
    <main style={{ minHeight: '100vh', background: colors.bg, color: colors.text }}>
      <div style={container}>
        <h1 style={h1}>Milestone Escrow (localhost)</h1>

        <WalletBar />

        {/* CLIENT SECTION */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h2 style={sectionTitle}>Client</h2>

          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <div style={label}>Create milestone — expected amount (ETH)</div>
              <div style={row}>
                <input
                  style={{ ...input, flex: 1 }}
                  value={expectedEth}
                  onChange={(e) => setExpectedEth(e.target.value)}
                  inputMode="decimal"
                  placeholder="0.1"
                />
                <button
                  style={btn('primary')}
                  onClick={() => tx('createMilestone', [], expectedEth)}
                  disabled={pending}
                >
                  Create
                </button>
              </div>
            </div>

            <div>
              <div style={label}>Fund existing milestone</div>
              <div style={{ ...row, flexWrap: 'wrap' }}>
                <input
                  style={{ ...input, maxWidth: 160 }}
                  value={milestoneId}
                  onChange={(e) => setMilestoneId(e.target.value)}
                  inputMode="numeric"
                  placeholder="ID"
                />
                <input
                  style={{ ...input, maxWidth: 180 }}
                  value={fundEth}
                  onChange={(e) => setFundEth(e.target.value)}
                  inputMode="decimal"
                  placeholder="ETH"
                />
                <button
                  style={btn('primary')}
                  onClick={() => tx('fundMilestone', [BigInt(milestoneId || '0')], fundEth)}
                  disabled={pending}
                >
                  Fund
                </button>
                <button
                  style={btn('outline')}
                  onClick={() => tx('approveMilestone', [BigInt(milestoneId || '0')])}
                  disabled={pending}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 13 }}>
            {pending && <span style={{ color: colors.muted }}>Transaction pending…</span>}
            {isSuccess && <span style={{ color: colors.success, marginLeft: 8 }}>Confirmed</span>}
            {error && (
              <span style={{ color: colors.danger, marginLeft: 8 }}>
                {error.shortMessage || error.message}
              </span>
            )}
          </div>
        </section>

        {/* FREELANCER SECTION */}
        <section style={{ ...card }}>
          <h2 style={sectionTitle}>Freelancer</h2>
          <div style={label}>Release funds for approved milestone</div>
          <div style={row}>
            <input
              style={{ ...input, maxWidth: 160 }}
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              inputMode="numeric"
              placeholder="ID"
            />
            <button
              style={btn('success')}
              onClick={() => tx('releaseMilestone', [BigInt(milestoneId || '0')])}
              disabled={pending}
            >
              Release
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: colors.muted }}>
            Tip: use different MetaMask accounts to simulate roles.
          </div>
        </section>
      </div>
    </main>
  );
}
