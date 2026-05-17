import { useState, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { supabase } from '../../lib/supabase'
import type { NPC } from '../../lib/character-defaults'
import type { FusionSheet } from '../../types/fusion'
import type { Bond } from '../../types/character'

const FUSIONS_KEY = 'sl_fusions'
const CUSTOM_VAL  = '__custom__'

interface Props {
  bonds: Bond[]
  roomId: string
  characterName: string
  onChange: (bonds: Bond[]) => void
}

function RatingDots({ rating, onChange }: { rating: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating
        return (
          <button
            key={i}
            onClick={() => onChange(filled ? i : i + 1)}
            title={`Set to ${i + 1}`}
            className={`w-3 h-3 rounded-full border transition-colors
              ${filled ? 'bg-sl-bond border-sl-bond' : 'bg-transparent border-sl-border hover:border-sl-bond'}`}
          />
        )
      })}
    </div>
  )
}

const RATING_LABELS: Record<number, string> = {
  0: 'Absent',
  1: 'Nascent — fragile, something is there',
  2: 'Real — you know each other',
  3: 'Deep — you\'ve been through something together',
  4: 'Foundational — this relationship is part of who you are',
  5: 'Resonant — complete trust',
}

type OptionGroup = 'Players' | 'NPCs' | 'Fusions'

export function BondsPanel({ bonds, roomId, characterName, onChange }: Props) {
  const [nameSel, setNameSel]         = useState('')
  const [customName, setCustomName]   = useState('')
  const [newNote, setNewNote]         = useState('')
  const [editing, setEditing]         = useState<string | null>(null)
  const [confirmDelete, setConfirm]   = useState<string | null>(null)
  const [partyNames, setPartyNames]   = useState<string[]>([])
  const [npcNames, setNpcNames]       = useState<string[]>([])
  const [fusionNames, setFusionNames] = useState<string[]>([])

  useEffect(() => {
    OBR.onReady(async () => {
      const players = await OBR.party.getPlayers()
      const names = players
        .map(p => (p.metadata?.['sl'] as { name?: string } | undefined)?.name || p.name)
        .filter(n => n !== characterName)
      setPartyNames(names)
    })
  }, [characterName])

  useEffect(() => {
    if (!roomId) return
    supabase.from('npcs').select('npc_data').eq('room_id', roomId).maybeSingle()
      .then(({ data }) => {
        const npcs = (data?.npc_data as NPC[]) ?? []
        setNpcNames(npcs.map(n => n.name).filter(Boolean))
      })
    OBR.onReady(async () => {
      const meta = await OBR.room.getMetadata()
      const fusions = (meta[FUSIONS_KEY] as FusionSheet[]) ?? []
      setFusionNames(fusions.map(f => f.name))
    })
  }, [roomId])

  const options: Array<{ value: string; group: OptionGroup }> = [
    ...partyNames.map(v => ({ value: v, group: 'Players' as const })),
    ...npcNames.map(v => ({ value: v, group: 'NPCs' as const })),
    ...fusionNames.map(v => ({ value: v, group: 'Fusions' as const })),
  ]

  const grouped: Partial<Record<OptionGroup, typeof options>> = {}
  for (const opt of options) {
    if (!grouped[opt.group]) grouped[opt.group] = []
    grouped[opt.group]!.push(opt)
  }

  const targetName = nameSel === CUSTOM_VAL ? customName : nameSel

  function addBond() {
    if (!targetName.trim()) return
    const bond: Bond = {
      id:         crypto.randomUUID(),
      targetName: targetName.trim(),
      rating:     1,
      note:       newNote.trim() || '',
    }
    onChange([...bonds, bond])
    setNameSel('')
    setCustomName('')
    setNewNote('')
  }

  function removeBond(id: string) {
    onChange(bonds.filter(b => b.id !== id))
  }

  function updateRating(id: string, rating: number) {
    onChange(bonds.map(b => b.id === id ? { ...b, rating } : b))
  }

  function updateNote(id: string, note: string) {
    onChange(bonds.map(b => b.id === id ? { ...b, note } : b))
  }

  const sel = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text focus:outline-none focus:border-sl-accent'
  const inp = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sl-text">Bonds</h3>
        <span className="text-xs text-sl-muted">{bonds.length} relationship{bonds.length !== 1 ? 's' : ''}</span>
      </div>
      <p className="text-xs text-sl-muted">Bonds are tracked per gem and asymmetric — your rating is yours. One Bond adds its rating as bonus dice (max +4) to any roll where that relationship is genuinely active.</p>

      {bonds.map(bond => (
        <div key={bond.id} className="bg-sl-surface border border-sl-border rounded p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm text-sl-accent truncate">{bond.targetName}</span>
            <div className="flex items-center gap-2 shrink-0">
              <RatingDots rating={bond.rating} onChange={n => updateRating(bond.id, n)} />
              <button onClick={() => setEditing(editing === bond.id ? null : bond.id)}
                className="text-xs text-sl-muted hover:text-sl-text transition-colors">edit</button>
              <button onClick={() => { setConfirm(bond.id); setEditing(null) }}
                className="text-xs text-sl-muted hover:text-sl-danger transition-colors">✕</button>
            </div>
          </div>
          <p className="text-xs text-sl-muted">{RATING_LABELS[bond.rating]} · +{Math.min(4, bond.rating)}d6 bonus</p>
          {editing === bond.id && confirmDelete !== bond.id ? (
            <textarea
              className="w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
              rows={2}
              placeholder="One sentence about this relationship…"
              value={bond.note}
              onChange={e => updateNote(bond.id, e.target.value)}
            />
          ) : bond.note && confirmDelete !== bond.id ? (
            <p className="text-xs text-sl-muted italic">"{bond.note}"</p>
          ) : null}
          {confirmDelete === bond.id && (
            <div className="border border-red-500/40 rounded p-2 space-y-1.5 bg-red-500/5">
              <p className="text-xs text-sl-muted text-center">Remove Bond with <span className="text-sl-text font-medium">{bond.targetName}</span>?</p>
              <div className="flex gap-2">
                <button onClick={() => { removeBond(bond.id); setConfirm(null) }}
                  className="flex-1 py-1 rounded bg-red-600 text-white text-xs font-semibold">Remove</button>
                <button onClick={() => setConfirm(null)}
                  className="flex-1 py-1 rounded border border-sl-border text-sl-muted text-xs">Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add bond */}
      <div className="border border-dashed border-sl-border rounded p-2.5 space-y-2">
        <p className="text-xs text-sl-muted">Add a Bond</p>
        <select className={sel} value={nameSel} onChange={e => setNameSel(e.target.value)}>
          <option value="">— Select —</option>
          {(['Players', 'NPCs', 'Fusions'] as OptionGroup[]).map(g => grouped[g]?.length ? (
            <optgroup key={g} label={g}>
              {grouped[g]!.map(o => <option key={o.value} value={o.value}>{o.value}</option>)}
            </optgroup>
          ) : null)}
          <option value={CUSTOM_VAL}>Custom…</option>
        </select>
        {nameSel === CUSTOM_VAL && (
          <input className={inp} value={customName} onChange={e => setCustomName(e.target.value)}
            placeholder="Name" onKeyDown={e => e.key === 'Enter' && addBond()} />
        )}
        <textarea
          className={`${inp} resize-none`}
          rows={2}
          placeholder="One sentence about this relationship (optional)…"
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
        />
        <button
          onClick={addBond}
          disabled={!targetName.trim()}
          className="w-full py-1.5 rounded text-xs bg-sl-accent text-sl-accent-fg disabled:opacity-40 hover:opacity-90 font-semibold"
        >
          Add Bond
        </button>
      </div>

      {/* Bond scale reference */}
      <div className="border-t border-sl-border pt-3">
        <p className="text-xs text-sl-muted mb-1.5 font-mono uppercase tracking-wide">Bond Scale</p>
        <div className="space-y-0.5">
          {[0,1,2,3,4,5].map(n => (
            <div key={n} className="flex gap-2 text-xs">
              <span className="text-sl-bond w-3 shrink-0">{n}</span>
              <span className="text-sl-muted">{RATING_LABELS[n]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
