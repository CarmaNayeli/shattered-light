import { useState, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { useFusion } from '../../hooks/useFusion'
import { supabase } from '../../lib/supabase'
import { rollPool, highest, secondHighest, getOutcome, outcomeLabel, isResonance, countSixes, collateralResult, collateralLabel } from '../../lib/dice'
import { statAdvanceCost, requiresSignificantMoment } from '../../lib/advancement'
import { STAT_KEYS, STAT_NAMES, STAT_ABBR } from '../../lib/character-defaults'
import type { NPC } from '../../lib/character-defaults'
import type { StatKey } from '../../types/character'
import type { FusionSheet } from '../../types/fusion'
import type { ChatMessage } from '../../types/chat'

interface Props {
  roomId: string
  characterName: string
  characterResonance?: number
  onRoll?: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'playerId' | 'playerName'>) => void
}

// ── Harmony ─────────────────────────────────────────────────────────────────

export function HarmonyTrack({ harmony, onChange }: { harmony: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < harmony
        return (
          <button key={i} onClick={() => onChange(filled ? i : i + 1)} title={`Harmony ${i + 1}`}
            className={`w-5 h-5 rounded-sm border transition-all
              ${filled ? 'bg-sl-harmony border-sl-harmony' : 'bg-transparent border-sl-border hover:border-sl-harmony'}`} />
        )
      })}
      <span className="text-xs text-sl-muted ml-1">{harmony}/5</span>
    </div>
  )
}

export function HarmonyWarning({ harmony }: { harmony: number }) {
  if (harmony === 0) return <p className="text-xs text-sl-danger">At 0 — hold or split?</p>
  if (harmony === 1) return <p className="text-xs text-sl-danger">1 — GM asks private questions each scene</p>
  if (harmony === 2) return <p className="text-xs text-sl-partial">2 — signature moves unavailable</p>
  return null
}

// ── Create form ──────────────────────────────────────────────────────────────

const CUSTOM_VAL = '__custom__'

type OptionGroup = 'Players' | 'NPCs' | 'Fusions'

function NewFusionForm({
  characterName,
  otherOptions,
  onSave,
  onCancel,
}: {
  characterName: string
  otherOptions: Array<{ value: string; group: OptionGroup }>
  onSave: (f: FusionSheet) => void
  onCancel: () => void
}) {
  const [name, setName]             = useState('')
  const [const2Sel, setConst2Sel]   = useState('')
  const [customConst2, setCustom]   = useState('')
  const [appearance, setAppearance] = useState('')
  const [baseGemCount, setBaseGemCount] = useState(2)
  // constituent stats for formula calculation
  const [c1Stats, setC1Stats] = useState<Record<StatKey, number>>({ form: 0, clarity: 0, resonance: 0, radiance: 0, resolve: 0 })
  const [c2Stats, setC2Stats] = useState<Record<StatKey, number>>({ form: 0, clarity: 0, resonance: 0, radiance: 0, resolve: 0 })
  const [s1name, setS1name]         = useState('')
  const [s1val, setS1val]           = useState(2)
  const [s2name, setS2name]         = useState('')
  const [s2val, setS2val]           = useState(2)
  const [s3name, setS3name]         = useState('')
  const [s3val, setS3val]           = useState(2)
  const [move1, setMove1]           = useState('')
  const [move2, setMove2]           = useState('')
  const [relNote, setRelNote]       = useState('')

  const const2 = const2Sel === CUSTOM_VAL ? customConst2 : const2Sel

  function derivedStat(key: StatKey): number {
    return Math.round((c1Stats[key] + c2Stats[key]) / 2 + baseGemCount)
  }

  function save() {
    if (!name.trim() || !const2.trim()) return
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      constituent1: characterName,
      constituent2: const2.trim(),
      appearance: appearance.trim(),
      baseGemCount,
      baseStats: {
        form:      derivedStat('form'),
        clarity:   derivedStat('clarity'),
        resonance: derivedStat('resonance'),
        radiance:  derivedStat('radiance'),
        resolve:   derivedStat('resolve'),
      },
      stats: { stat1Name: s1name, stat1Value: s1val, stat2Name: s2name, stat2Value: s2val, stat3Name: s3name, stat3Value: s3val },
      harmony: 5,
      signatureMove1: move1.trim(),
      signatureMove2: move2.trim(),
      relationshipNote: relNote.trim(),
      notes: '',
      xp: 0,
      significantMoments: [],
      createdAt: Date.now(),
    })
  }

  const inp  = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const lbl  = 'block text-xs text-sl-muted mb-1'
  const row  = 'flex gap-2'
  const sinp = 'flex-1 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const ninp = 'w-12 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent'
  const sel  = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text focus:outline-none focus:border-sl-accent'

  const grouped: Partial<Record<OptionGroup, typeof otherOptions>> = {}
  for (const opt of otherOptions) {
    if (!grouped[opt.group]) grouped[opt.group] = []
    grouped[opt.group]!.push(opt)
  }

  return (
    <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-3">
      <h4 className="text-sm font-semibold text-sl-accent">New Fusion Sheet</h4>
      <div><label className={lbl}>Fusion name</label><input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chrysocolla" /></div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Constituent 1</label>
          <div className="px-2 py-1.5 rounded border border-sl-border bg-sl-bg text-xs text-sl-muted">{characterName}</div>
        </div>
        <div>
          <label className={lbl}>Constituent 2</label>
          <select className={sel} value={const2Sel} onChange={e => setConst2Sel(e.target.value)}>
            <option value="">— Select —</option>
            {(['Players', 'NPCs', 'Fusions'] as OptionGroup[]).map(g => grouped[g]?.length ? (
              <optgroup key={g} label={g}>
                {grouped[g]!.map(o => <option key={o.value} value={o.value}>{o.value}</option>)}
              </optgroup>
            ) : null)}
            <option value={CUSTOM_VAL}>Custom…</option>
          </select>
          {const2Sel === CUSTOM_VAL && (
            <input className={`${inp} mt-1`} value={customConst2} onChange={e => setCustom(e.target.value)} placeholder="Gem name" />
          )}
        </div>
      </div>
      <div><label className={lbl}>Appearance</label><textarea className={`${inp} resize-none`} rows={2} value={appearance} onChange={e => setAppearance(e.target.value)} placeholder="What does this fusion look like?" /></div>

      {/* Base stats — constituent inputs + formula */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className={`${lbl} mb-0`}>Base stats</p>
          <span className="text-xs text-sl-muted/60 font-mono">round(avg + </span>
          <input type="number" min={2} max={10} value={baseGemCount}
            onChange={e => setBaseGemCount(Math.max(2, +e.target.value))}
            className="w-10 bg-sl-bg border border-sl-border rounded px-1 py-0.5 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent" />
          <span className="text-xs text-sl-muted/60 font-mono">gems)</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center">
          {STAT_KEYS.map(k => (
            <div key={k} className="text-xs text-sl-muted font-mono">{STAT_ABBR[k]}</div>
          ))}
          {STAT_KEYS.map(k => (
            <input key={k} type="number" min={0} max={5} value={c1Stats[k]}
              onChange={e => setC1Stats(s => ({ ...s, [k]: Math.max(0, Math.min(5, +e.target.value)) }))}
              className="w-full bg-sl-bg border border-sl-border rounded px-0 py-1 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent" />
          ))}
          <div className="col-span-5 text-xs text-sl-muted text-center font-mono">↑ {characterName}</div>
          {STAT_KEYS.map(k => (
            <input key={k} type="number" min={0} max={5} value={c2Stats[k]}
              onChange={e => setC2Stats(s => ({ ...s, [k]: Math.max(0, Math.min(5, +e.target.value)) }))}
              className="w-full bg-sl-bg border border-sl-border rounded px-0 py-1 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent" />
          ))}
          <div className="col-span-5 text-xs text-sl-muted text-center font-mono">↑ {const2 || 'Constituent 2'}</div>
          {STAT_KEYS.map(k => (
            <div key={k} className="py-1 rounded border border-sl-accent/30 bg-sl-accent/5 text-xs font-bold text-sl-accent text-center">{derivedStat(k)}</div>
          ))}
          <div className="col-span-5 text-xs text-sl-muted text-center font-mono">↑ Result (editable after save)</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className={lbl}>Three unique stats (name + value 0–5)</p>
        <div className={row}><input className={sinp} value={s1name} onChange={e => setS1name(e.target.value)} placeholder="Stat 1 name" /><input type="number" min={0} max={5} className={ninp} value={s1val} onChange={e => setS1val(+e.target.value)} /></div>
        <div className={row}><input className={sinp} value={s2name} onChange={e => setS2name(e.target.value)} placeholder="Stat 2 name" /><input type="number" min={0} max={5} className={ninp} value={s2val} onChange={e => setS2val(+e.target.value)} /></div>
        <div className={row}><input className={sinp} value={s3name} onChange={e => setS3name(e.target.value)} placeholder="Stat 3 name" /><input type="number" min={0} max={5} className={ninp} value={s3val} onChange={e => setS3val(+e.target.value)} /></div>
      </div>
      <div><label className={lbl}>Signature Move 1 (physical)</label><textarea className={`${inp} resize-none`} rows={2} value={move1} onChange={e => setMove1(e.target.value)} placeholder="When [circumstance], I can [effect]." /></div>
      <div><label className={lbl}>Signature Move 2 (relational)</label><textarea className={`${inp} resize-none`} rows={2} value={move2} onChange={e => setMove2(e.target.value)} placeholder="When [circumstance], I can [effect]." /></div>
      <div><label className={lbl}>Relationship note</label><textarea className={`${inp} resize-none`} rows={2} value={relNote} onChange={e => setRelNote(e.target.value)} placeholder={"\"When they're together, they…\""} /></div>
      <div className="flex gap-2">
        <button onClick={save} disabled={!name.trim() || !const2.trim()}
          className="flex-1 py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold disabled:opacity-40 hover:opacity-90">
          Create Fusion
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded border border-sl-border text-sl-muted text-xs hover:border-sl-accent">Cancel</button>
      </div>
    </div>
  )
}

// ── Fusion sheet view (used both inline and in the popover) ──────────────────

type FusionTab = 'roll' | 'moves' | 'story' | 'advance'

export function FusionSheetView({
  fusion, onUpdate, onUpdateHarmony, onClose, onRoll,
}: {
  fusion: FusionSheet
  onUpdate: (f: FusionSheet) => void
  onUpdateHarmony: (n: number) => void
  onClose?: () => void
  onRoll: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'playerId' | 'playerName'>) => void
}) {
  const [tab, setTab]               = useState<FusionTab>('roll')
  const [activeStat, setActiveStat] = useState<{ name: string; val: number } | null>(null)
  const [lastRoll, setLastRoll]     = useState<{ dice: number[]; label: string } | null>(null)
  const [editing, setEditing]       = useState(false)
  const [editDraft, setEditDraft]   = useState<FusionSheet>(fusion)
  const [sceneNote, setSceneNote]   = useState('')
  const [hcResolve, setHcResolve]   = useState(2)
  const [lastHC, setLastHC]         = useState<{ dice: number[]; highest: number } | null>(null)

  function rollHarmonyCheck() {
    if (hcResolve <= 0) return
    const dice = rollPool(hcResolve)
    const high = highest(dice)
    setLastHC({ dice, highest: high })
    onRoll({
      type: 'roll_pool',
      rollLabel: `${fusion.name} — Harmony Check (Resolve ${hcResolve})`,
      dice,
      highest: high,
      outcome: getOutcome(high),
      isResonance: isResonance(dice),
      collateral: secondHighest(dice),
    })
  }

  function startEdit() { setEditDraft(fusion); setEditing(true) }
  function cancelEdit() { setEditing(false) }
  function saveEdit() { onUpdate(editDraft); setEditing(false) }

  const base = fusion.baseStats ?? { form: 0, clarity: 0, resonance: 0, radiance: 0, resolve: 0 }

  const customStats = [
    { key: 'c1', name: fusion.stats.stat1Name, val: fusion.stats.stat1Value },
    { key: 'c2', name: fusion.stats.stat2Name, val: fusion.stats.stat2Value },
    { key: 'c3', name: fusion.stats.stat3Name, val: fusion.stats.stat3Value },
  ].filter(s => s.name.trim())

  const poolSize = activeStat?.val ?? 0

  function handleRoll() {
    if (!activeStat || poolSize <= 0) return
    const dice    = rollPool(poolSize)
    const high    = highest(dice)
    const outcome = getOutcome(high)
    const res     = isResonance(dice)
    setLastRoll({ dice, label: activeStat.name })
    onRoll({ type: 'roll_pool', rollLabel: `${fusion.name} — ${activeStat.name}`, dice, highest: high, outcome, isResonance: res, collateral: secondHighest(dice) })
  }

  function toggleStat(name: string, val: number) {
    setActiveStat(prev => prev?.name === name ? null : { name, val })
  }


  const taText = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none'

  const taEdit = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none'
  const inpEdit = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const lblEdit = 'block text-xs text-sl-muted mb-1'
  const numEdit = 'w-12 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent'

  if (editing) return (
    <div className="flex flex-col h-full bg-sl-bg">
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-sl-border flex items-center justify-between">
        <p className="text-sm font-semibold text-sl-accent">Edit Fusion</p>
        <div className="flex gap-2">
          <button onClick={cancelEdit} className="text-xs text-sl-muted hover:text-sl-text border border-sl-border rounded px-2 py-1">Cancel</button>
          <button onClick={saveEdit} className="text-xs bg-sl-accent text-sl-accent-fg rounded px-2 py-1 font-semibold hover:opacity-90">Save</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div><label className={lblEdit}>Fusion name</label><input className={inpEdit} value={editDraft.name} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={lblEdit}>Constituent 1</label><div className="px-2 py-1.5 rounded border border-sl-border bg-sl-bg text-xs text-sl-muted">{editDraft.constituent1}</div></div>
          <div><label className={lblEdit}>Constituent 2</label><input className={inpEdit} value={editDraft.constituent2} onChange={e => setEditDraft(d => ({ ...d, constituent2: e.target.value }))} /></div>
        </div>
        <div><label className={lblEdit}>Appearance</label><textarea className={taEdit} rows={2} value={editDraft.appearance} onChange={e => setEditDraft(d => ({ ...d, appearance: e.target.value }))} /></div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <p className={`${lblEdit} mb-0`}>Base gem count</p>
            <input type="number" min={2} max={10}
              value={editDraft.baseGemCount ?? 2}
              onChange={e => setEditDraft(d => ({ ...d, baseGemCount: Math.max(2, +e.target.value) }))}
              className={`${numEdit} w-14`} />
          </div>
          <p className={lblEdit}>Standard stats (FOR / CLA / RSN / RAD / RSV)</p>
          <div className="grid grid-cols-5 gap-1">
            {STAT_KEYS.map(k => (
              <div key={k} className="space-y-0.5">
                <div className="text-xs text-sl-muted font-mono text-center">{STAT_ABBR[k]}</div>
                <input type="number" min={0} max={9}
                  value={(editDraft.baseStats ?? { form:0,clarity:0,resonance:0,radiance:0,resolve:0 })[k]}
                  onChange={e => setEditDraft(d => ({
                    ...d,
                    baseStats: { ...(d.baseStats ?? { form:0,clarity:0,resonance:0,radiance:0,resolve:0 }), [k]: Math.max(0, Math.min(9, +e.target.value)) },
                  }))}
                  className={`${numEdit} w-full`} />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className={lblEdit}>Fusion stats (name + value 0–5)</p>
          {([1,2,3] as const).map(idx => {
            const nameKey = `stat${idx}Name` as 'stat1Name'|'stat2Name'|'stat3Name'
            const valKey  = `stat${idx}Value` as 'stat1Value'|'stat2Value'|'stat3Value'
            return (
              <div key={idx} className="flex gap-2">
                <input className="flex-1 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent"
                  value={editDraft.stats[nameKey]} onChange={e => setEditDraft(d => ({ ...d, stats: { ...d.stats, [nameKey]: e.target.value } }))} placeholder={`Stat ${idx} name`} />
                <input type="number" min={0} max={5} className={numEdit}
                  value={editDraft.stats[valKey]} onChange={e => setEditDraft(d => ({ ...d, stats: { ...d.stats, [valKey]: Math.max(0,Math.min(5,+e.target.value)) } }))} />
              </div>
            )
          })}
        </div>
        <div><label className={lblEdit}>Signature Move 1 (physical)</label><textarea className={taEdit} rows={2} value={editDraft.signatureMove1} onChange={e => setEditDraft(d => ({ ...d, signatureMove1: e.target.value }))} /></div>
        <div><label className={lblEdit}>Signature Move 2 (relational)</label><textarea className={taEdit} rows={2} value={editDraft.signatureMove2} onChange={e => setEditDraft(d => ({ ...d, signatureMove2: e.target.value }))} /></div>
        <div><label className={lblEdit}>Relationship note</label><textarea className={taEdit} rows={2} value={editDraft.relationshipNote} onChange={e => setEditDraft(d => ({ ...d, relationshipNote: e.target.value }))} /></div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      {/* Header */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-sl-border space-y-2">
        <div className="flex items-center justify-between">
          {onClose && (
            <button onClick={onClose} className="text-xs text-sl-muted hover:text-sl-text">✕ Close</button>
          )}
          <button onClick={startEdit} className="text-xs text-sl-muted hover:text-sl-text ml-auto">Edit</button>
        </div>
        <div>
          <p className="font-bold text-sl-accent text-base leading-tight">{fusion.name}</p>
          <p className="text-xs text-sl-muted">{fusion.constituent1} + {fusion.constituent2}</p>
        </div>
        <div>
          <p className="text-xs text-sl-muted mb-1">Harmony</p>
          <HarmonyTrack harmony={fusion.harmony} onChange={onUpdateHarmony} />
          <HarmonyWarning harmony={fusion.harmony} />
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-sl-border">
        {(['roll', 'moves', 'story', 'advance'] as FusionTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-mono capitalize transition-colors
              ${tab === t ? 'text-sl-accent border-b-2 border-sl-accent' : 'text-sl-muted hover:text-sl-text'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {tab === 'roll' && (
          <>
            <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Standard stats</p>
            <div className="grid grid-cols-5 gap-1.5">
              {STAT_KEYS.map(k => {
                const val = base[k]
                const active = activeStat?.name === STAT_NAMES[k]
                return (
                  <button key={k} onClick={() => toggleStat(STAT_NAMES[k], val)}
                    className={`flex flex-col items-center py-2 rounded border transition-all
                      ${active
                        ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                        : 'bg-sl-surface border-sl-border text-sl-text hover:border-sl-accent'}`}>
                    <span className="text-lg font-bold leading-none">{val}</span>
                    <span className="text-xs mt-0.5 font-mono">{STAT_ABBR[k]}</span>
                  </button>
                )
              })}
            </div>
            {customStats.length > 0 && (
              <>
                <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Fusion stats</p>
                <div className={`grid gap-2 ${customStats.length === 1 ? 'grid-cols-1' : customStats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {customStats.map(s => {
                    const active = activeStat?.name === s.name
                    return (
                      <button key={s.key} onClick={() => toggleStat(s.name, s.val)}
                        className={`flex flex-col items-center py-2 rounded border transition-all
                          ${active
                            ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                            : 'bg-sl-surface border-sl-border text-sl-text hover:border-sl-accent'}`}>
                        <span className="text-lg font-bold leading-none">{s.val}</span>
                        <span className="text-xs mt-0.5 font-mono">{s.name.slice(0, 3).toUpperCase()}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}


            <div className="flex items-center gap-3 border-t border-sl-border pt-2">
              <div className="flex-1">
                {!activeStat && <p className="text-sm text-sl-muted">Select a stat above</p>}
                {activeStat && poolSize > 0 && <p className="text-sm text-sl-text">Roll <span className="font-bold text-sl-accent">{poolSize}d6</span> <span className="text-sl-muted text-xs">({activeStat.name})</span></p>}
                {activeStat && poolSize === 0 && <p className="text-sm text-sl-danger">Stat is 0 — can't roll</p>}
              </div>
              <button onClick={handleRoll} disabled={!activeStat || poolSize === 0}
                className="px-4 py-2 rounded bg-sl-accent text-sl-accent-fg text-sm font-bold disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all">
                Roll
              </button>
            </div>

            {lastRoll && (
              <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
                <p className="text-xs text-sl-muted font-mono uppercase">{lastRoll.label}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {lastRoll.dice.map((d, i) => {
                    const sixes  = countSixes(lastRoll.dice)
                    const isSixRes = d === 6 && sixes >= 2
                    const isHigh = d === highest(lastRoll.dice) && i === lastRoll.dice.indexOf(d)
                    return (
                      <span key={i} className={`w-7 h-7 flex items-center justify-center rounded text-sm font-bold border
                        ${isSixRes ? 'bg-sl-harmony text-sl-bg border-sl-harmony'
                          : isHigh ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                          : 'bg-sl-bg text-sl-muted border-sl-border'}`}>{d}</span>
                    )
                  })}
                </div>
                {(() => {
                  const high = highest(lastRoll.dice)
                  const outcome = getOutcome(high)
                  const res    = isResonance(lastRoll.dice)
                  const second = secondHighest(lastRoll.dice)
                  const coll   = second !== undefined ? collateralResult(second) : null
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${outcome === 'success' ? 'text-sl-success' : outcome === 'partial' ? 'text-sl-partial' : 'text-sl-miss'}`}>
                          {outcomeLabel(outcome)}
                        </span>
                        {res && <span className="text-xs bg-sl-harmony/20 text-sl-harmony border border-sl-harmony/30 rounded px-1.5 py-0.5 font-semibold">Resonance</span>}
                      </div>
                      {res && <p className="text-xs text-sl-harmony">Two or more 6s — something exceptional happens.</p>}
                      {!res && coll && second !== undefined && lastRoll.dice.length > 1 && (
                        <p className="text-xs text-sl-muted">Second die {second}: {collateralLabel(coll)}</p>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}

            <div className="border-t border-sl-border pt-2 space-y-1 text-xs text-sl-muted font-mono">
              <div className="flex gap-2"><span className="text-sl-success w-4">6</span><span>Clean success</span></div>
              <div className="flex gap-2"><span className="text-sl-partial w-4">4–5</span><span>Success with cost</span></div>
              <div className="flex gap-2"><span className="text-sl-miss w-4">1–3</span><span>Miss — GM moves</span></div>
              <div className="flex gap-2"><span className="text-sl-harmony w-8">2+ 6s</span><span>Resonance</span></div>
            </div>

            {/* Harmony Check */}
            <div className="border-t border-sl-border pt-3 space-y-2">
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Harmony Check</p>
              <p className="text-xs text-sl-muted">Roll the lower of the two constituent gems' current Resolve.</p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-sl-muted shrink-0">Lower Resolve</label>
                <input type="number" min={0} max={5} value={hcResolve}
                  onChange={e => setHcResolve(Math.max(0, Math.min(5, +e.target.value)))}
                  className="w-14 bg-sl-bg border border-sl-border rounded px-2 py-1 text-xs text-sl-text text-center focus:outline-none focus:border-sl-harmony" />
                <button onClick={rollHarmonyCheck} disabled={hcResolve <= 0}
                  className="flex-1 py-1 rounded text-xs font-semibold border border-sl-harmony text-sl-harmony hover:bg-sl-harmony/10 disabled:opacity-40 transition-colors">
                  Roll
                </button>
              </div>
              {lastHC && (
                <div className="bg-sl-surface border border-sl-border rounded p-2 space-y-1.5">
                  <div className="flex gap-1 flex-wrap">
                    {lastHC.dice.map((d, i) => (
                      <span key={i} className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold border
                        ${d === lastHC.highest && i === lastHC.dice.indexOf(lastHC.highest)
                          ? 'bg-sl-harmony text-sl-bg border-sl-harmony'
                          : 'bg-sl-bg text-sl-muted border-sl-border'}`}>{d}</span>
                    ))}
                  </div>
                  <p className={`text-xs font-semibold
                    ${lastHC.highest >= 6 ? 'text-sl-success' : lastHC.highest >= 4 ? 'text-sl-partial' : 'text-sl-danger'}`}>
                    {lastHC.highest >= 6
                      ? 'Hold — no box lost.'
                      : lastHC.highest >= 4
                        ? 'Hold, but — GM picks: lose a box or visibly compromise.'
                        : 'Lose a box. GM makes a move.'}
                  </p>
                  {lastHC.highest <= 3 && (
                    <button onClick={() => { onUpdate({ ...fusion, harmony: Math.max(0, fusion.harmony - 1) }); setLastHC(null) }}
                      className="w-full py-1 rounded text-xs border border-sl-danger text-sl-danger hover:bg-sl-danger/10 transition-colors">
                      Mark box lost (Harmony {fusion.harmony} → {fusion.harmony - 1})
                    </button>
                  )}
                </div>
              )}
              <div className="text-xs text-sl-muted font-mono space-y-0.5 pt-1">
                <div className="flex gap-2"><span className="text-sl-success w-4">6</span><span>Hold — no box lost</span></div>
                <div className="flex gap-2"><span className="text-sl-partial w-4">4–5</span><span>Hold, but — GM picks: box or compromise</span></div>
                <div className="flex gap-2"><span className="text-sl-danger w-4">1–3</span><span>Lose a box — GM moves</span></div>
              </div>
            </div>
          </>
        )}

        {tab === 'moves' && (
          <>
            {fusion.signatureMove1 && (
              <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-sl-muted font-mono uppercase">Physical Move</p>
                  <button
                    onClick={() => onRoll({ type: 'move', moveName: `${fusion.name} — Physical Move`, moveDesc: fusion.signatureMove1 })}
                    className="text-xs px-2 py-0.5 rounded border border-sl-accent text-sl-accent hover:bg-sl-accent hover:text-sl-accent-fg transition-colors">
                    Use
                  </button>
                </div>
                <p className="text-xs text-sl-text italic">{fusion.signatureMove1}</p>
              </div>
            )}
            {fusion.signatureMove2 && (
              <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-sl-muted font-mono uppercase">Relational Move</p>
                  <button
                    onClick={() => onRoll({ type: 'move', moveName: `${fusion.name} — Relational Move`, moveDesc: fusion.signatureMove2 })}
                    className="text-xs px-2 py-0.5 rounded border border-sl-accent text-sl-accent hover:bg-sl-accent hover:text-sl-accent-fg transition-colors">
                    Use
                  </button>
                </div>
                <p className="text-xs text-sl-text italic">{fusion.signatureMove2}</p>
              </div>
            )}
            {fusion.relationshipNote && (
              <div className="bg-sl-surface border border-sl-border rounded p-3">
                <p className="text-xs text-sl-bond italic">"{fusion.relationshipNote}"</p>
              </div>
            )}
            <div className="border-t border-sl-border pt-3 space-y-2">
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Harmony Recovery</p>
              <p className="text-xs text-sl-muted">Play a connection scene while unfused — talking, arguing, or doing something meaningful together. Each sincere scene (GM's call) restores one Harmony box.</p>
              <textarea
                rows={2}
                value={sceneNote}
                onChange={e => setSceneNote(e.target.value)}
                placeholder="Briefly describe the scene (optional)…"
                className="w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-harmony resize-none"
              />
              <button
                disabled={fusion.harmony >= 5}
                onClick={() => {
                  const note = sceneNote.trim()
                  const timestamp = new Date().toLocaleDateString()
                  const entry = note ? `[Connection scene ${timestamp}] ${note}` : `[Connection scene ${timestamp}]`
                  const updatedNotes = fusion.notes ? `${fusion.notes}\n${entry}` : entry
                  onUpdate({ ...fusion, harmony: Math.min(5, fusion.harmony + 1), notes: updatedNotes })
                  setSceneNote('')
                }}
                className="w-full py-1.5 rounded text-xs font-semibold transition-all border
                  border-sl-harmony text-sl-harmony hover:bg-sl-harmony/10 disabled:opacity-40 disabled:cursor-not-allowed">
                + Connection Scene {fusion.harmony < 5 ? `(Harmony ${fusion.harmony} → ${fusion.harmony + 1})` : '(Harmony full)'}
              </button>
            </div>
          </>
        )}

        {tab === 'advance' && (() => {
          const fusionXp = fusion.xp ?? 0
          const sigMoments = fusion.significantMoments ?? []
          const statDefs = [
            { idx: 1 as const, name: fusion.stats.stat1Name, val: fusion.stats.stat1Value, valKey: 'stat1Value' as const },
            { idx: 2 as const, name: fusion.stats.stat2Name, val: fusion.stats.stat2Value, valKey: 'stat2Value' as const },
            { idx: 3 as const, name: fusion.stats.stat3Name, val: fusion.stats.stat3Value, valKey: 'stat3Value' as const },
          ].filter(s => s.name.trim())
          return (
            <div className="space-y-4">
              {/* XP counter */}
              <div className="flex items-center justify-between bg-sl-surface border border-sl-border rounded px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-sl-text">Fusion XP</p>
                  <p className="text-xs text-sl-muted">Earned only through moments while fused</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onUpdate({ ...fusion, xp: Math.max(0, fusionXp - 1) })}
                    className="w-5 h-5 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-xs">−</button>
                  <span className="text-sm font-bold text-sl-accent w-5 text-center">{fusionXp}</span>
                  <button onClick={() => onUpdate({ ...fusion, xp: fusionXp + 1 })}
                    className="w-5 h-5 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-xs">+</button>
                </div>
              </div>
              {/* Stats */}
              <div>
                <p className="text-xs text-sl-muted mb-1.5 font-semibold">Stats</p>
                <div className="space-y-1.5">
                  {statDefs.map(s => {
                    const atCeil    = s.val >= 5
                    const cost      = statAdvanceCost(s.val)
                    const needsSig  = requiresSignificantMoment('form', s.val) // reuse curve, no optionalZero for fusions
                    const sigOk     = sigMoments.includes(s.idx)
                    const canAdv    = !atCeil && fusionXp >= cost && (!needsSig || sigOk)
                    return (
                      <div key={s.idx} className="bg-sl-bg border border-sl-border rounded px-2.5 py-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-sl-text flex-1">{s.name}</span>
                          <span className="text-xs text-sl-muted">
                            {s.val}/5{atCeil ? ' (max)' : ` → ${s.val + 1} · ${cost} XP`}
                          </span>
                          <button disabled={!canAdv} onClick={() => {
                            onUpdate({ ...fusion,
                              stats: { ...fusion.stats, [s.valKey]: s.val + 1 },
                              xp: fusionXp - cost,
                              significantMoments: sigMoments.filter(m => m !== s.idx),
                            })
                          }}
                            className={`text-xs px-2 py-0.5 rounded whitespace-nowrap transition-all
                              ${canAdv ? 'bg-sl-accent text-sl-accent-fg hover:opacity-90 active:scale-95'
                                : 'bg-sl-surface text-sl-muted border border-sl-border opacity-60 cursor-not-allowed'}`}>
                            {atCeil ? 'Max' : '+1'}
                          </button>
                          <button onClick={() => onUpdate({ ...fusion, stats: { ...fusion.stats, [s.valKey]: Math.max(0, s.val - 1) } })}
                            className="w-5 h-5 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-xs">−</button>
                        </div>
                        {needsSig && !atCeil && (
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={sigOk}
                              onChange={() => onUpdate({ ...fusion, significantMoments: sigOk ? sigMoments.filter(m => m !== s.idx) : [...sigMoments, s.idx] })}
                              className="accent-[var(--sl-accent)] w-3 h-3" />
                            <span className="text-xs text-sl-muted">Significant story moment confirmed (GM) — required for 4→5</span>
                          </label>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Cost reference */}
              <div className="border-t border-sl-border pt-2 text-xs text-sl-muted font-mono space-y-0.5">
                <div className="flex gap-3"><span>0→1: 1 XP</span><span>1→2: 1 XP</span><span>2→3: 2 XP</span></div>
                <div className="flex gap-3"><span>3→4: 2 XP</span><span>4→5: 3 XP ★</span></div>
              </div>
            </div>
          )
        })()}

        {tab === 'story' && (
          <>
            {fusion.appearance && (
              <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
                <p className="text-xs text-sl-muted font-mono uppercase">Appearance</p>
                <p className="text-xs text-sl-text">{fusion.appearance}</p>
              </div>
            )}
            <div>
              <label className="block text-xs text-sl-muted mb-1">Notes</label>
              <textarea
                rows={8}
                value={fusion.notes}
                onChange={e => onUpdate({ ...fusion, notes: e.target.value })}
                className={taText}
                placeholder="Session notes, GM prompts, what the fusion discovered…"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main FusionPanel (list + open-as-popover) ────────────────────────────────

export function FusionPanel({ roomId, characterName, characterResonance = 0, onRoll }: Props) {
  const { fusions, saveFusion, deleteFusion, updateHarmony } = useFusion(roomId)
  const [creating, setCreating]             = useState(false)
  const [confirmDelete, setConfirmDelete]   = useState<string | null>(null)
  const [openPopovers, setOpenPopovers]     = useState<Set<string>>(new Set())
  const [partyNames, setPartyNames]         = useState<string[]>([])
  const [npcNames, setNpcNames]             = useState<string[]>([])
  const [formationBond, setFormationBond]   = useState(1)
  const [lastFormation, setLastFormation]   = useState<{ dice: number[]; highest: number } | null>(null)

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
  }, [roomId])

  const otherOptions: Array<{ value: string; group: 'Players' | 'NPCs' | 'Fusions' }> = [
    ...partyNames.map(v => ({ value: v, group: 'Players' as const })),
    ...npcNames.map(v => ({ value: v, group: 'NPCs' as const })),
    ...fusions.map(f => ({ value: f.name, group: 'Fusions' as const })),
  ]

  const myFusions = fusions.filter(f => f.constituent1 === characterName || f.constituent2 === characterName)

  function rollFormation() {
    const pool = characterResonance + formationBond
    if (pool <= 0 || !onRoll) return
    const dice = rollPool(pool)
    const high = highest(dice)
    setLastFormation({ dice, highest: high })
    onRoll({
      type: 'roll_pool',
      rollLabel: `Formation Roll — ${characterName} (Resonance ${characterResonance} + Bond ${formationBond})`,
      dice,
      highest: high,
      outcome: getOutcome(high),
      isResonance: isResonance(dice),
      collateral: secondHighest(dice),
    })
  }

  async function openFusionSheet(fusionId: string) {
    const popoverId = `sl-fusion-${fusionId.slice(0, 8)}`
    if (openPopovers.has(fusionId)) {
      await OBR.popover.close(popoverId)
      setOpenPopovers(prev => { const s = new Set(prev); s.delete(fusionId); return s })
      return
    }
    const url = new URL(`?mode=fusion&fusionId=${fusionId}`, window.location.href).toString()
    await OBR.popover.open({
      id: popoverId,
      url,
      width: 380,
      height: 560,
      anchorReference: 'POSITION',
      anchorPosition: { left: 99999, top: 80 },
      anchorOrigin: { horizontal: 'RIGHT', vertical: 'TOP' },
      transformOrigin: { horizontal: 'RIGHT', vertical: 'TOP' },
      disableClickAway: false,
    })
    setOpenPopovers(prev => new Set(prev).add(fusionId))
  }

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sl-text">Fusions</h3>
        {!creating && (
          <button onClick={() => setCreating(true)} className="text-xs text-sl-accent hover:opacity-80">+ Add Fusion</button>
        )}
      </div>
      <p className="text-xs text-sl-muted">Fusion sheets open as a separate panel. Harmony is tracked here and synced to all players in the room.</p>

      {/* Formation Roll */}
      {onRoll && (
        <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
          <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Formation Roll</p>
          <p className="text-xs text-sl-muted">Roll Resonance + Bond rating with your partner.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-sl-muted shrink-0">Resonance {characterResonance}</span>
            <span className="text-xs text-sl-muted shrink-0">+</span>
            <label className="text-xs text-sl-muted shrink-0">Bond</label>
            <input type="number" min={0} max={5} value={formationBond}
              onChange={e => setFormationBond(Math.max(0, Math.min(5, +e.target.value)))}
              className="w-14 bg-sl-bg border border-sl-border rounded px-2 py-1 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent" />
            <button onClick={rollFormation} disabled={characterResonance + formationBond <= 0}
              className="flex-1 py-1 rounded text-xs font-semibold bg-sl-accent text-sl-accent-fg hover:opacity-90 disabled:opacity-40 transition-colors">
              Roll {characterResonance + formationBond}d6
            </button>
          </div>
          {lastFormation && (
            <div className="space-y-1.5">
              <div className="flex gap-1 flex-wrap">
                {lastFormation.dice.map((d, i) => (
                  <span key={i} className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold border
                    ${d === lastFormation.highest && i === lastFormation.dice.indexOf(lastFormation.highest)
                      ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                      : 'bg-sl-bg text-sl-muted border-sl-border'}`}>{d}</span>
                ))}
              </div>
              <p className={`text-xs font-semibold
                ${lastFormation.highest >= 6 ? 'text-sl-success' : lastFormation.highest >= 4 ? 'text-sl-partial' : 'text-sl-danger'}`}>
                {lastFormation.highest >= 6
                  ? 'Full Harmony — fuse cleanly.'
                  : lastFormation.highest >= 4
                    ? 'Harmony 3 — fuse, but something complicates it.'
                    : 'Fusion doesn\'t form — try again next exchange.'}
              </p>
            </div>
          )}
          <div className="text-xs text-sl-muted font-mono space-y-0.5 pt-1 border-t border-sl-border">
            <div className="flex gap-2"><span className="text-sl-success w-4">6</span><span>Full Harmony</span></div>
            <div className="flex gap-2"><span className="text-sl-partial w-4">4–5</span><span>Harmony 3 — complication</span></div>
            <div className="flex gap-2"><span className="text-sl-danger w-4">1–3</span><span>Doesn't form — next exchange</span></div>
          </div>
        </div>
      )}

      {creating && (
        <NewFusionForm
          characterName={characterName}
          otherOptions={otherOptions}
          onSave={async f => { await saveFusion(f); setCreating(false) }}
          onCancel={() => setCreating(false)}
        />
      )}

      {myFusions.length === 0 && !creating && (
        <p className="text-xs text-sl-muted text-center py-4">No fusion sheets yet.</p>
      )}

      {myFusions.map(fusion => (
        <div key={fusion.id} className="bg-sl-surface border border-sl-border rounded-lg p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-sl-accent">{fusion.name}</p>
              <p className="text-xs text-sl-muted">{fusion.constituent1} + {fusion.constituent2}</p>
            </div>
            <button
              onClick={() => openFusionSheet(fusion.id)}
              className={`shrink-0 px-3 py-1 rounded text-xs font-semibold transition-colors
                ${openPopovers.has(fusion.id)
                  ? 'bg-sl-accent/20 text-sl-accent border border-sl-accent'
                  : 'bg-sl-accent text-sl-accent-fg hover:opacity-90'}`}
            >
              {openPopovers.has(fusion.id) ? 'Close' : 'Open'}
            </button>
          </div>
          <div>
            <p className="text-xs text-sl-muted mb-1">Harmony</p>
            <HarmonyTrack harmony={fusion.harmony} onChange={n => updateHarmony(fusion.id, n)} />
            <HarmonyWarning harmony={fusion.harmony} />
          </div>
          {confirmDelete === fusion.id ? (
            <div className="border border-red-500/40 rounded p-2 space-y-1.5 bg-red-500/5">
              <p className="text-xs text-sl-muted text-center">Delete <span className="text-sl-text font-medium">{fusion.name}</span>?</p>
              <div className="flex gap-2">
                <button onClick={() => deleteFusion(fusion.id)} className="flex-1 py-1 rounded bg-red-600 text-white text-xs font-semibold">Delete</button>
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-1 rounded border border-sl-border text-sl-muted text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(fusion.id)} className="w-full text-xs text-sl-muted hover:text-red-400 text-right">Delete</button>
          )}
        </div>
      ))}

      <div className="border-t border-sl-border pt-3">
        <p className="text-xs text-sl-muted mb-1.5 font-mono uppercase tracking-wide">Harmony Track</p>
        <div className="space-y-0.5 text-xs text-sl-muted">
          <div className="flex gap-2"><span className="w-4">5</span><span>Stable — full fusion</span></div>
          <div className="flex gap-2"><span className="w-4 text-sl-partial">2</span><span>Signature moves unavailable</span></div>
          <div className="flex gap-2"><span className="w-4 text-sl-danger">1</span><span>GM asks private questions</span></div>
          <div className="flex gap-2"><span className="w-4 text-sl-danger">0</span><span>Player choice: hold or split?</span></div>
        </div>
      </div>
    </div>
  )
}
