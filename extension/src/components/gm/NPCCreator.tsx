import { useState } from 'react'
import { defaultNPC, STAT_KEYS } from '../../lib/character-defaults'
import type { NPC } from '../../lib/character-defaults'

interface Props {
  onSave: (npc: NPC) => void
  onCancel: () => void
}

export function NPCCreator({ onSave, onCancel }: Props) {
  const [npc, setNpc] = useState<NPC>(defaultNPC)

  const field = (key: keyof NPC) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setNpc(n => ({ ...n, [key]: e.target.value }))

  const adjStat = (stat: keyof NPC['stats'], delta: number) =>
    setNpc(n => ({ ...n, stats: { ...n.stats, [stat]: Math.max(0, Math.min(5, n.stats[stat] + delta)) } }))

  const inputCls = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const labelCls = 'block text-xs text-sl-muted mb-1'

  return (
    <div className="bg-sl-surface border border-sl-border rounded-lg p-3 space-y-3">
      <h4 className="text-sm font-semibold text-sl-accent">New NPC</h4>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>Name</label>
          <input className={inputCls} value={npc.name} onChange={field('name')} placeholder="NPC name" />
        </div>
        <div>
          <label className={labelCls}>Gem type / species</label>
          <input className={inputCls} value={npc.gemType} onChange={field('gemType')} placeholder="e.g. Peridot" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Weapon / move</label>
        <input className={inputCls} value={npc.weapon} onChange={field('weapon')} placeholder="e.g. Limb enhancers, Energy whip" />
      </div>

      <div>
        <label className={labelCls}>Power</label>
        <input className={inputCls} value={npc.power} onChange={field('power')} placeholder="Core ability or special move" />
      </div>

      <div>
        <label className={labelCls}>Threat</label>
        <input className={inputCls} value={npc.threat} onChange={field('threat')} placeholder="What makes them dangerous or complicated?" />
      </div>

      <div>
        <label className={labelCls}>Stats</label>
        <div className="grid grid-cols-5 gap-1.5">
          {STAT_KEYS.map(s => (
            <div key={s} className="bg-sl-bg border border-sl-border rounded p-1.5 text-center">
              <p className="text-xs text-sl-muted font-mono mb-1">{s.slice(0,3).toUpperCase()}</p>
              <div className="flex items-center justify-center gap-1">
                <button onClick={() => adjStat(s, -1)} className="text-sl-muted hover:text-sl-text leading-none text-xs w-4">−</button>
                <span className="text-sm font-bold text-sl-text w-3 text-center">{npc.stats[s]}</span>
                <button onClick={() => adjStat(s, +1)} className="text-sl-muted hover:text-sl-text leading-none text-xs w-4">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Notes</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={npc.notes}
          onChange={field('notes')}
          placeholder="Motivations, quirks, scene context…"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { if (npc.name.trim()) onSave(npc) }}
          disabled={!npc.name.trim()}
          className="flex-1 py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold disabled:opacity-40 hover:opacity-90"
        >
          Add NPC
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded border border-sl-border text-sl-muted text-xs hover:border-sl-accent">
          Cancel
        </button>
      </div>
    </div>
  )
}
