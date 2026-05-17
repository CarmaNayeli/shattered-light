import { useState } from 'react'
import type { PlayerEntry } from '../../hooks/useGMView'
import type { NPC } from '../../lib/character-defaults'

interface InitEntry {
  id: string
  label: string
  type: 'player' | 'npc' | 'custom'
}

interface Props {
  players: PlayerEntry[]
  npcs: NPC[]
}

export function InitiativeTracker({ players, npcs }: Props) {
  const [order, setOrder]     = useState<InitEntry[]>([])
  const [current, setCurrent] = useState(0)
  const [custom, setCustom]   = useState('')

  function buildFromScene() {
    const entries: InitEntry[] = [
      ...players
        .filter(p => p.snapshot)
        .map(p => ({ id: p.playerId, label: p.snapshot!.name, type: 'player' as const })),
      ...npcs.map(n => ({ id: n.id, label: n.name || 'Unnamed NPC', type: 'npc' as const })),
    ]
    setOrder(entries)
    setCurrent(0)
  }

  function addCustom() {
    if (!custom.trim()) return
    setOrder(o => [...o, { id: crypto.randomUUID(), label: custom.trim(), type: 'custom' }])
    setCustom('')
  }

  function remove(id: string) {
    setOrder(o => {
      const next = o.filter(e => e.id !== id)
      setCurrent(c => Math.min(c, Math.max(0, next.length - 1)))
      return next
    })
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir
    if (target < 0 || target >= order.length) return
    setOrder(o => {
      const next = [...o]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  function next() {
    if (order.length === 0) return
    setCurrent(c => (c + 1) % order.length)
  }

  function clear() {
    setOrder([])
    setCurrent(0)
  }

  const typeColor: Record<InitEntry['type'], string> = {
    player: 'text-sl-accent',
    npc:    'text-sl-partial',
    custom: 'text-sl-muted',
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sl-text">Initiative</h3>
        <div className="flex gap-2">
          <button onClick={buildFromScene} className="text-xs text-sl-accent hover:opacity-80">Load scene</button>
          {order.length > 0 && <button onClick={clear} className="text-xs text-sl-muted hover:text-sl-danger">Clear</button>}
        </div>
      </div>

      <p className="text-xs text-sl-muted">Load the current scene to pull in all players and NPCs, or add custom entries manually.</p>

      {/* Add custom entry */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent"
          placeholder="Custom entry (environment, timer…)"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustom()}
        />
        <button onClick={addCustom} disabled={!custom.trim()} className="px-3 py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold disabled:opacity-40 hover:opacity-90">
          Add
        </button>
      </div>

      {order.length === 0 && (
        <p className="text-xs text-sl-muted text-center py-4">No entries yet — click "Load scene" or add custom entries above.</p>
      )}

      {/* Initiative list */}
      {order.length > 0 && (
        <div className="space-y-1">
          {order.map((entry, idx) => (
            <div
              key={entry.id}
              className={`flex items-center gap-2 rounded p-2 transition-colors
                ${idx === current ? 'bg-sl-accent/10 border border-sl-accent/30' : 'bg-sl-surface border border-sl-border'}`}
            >
              <span className={`text-xs font-mono w-5 text-center ${idx === current ? 'text-sl-accent font-bold' : 'text-sl-muted'}`}>
                {idx + 1}
              </span>
              <span className={`flex-1 text-sm truncate font-medium ${typeColor[entry.type]} ${idx === current ? 'font-bold' : ''}`}>
                {entry.label}
              </span>
              <span className={`text-xs ${typeColor[entry.type]} opacity-60`}>{entry.type}</span>
              <div className="flex gap-1 items-center">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-xs text-sl-muted hover:text-sl-text disabled:opacity-30">↑</button>
                <button onClick={() => move(idx, +1)} disabled={idx === order.length - 1} className="text-xs text-sl-muted hover:text-sl-text disabled:opacity-30">↓</button>
                <button onClick={() => remove(entry.id)} className="text-xs text-sl-muted hover:text-sl-danger ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {order.length > 0 && (
        <button
          onClick={next}
          className="w-full py-2 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold hover:opacity-90"
        >
          Next Turn →
        </button>
      )}

      {order.length > 0 && (
        <p className="text-xs text-sl-muted text-center">
          Current: <span className="text-sl-accent font-medium">{order[current]?.label ?? '—'}</span>
        </p>
      )}
    </div>
  )
}
