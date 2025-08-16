'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545')
  }
});

export default function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
