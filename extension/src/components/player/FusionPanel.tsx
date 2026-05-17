import { useState } from 'react'
import { useFusion } from '../../hooks/useFusion'
import type { FusionSheet } from '../../types/fusion'

interface Props {
  roomId: string
  characterName: string
}

function HarmonyTrack({ harmony, onChange }: { harmony: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < harmony
        return (
          <button
            key={i}
            onClick={() => onChange(filled ? i : i + 1)}
            title={`Harmony ${i + 1}`}
            className={`w-5 h-5 rounded-sm border transition-all
              ${filled
                ? 'bg-sl-harmony border-sl-harmony'
                : 'bg-transparent border-sl-border hover:border-sl-harmony'
              }`}
          />
        )
      })}
      <span className="text-xs text-sl-muted ml-1">{harmony}/5</span>
    </div>
  )
}

function HarmonyWarning({ harmony }: { harmony: number }) {
  if (harmony === 0) return <p className="text-xs text-sl-danger">At 0 — player choice moment: both hold or both split?</p>
  if (harmony === 1) return <p className="text-xs text-sl-danger">1 box — GM asks private questions each scene</p>
  if (harmony === 2) return <p className="text-xs text-sl-partial">2 boxes — signature moves unavailable</p>
  return null
}

function NewFusionForm({ onSave, onCancel }: { onSave: (f: FusionSheet) => void; onCancel: () => void }) {
  const [name, setName]           = useState('')
  const [const1, setConst1]       = useState('')
  const [const2, setConst2]       = useState('')
  const [appearance, setAppearance] = useState('')
  const [s1name, setS1name]       = useState('')
  const [s1val, setS1val]         = useState(2)
  const [s2name, setS2name]       = useState('')
  const [s2val, setS2val]         = useState(2)
  const [s3name, setS3name]       = useState('')
  const [s3val, setS3val]         = useState(2)
  const [move1, setMove1]         = useState('')
  const [move2, setMove2]         = useState('')
  const [relNote, setRelNote]     = useState('')

  function save() {
    if (!name.trim() || !const1.trim() || !const2.trim()) return
    onSave({
      id:           crypto.randomUUID(),
      name:         name.trim(),
      constituent1: const1.trim(),
      constituent2: const2.trim(),
      appearance:   appearance.trim(),
      stats: { stat1Name: s1name, stat1Value: s1val, stat2Name: s2name, stat2Value: s2val, stat3Name: s3name, stat3Value: s3val },
      harmony:      5,
      signatureMove1: move1.trim(),
      signatureMove2: move2.trim(),
      relationshipNote: relNote.trim(),
      createdAt:    Date.now(),
    })
  }

  const label = 'block text-xs text-sl-muted mb-1'
  const input = 'w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const statRow = 'flex gap-2'
  const statInput = 'flex-1 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const numInput = 'w-12 bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text text-center focus:outline-none focus:border-sl-accent'

  return (
    <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-3">
      <h4 className="text-sm font-semibold text-sl-accent">New Fusion Sheet</h4>
      <div><label className={label}>Fusion name</label><input className={input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chrysocolla" /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className={label}>Constituent 1</label><input className={input} value={const1} onChange={e => setConst1(e.target.value)} placeholder="Gem A name" /></div>
        <div><label className={label}>Constituent 2</label><input className={input} value={const2} onChange={e => setConst2(e.target.value)} placeholder="Gem B name" /></div>
      </div>
      <div><label className={label}>Appearance</label><textarea className={`${input} resize-none`} rows={2} value={appearance} onChange={e => setAppearance(e.target.value)} placeholder="What does this fusion look like?" /></div>
      <div className="space-y-1.5">
        <p className={label}>Three unique stats (name + value 0–5)</p>
        <div className={statRow}><input className={statInput} value={s1name} onChange={e => setS1name(e.target.value)} placeholder="Stat 1 name" /><input type="number" min={0} max={5} className={numInput} value={s1val} onChange={e => setS1val(+e.target.value)} /></div>
        <div className={statRow}><input className={statInput} value={s2name} onChange={e => setS2name(e.target.value)} placeholder="Stat 2 name" /><input type="number" min={0} max={5} className={numInput} value={s2val} onChange={e => setS2val(+e.target.value)} /></div>
        <div className={statRow}><input className={statInput} value={s3name} onChange={e => setS3name(e.target.value)} placeholder="Stat 3 name" /><input type="number" min={0} max={5} className={numInput} value={s3val} onChange={e => setS3val(+e.target.value)} /></div>
      </div>
      <div><label className={label}>Signature Move 1 (physical)</label><textarea className={`${input} resize-none`} rows={2} value={move1} onChange={e => setMove1(e.target.value)} placeholder="When [circumstance], I can [effect]." /></div>
      <div><label className={label}>Signature Move 2 (relational)</label><textarea className={`${input} resize-none`} rows={2} value={move2} onChange={e => setMove2(e.target.value)} placeholder="When [circumstance], I can [effect]." /></div>
      <div><label className={label}>Relationship note</label><textarea className={`${input} resize-none`} rows={2} value={relNote} onChange={e => setRelNote(e.target.value)} placeholder={"\"When they're together, they…\""} /></div>
      <div className="flex gap-2">
        <button onClick={save} disabled={!name.trim() || !const1.trim() || !const2.trim()} className="flex-1 py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold disabled:opacity-40 hover:opacity-90">Create Fusion</button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded border border-sl-border text-sl-muted text-xs hover:border-sl-accent">Cancel</button>
      </div>
    </div>
  )
}

export function FusionPanel({ roomId, characterName }: Props) {
  const { fusions, saveFusion, deleteFusion, updateHarmony } = useFusion(roomId)
  const [creating, setCreating] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const myFusions = fusions.filter(f => f.constituent1 === characterName || f.constituent2 === characterName)

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-sl-text">Fusions</h3>
        {!creating && (
          <button onClick={() => setCreating(true)} className="text-xs text-sl-accent hover:opacity-80">+ Session Zero</button>
        )}
      </div>
      <p className="text-xs text-sl-muted">Fusion sheets are created in session zero before play begins. Track Harmony — it drops on narrative disagreement, significant hits, Bond drops, or targeted pressure.</p>

      {creating && (
        <NewFusionForm
          onSave={async f => { await saveFusion(f); setCreating(false) }}
          onCancel={() => setCreating(false)}
        />
      )}

      {myFusions.length === 0 && !creating && (
        <p className="text-xs text-sl-muted text-center py-4">No fusion sheets yet — create one above for each possible pair.</p>
      )}

      {myFusions.map(fusion => (
        <div key={fusion.id} className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm text-sl-accent">{fusion.name}</p>
              <p className="text-xs text-sl-muted">{fusion.constituent1} + {fusion.constituent2}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setExpanded(expanded === fusion.id ? null : fusion.id)}
                className="text-xs text-sl-muted hover:text-sl-text">{expanded === fusion.id ? '▲' : '▼'}</button>
              <button onClick={() => deleteFusion(fusion.id)} className="text-xs text-sl-muted hover:text-sl-danger">✕</button>
            </div>
          </div>

          <div>
            <p className="text-xs text-sl-muted mb-1">Harmony</p>
            <HarmonyTrack harmony={fusion.harmony} onChange={n => updateHarmony(fusion.id, n)} />
            <HarmonyWarning harmony={fusion.harmony} />
          </div>

          {expanded === fusion.id && (
            <div className="pt-2 border-t border-sl-border space-y-2">
              {fusion.appearance && <p className="text-xs text-sl-muted italic">{fusion.appearance}</p>}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: fusion.stats.stat1Name, val: fusion.stats.stat1Value },
                  { name: fusion.stats.stat2Name, val: fusion.stats.stat2Value },
                  { name: fusion.stats.stat3Name, val: fusion.stats.stat3Value },
                ].map((s, i) => s.name ? (
                  <div key={i} className="bg-sl-bg border border-sl-border rounded p-1.5 text-center">
                    <p className="text-base font-bold text-sl-accent">{s.val}</p>
                    <p className="text-xs text-sl-muted">{s.name}</p>
                  </div>
                ) : null)}
              </div>
              {fusion.signatureMove1 && (
                <div>
                  <p className="text-xs text-sl-muted font-semibold">Physical Move</p>
                  <p className="text-xs text-sl-text italic">{fusion.signatureMove1}</p>
                </div>
              )}
              {fusion.signatureMove2 && (
                <div>
                  <p className="text-xs text-sl-muted font-semibold">Relational Move</p>
                  <p className="text-xs text-sl-text italic">{fusion.signatureMove2}</p>
                </div>
              )}
              {fusion.relationshipNote && (
                <p className="text-xs text-sl-bond italic">"{fusion.relationshipNote}"</p>
              )}
              <div className="pt-1 border-t border-sl-border">
                <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Harmony Recovery</p>
                <p className="text-xs text-sl-muted">Play a connection scene — unfused gems talking, arguing, laughing, or doing something meaningful together. Each sincere scene restores one Harmony box.</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Harmony quick reference */}
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
