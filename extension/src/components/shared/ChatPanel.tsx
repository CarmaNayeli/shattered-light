import { useState, useRef, useEffect } from 'react'
import { useChat } from '../../hooks/useChat'
import { parseDiceFormula, resolveStatVars, CHAT_STATS_KEY } from '../../lib/dice'
import type { ChatMessage } from '../../types/chat'

interface Props {
  playerId: string
  playerName: string
  accentColor?: string
}

function OutcomeBadge({ outcome, isResonance }: { outcome?: string; isResonance?: boolean }) {
  if (!outcome) return null
  const base = 'inline-block text-xs font-semibold px-1.5 py-0.5 rounded ml-1'
  if (isResonance) return <span className={`${base} bg-sl-harmony/20 text-sl-harmony border border-sl-harmony/30`}>Resonance!</span>
  if (outcome === 'success') return <span className={`${base} bg-sl-success/20 text-sl-success border border-sl-success/30`}>Success</span>
  if (outcome === 'partial') return <span className={`${base} bg-sl-partial/20 text-sl-partial border border-sl-partial/30`}>Cost</span>
  return <span className={`${base} bg-sl-miss/20 text-sl-miss border border-sl-miss/30`}>Miss</span>
}

function RollMessage({ msg }: { msg: ChatMessage }) {
  const dice = msg.dice ?? []
  const high = msg.highest
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs font-semibold text-sl-text">{msg.rollLabel ?? 'Roll'}</span>
        <OutcomeBadge outcome={msg.outcome} isResonance={msg.isResonance} />
      </div>
      <div className="flex gap-1 flex-wrap">
        {dice.map((d, i) => (
          <span key={i} className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold border
            ${d === high ? 'bg-sl-accent text-sl-accent-fg border-sl-accent' : 'bg-sl-bg text-sl-muted border-sl-border'}`}>
            {d}
          </span>
        ))}
        {dice.length === 0 && <span className="text-xs text-sl-muted">{msg.breakdown}</span>}
      </div>
      {msg.isResonance && (
        <p className="text-xs text-sl-harmony">Two 6s — Resonance result</p>
      )}
      {msg.collateral !== undefined && !msg.isResonance && dice.length > 1 && (
        <p className="text-xs text-sl-muted">Collateral: {msg.collateral} — {msg.collateral >= 5 ? 'something good' : msg.collateral >= 3 ? 'neutral ripple' : 'an unintended crack'}</p>
      )}
    </div>
  )
}

function parseDiceValues(breakdown: string): number[] {
  const values: number[] = []
  for (const m of breakdown.matchAll(/\[([^\]]+)\]/g)) {
    m[1].split(',').forEach(v => { const n = parseInt(v); if (!isNaN(n)) values.push(n) })
  }
  return values
}

function parseModifier(breakdown: string): number {
  let mod = 0
  const withoutGroups = breakdown.replace(/[+-]?\d+d\d+\[[^\]]+\]/g, '')
  for (const m of (withoutGroups.match(/[+-]\d+/g) ?? [])) mod += parseInt(m)
  return mod
}

function ManualRollMessage({ msg }: { msg: ChatMessage }) {
  const breakdown = msg.breakdown ?? ''
  const values    = parseDiceValues(breakdown)
  const modifier  = parseModifier(breakdown)
  return (
    <div className="space-y-0.5">
      <span className="text-xs font-semibold text-sl-text">{msg.formula ?? 'Roll'}</span>
      <div className="flex items-center gap-1 flex-wrap">
        {values.map((v, i) => (
          <span key={i} className="w-6 h-6 flex items-center justify-center rounded text-xs font-bold border bg-sl-bg text-sl-muted border-sl-border">
            {v}
          </span>
        ))}
        {modifier !== 0 && (
          <span className="text-xs text-sl-muted font-mono">{modifier > 0 ? `+${modifier}` : modifier}</span>
        )}
        {values.length > 0 && (
          <span className="text-xs text-sl-muted font-mono ml-0.5">= <span className="text-sl-text font-bold">{msg.total}</span></span>
        )}
        {values.length === 0 && (
          <span className="text-xs text-sl-muted">{breakdown} = <span className="text-sl-text font-bold">{msg.total}</span></span>
        )}
      </div>
    </div>
  )
}

function MoveMessage({ msg }: { msg: ChatMessage }) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-sl-accent">{msg.moveName}</p>
      {msg.moveDesc && <p className="text-xs text-sl-muted italic leading-snug">{msg.moveDesc}</p>}
    </div>
  )
}

export function ChatPanel({ playerId, playerName, accentColor }: Props) {
  const { messages, sendChat, announceRoll } = useChat(playerId, playerName, accentColor)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')

    if (text.startsWith('!r ')) {
      const formula = text.slice(3).trim()
      const statsRaw = localStorage.getItem(CHAT_STATS_KEY)
      const stats = statsRaw ? JSON.parse(statsRaw) : null
      const resolved = resolveStatVars(formula, stats)
      if (!resolved) { await sendChat(`[can't resolve: ${formula}]`); return }
      const result = parseDiceFormula(resolved)
      if (!result) { await sendChat(`[invalid: ${formula}]`); return }
      await announceRoll({ type: 'roll_manual', rollLabel: formula, formula, total: result.total, breakdown: result.breakdown })
    } else {
      await sendChat(text)
    }
  }

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-sl-muted text-center mt-4">No messages yet</p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className="space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold" style={{ color: msg.accentColor ?? '#A8C8F0' }}>{msg.playerName}</span>
              <span className="text-xs text-sl-muted">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {msg.type === 'chat'        && <p className="text-sm text-sl-text">{msg.text}</p>}
            {msg.type === 'roll_pool'   && <RollMessage msg={msg} />}
            {msg.type === 'roll_manual' && <ManualRollMessage msg={msg} />}
            {msg.type === 'move'        && <MoveMessage msg={msg} />}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="shrink-0 border-t border-sl-border px-3 py-2 flex gap-2">
        <input
          className="flex-1 bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent"
          placeholder="Chat or !r 3d6…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="px-3 py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold hover:opacity-90">Send</button>
      </form>
    </div>
  )
}
