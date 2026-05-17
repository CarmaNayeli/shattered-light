import { useState, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { useFusion } from '../../hooks/useFusion'
import { supabase } from '../../lib/supabase'
import { rollPool, highest, secondHighest, getOutcome, outcomeLabel, isResonance, countSixes, collateralResult, collateralLabel } from '../../lib/dice'
import type { NPC } from '../../lib/character-defaults'
import type { FusionSheet } from '../../types/fusion'
import type { ChatMessage } from '../../types/chat'

interface Props {
  roomId: string
  characterName: string
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

  function save() {
    if (!name.trim() || !const2.trim()) return
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      constituent1: characterName,
      constituent2: const2.trim(),
      appearance: appearance.trim(),
      stats: { stat1Name: s1name, stat1Value: s1val, stat2Name: s2name, stat2Value: s2val, stat3Name: s3name, stat3Value: s3val },
      harmony: 5,
      signatureMove1: move1.trim(),
      signatureMove2: move2.trim(),
      relationshipNote: relNote.trim(),
      notes: '',
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

type FusionTab = 'roll' | 'moves' | 'story'

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
  const [activeStat, setActiveStat] = useState<1 | 2 | 3 | null>(null)
  const [lastRoll, setLastRoll]     = useState<{ dice: number[]; label: string } | null>(null)

  const stats = [
    { idx: 1 as const, name: fusion.stats.stat1Name, val: fusion.stats.stat1Value },
    { idx: 2 as const, name: fusion.stats.stat2Name, val: fusion.stats.stat2Value },
    { idx: 3 as const, name: fusion.stats.stat3Name, val: fusion.stats.stat3Value },
  ].filter(s => s.name.trim())

  const activeStatDef = activeStat ? stats.find(s => s.idx === activeStat) : null
  const poolSize = activeStatDef?.val ?? 0

  function handleRoll() {
    if (!activeStatDef || poolSize <= 0) return
    const dice    = rollPool(poolSize)
    const high    = highest(dice)
    const outcome = getOutcome(high)
    const res     = isResonance(dice)
    setLastRoll({ dice, label: activeStatDef.name })
    onRoll({ type: 'roll_pool', rollLabel: `${fusion.name} — ${activeStatDef.name}`, dice, highest: high, outcome, isResonance: res, collateral: secondHighest(dice) })
  }

  function adjStat(idx: 1 | 2 | 3, delta: number) {
    const key = `stat${idx}Value` as 'stat1Value' | 'stat2Value' | 'stat3Value'
    onUpdate({ ...fusion, stats: { ...fusion.stats, [key]: Math.max(0, Math.min(5, fusion.stats[key] + delta)) } })
  }

  const taText = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none'

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      {/* Header */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-sl-border space-y-2">
        {onClose && (
          <button onClick={onClose} className="text-xs text-sl-muted hover:text-sl-text">✕ Close</button>
        )}
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
        {(['roll', 'moves', 'story'] as FusionTab[]).map(t => (
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
            <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Choose a stat to roll</p>
            <div className="grid grid-cols-3 gap-2">
              {stats.map(s => (
                <button key={s.idx} onClick={() => setActiveStat(activeStat === s.idx ? null : s.idx)}
                  className={`flex flex-col items-center py-2 rounded border transition-all
                    ${activeStat === s.idx
                      ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                      : 'bg-sl-surface border-sl-border text-sl-text hover:border-sl-accent'}`}>
                  <span className="text-lg font-bold leading-none">{s.val}</span>
                  <span className="text-xs mt-0.5 font-mono truncate w-full text-center px-1">{s.name}</span>
                </button>
              ))}
            </div>

            {activeStat && (
              <div className="flex items-center gap-2 bg-sl-surface border border-sl-border rounded px-3 py-2">
                <span className="text-xs text-sl-muted flex-1">Adjust {activeStatDef?.name}</span>
                <button onClick={() => adjStat(activeStat, -1)} className="w-6 h-6 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-sm">−</button>
                <span className="w-5 text-center font-bold text-sl-text text-sm">{activeStatDef?.val}</span>
                <button onClick={() => adjStat(activeStat, +1)} className="w-6 h-6 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-sm">+</button>
              </div>
            )}

            <div className="flex items-center gap-3 border-t border-sl-border pt-2">
              <div className="flex-1">
                {!activeStat && <p className="text-sm text-sl-muted">Select a stat above</p>}
                {activeStat && poolSize > 0 && <p className="text-sm text-sl-text">Roll <span className="font-bold text-sl-accent">{poolSize}d6</span></p>}
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
          </>
        )}

        {tab === 'moves' && (
          <>
            {fusion.signatureMove1 && (
              <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
                <p className="text-xs text-sl-muted font-mono uppercase">Physical Move</p>
                <p className="text-xs text-sl-text italic">{fusion.signatureMove1}</p>
              </div>
            )}
            {fusion.signatureMove2 && (
              <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
                <p className="text-xs text-sl-muted font-mono uppercase">Relational Move</p>
                <p className="text-xs text-sl-text italic">{fusion.signatureMove2}</p>
              </div>
            )}
            {fusion.relationshipNote && (
              <div className="bg-sl-surface border border-sl-border rounded p-3">
                <p className="text-xs text-sl-bond italic">"{fusion.relationshipNote}"</p>
              </div>
            )}
            <div className="border-t border-sl-border pt-3">
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Harmony Recovery</p>
              <p className="text-xs text-sl-muted">Play a connection scene — unfused gems talking, arguing, or doing something meaningful together. Each sincere scene restores one Harmony box.</p>
            </div>
          </>
        )}

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

export function FusionPanel({ roomId, characterName }: Props) {
  const { fusions, saveFusion, deleteFusion, updateHarmony } = useFusion(roomId)
  const [creating, setCreating]             = useState(false)
  const [confirmDelete, setConfirmDelete]   = useState<string | null>(null)
  const [openPopovers, setOpenPopovers]     = useState<Set<string>>(new Set())
  const [partyNames, setPartyNames]         = useState<string[]>([])
  const [npcNames, setNpcNames]             = useState<string[]>([])

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
