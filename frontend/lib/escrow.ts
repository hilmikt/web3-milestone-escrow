// frontend/lib/escrow.ts
export const ESCROW_ADDRESS =
  (process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}` | undefined) ?? '0x0000000000000000000000000000000000000000';

// Next.js supports importing JSON; ensure tsconfig has "resolveJsonModule": true
import ESCROW_ABI from './abi/MilestoneEscrow.json';
export { ESCROW_ABI };