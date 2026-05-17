import { useState } from 'react'
import { STAT_KEYS } from '../../lib/character-defaults'
import type { NPC } from '../../lib/character-defaults'

interface Props {
  npc: NPC
  onUpdate: (npc: NPC) => void
  onDelete: (id: string) => void
}

export function NPCSheet({ npc, onUpdate, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(npc)

  const adjStat = (stat: keyof NPC['stats'], delta: number) =>
    onUpdate({ ...npc, stats: { ...npc.stats, [stat]: Math.max(0, Math.min(5, npc.stats[stat] + delta)) } })

  function saveEdit() {
    onUpdate(draft)
    setEditing(false)
  }

  const inputCls = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const labelCls = 'block text-xs text-sl-muted mb-0.5'

  return (
    <div className="bg-sl-surface border border-sl-border rounded-lg p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sl-text text-sm truncate">{npc.name || 'Unnamed NPC'}</p>
          {npc.gemType && <p className="text-xs text-sl-muted">{npc.gemType}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => { setEditing(!editing); setDraft(npc) }} className="text-xs text-sl-muted hover:text-sl-text">
            {editing ? 'cancel' : 'edit'}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-sl-muted hover:text-sl-text">
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Stats row (always visible) */}
      <div className="grid grid-cols-5 gap-1">
        {STAT_KEYS.map(s => (
          <div key={s} className="bg-sl-bg border border-sl-border rounded p-1 text-center">
            <p className="text-sm font-bold text-sl-text">{npc.stats[s]}</p>
            <div className="flex items-center justify-center gap-0.5">
              <button onClick={() => adjStat(s, -1)} className="text-sl-muted hover:text-sl-text text-xs leading-none">−</button>
              <p className="text-xs text-sl-muted font-mono">{s.slice(0,3).toUpperCase()}</p>
              <button onClick={() => adjStat(s, +1)} className="text-sl-muted hover:text-sl-text text-xs leading-none">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="space-y-2 pt-2 border-t border-sl-border">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Gem type</label>
              <input className={inputCls} value={draft.gemType} onChange={e => setDraft(d => ({ ...d, gemType: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Weapon</label>
            <input className={inputCls} value={draft.weapon} onChange={e => setDraft(d => ({ ...d, weapon: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Power</label>
            <input className={inputCls} value={draft.power} onChange={e => setDraft(d => ({ ...d, power: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Threat</label>
            <input className={inputCls} value={draft.threat} onChange={e => setDraft(d => ({ ...d, threat: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} />
          </div>
          <button onClick={saveEdit} className="w-full py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold hover:opacity-90">
            Save Changes
          </button>
        </div>
      )}

      {/* Expanded details */}
      {!editing && expanded && (
        <div className="pt-2 border-t border-sl-border space-y-1.5">
          {npc.weapon && (
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase">Weapon</p>
              <p className="text-xs text-sl-text">{npc.weapon}</p>
            </div>
          )}
          {npc.power && (
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase">Power</p>
              <p className="text-xs text-sl-text">{npc.power}</p>
            </div>
          )}
          {npc.threat && (
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase">Threat</p>
              <p className="text-xs text-sl-text italic">{npc.threat}</p>
            </div>
          )}
          {npc.notes && (
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase">Notes</p>
              <p className="text-xs text-sl-muted">{npc.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Delete */}
      {!editing && (
        confirmDelete ? (
          <div className="border border-red-500/40 rounded p-2 space-y-1.5 bg-red-500/5">
            <p className="text-xs text-sl-muted text-center">Delete <span className="text-sl-text font-medium">{npc.name}</span>?</p>
            <div className="flex gap-2">
              <button onClick={() => onDelete(npc.id)} className="flex-1 py-1 rounded bg-red-600 text-white text-xs font-semibold">Delete</button>
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-1 rounded border border-sl-border text-sl-muted text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="w-full text-xs text-sl-muted hover:text-red-400 text-right pt-1">
            Delete
          </button>
        )
      )}
    </div>
  )
}
