import type { RollOutcome } from '../types/chat'

export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function rollPool(count: number): number[] {
  const n = Math.max(1, Math.min(12, count))
  return Array.from({ length: n }, rollD6)
}

export function highest(dice: number[]): number {
  return dice.length ? Math.max(...dice) : 0
}

export function secondHighest(dice: number[]): number | undefined {
  if (dice.length < 2) return undefined
  const sorted = [...dice].sort((a, b) => b - a)
  return sorted[1]
}

export function getOutcome(h: number): RollOutcome {
  if (h >= 6) return 'success'
  if (h >= 4) return 'partial'
  return 'miss'
}

export function outcomeLabel(outcome: RollOutcome): string {
  switch (outcome) {
    case 'success': return 'Success'
    case 'partial': return 'Success with cost'
    case 'miss':    return 'Miss — GM moves'
  }
}

export function countSixes(dice: number[]): number {
  return dice.filter(d => d === 6).length
}

export function isResonance(dice: number[]): boolean {
  return countSixes(dice) >= 2
}

// Second die texture: 5-6 good / 3-4 neutral / 1-2 crack
export type CollateralResult = 'good' | 'neutral' | 'bad'
export function collateralResult(second: number): CollateralResult {
  if (second >= 5) return 'good'
  if (second >= 3) return 'neutral'
  return 'bad'
}
export function collateralLabel(r: CollateralResult): string {
  switch (r) {
    case 'good':    return 'Something good alongside'
    case 'neutral': return 'A neutral ripple'
    case 'bad':     return 'An unintended crack'
  }
}

// ── Manual formula rolling ───────────────────────────────────────────────────

export const CHAT_STATS_KEY = 'sl_roll_stats'

export interface ChatStats {
  stats: { form: number; clarity: number; resonance: number; radiance: number; resolve: number }
}

export function resolveStatVars(formula: string, stats: ChatStats | null): string | null {
  let failed = false
  const resolved = formula.replace(/\{([A-Z]+)\}/g, (_match, key: string) => {
    if (!stats) { failed = true; return '' }
    switch (key) {
      case 'FORM':      return String(stats.stats.form)
      case 'CLARITY':   return String(stats.stats.clarity)
      case 'RESONANCE': return String(stats.stats.resonance)
      case 'RADIANCE':  return String(stats.stats.radiance)
      case 'RESOLVE':   return String(stats.stats.resolve)
      default: failed = true; return ''
    }
  })
  return failed ? null : resolved
}

export interface ManualRollResult {
  total: number
  breakdown: string
}

function tokenize(formula: string): Array<{ sign: 1 | -1; expr: string }> {
  const normalized = /^[+\-]/.test(formula) ? formula : '+' + formula
  const parts = normalized.match(/[+\-][^+\-]*/g) ?? []
  return parts.map(part => ({
    sign: (part[0] === '-' ? -1 : 1) as 1 | -1,
    expr: part.slice(1).trim(),
  })).filter(t => t.expr.length > 0)
}

export function parseDiceFormula(formula: string): ManualRollResult | null {
  const clean = formula.trim().replace(/\s+/g, '')
  if (!clean || /\{[A-Z]+\}/i.test(clean)) return null
  const tokens = tokenize(clean)
  if (!tokens.length) return null
  let total = 0
  const parts: string[] = []
  for (const { sign, expr } of tokens) {
    const diceMatch = expr.match(/^(\d*)d(\d+)$/i)
    if (diceMatch) {
      const count = diceMatch[1] ? Math.max(1, Math.min(12, parseInt(diceMatch[1]))) : 1
      const sides = parseInt(diceMatch[2])
      if (sides < 1 || sides > 1000) return null
      const rolls: number[] = []
      for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1)
      const subtotal = rolls.reduce((a, b) => a + b, 0)
      total += sign * subtotal
      const prefix = sign === -1 ? '-' : parts.length ? '+' : ''
      parts.push(`${prefix}${count}d${sides}[${rolls.join(',')}]`)
    } else {
      const flat = parseInt(expr)
      if (isNaN(flat)) return null
      total += sign * flat
      if (flat !== 0) parts.push(`${sign === -1 ? '-' : parts.length ? '+' : ''}${flat}`)
    }
  }
  return { total, breakdown: parts.join(' ') }
}
