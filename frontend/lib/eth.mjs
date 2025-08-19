import { parseEther, formatEther } from 'viem'

export function toWei(str) {
  return parseEther(String(str || '0').trim())
}

export function fromWei(bn) {
  return formatEther(bn)
}
