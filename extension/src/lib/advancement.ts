import type { StatKey } from '../types/character'

// XP cost to advance from currentVal to currentVal+1
export function statAdvanceCost(currentVal: number): number {
  if (currentVal <= 1) return 1   // 0→1, 1→2
  if (currentVal <= 3) return 2   // 2→3, 3→4
  return 3                         // 4→5
}

// Whether a particular advance requires a significant story moment to be confirmed first
export function requiresSignificantMoment(stat: StatKey, currentVal: number, optionalZero?: StatKey): boolean {
  if (currentVal === 4) return true                     // 4→5 always gated
  if (currentVal === 0 && optionalZero === stat) return true  // forced-zero first step
  return false
}

// XP cost for the nth advanced power (0-indexed: first unlock = index 0 → 2 XP)
export function powerAdvanceCost(ownedCount: number): number {
  return ownedCount + 2
}
