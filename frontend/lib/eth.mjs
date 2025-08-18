'use client';

import { parseEther, formatEther } from 'viem';

export function toWei(str) {
  const n = String(str || '').trim();
  if (!n) throw new Error('Amount required');
  return parseEther(n);
}

export function fromWei(bi) {
  try { return Number(formatEther(bi)).toString(); }
  catch { return '0'; }
}
