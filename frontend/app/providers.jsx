'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Force ONLY MetaMask injected provider (ignores Brave/Coinbase/etc)
const config = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545')
  },
  connectors: [
    injected({
      target: 'metaMask',    // <— key line: prefer ONLY MetaMask
      shimDisconnect: true
    })
  ]
});

export default function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
