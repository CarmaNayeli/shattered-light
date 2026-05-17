import { useState } from 'react'
import { RollPanel } from './RollPanel'
import { BondsPanel } from './BondsPanel'
import { FusionPanel } from './FusionPanel'
import { STAT_KEYS, STAT_NAMES, getArchetype, getGemType, WEAPON_TAG_LABELS, BACKSTORY_QUESTIONS } from '../../lib/character-defaults'
import { statAdvanceCost, statBeyondCeilingCost, requiresSignificantMoment, powerAdvanceCost } from '../../lib/advancement'
import type { Character } from '../../types/character'
import type { ChatMessage } from '../../types/chat'

type Tab = 'roll' | 'bonds' | 'gem' | 'fusion' | 'story' | 'advance'

interface Props {
  character: Character
  roomId: string
  onUpdate: (char: Character) => void
  onRoll: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'playerId' | 'playerName'>) => void
}

function StatBlock({ character, onUpdate }: { character: Character; onUpdate: (c: Character) => void }) {
  const archDef = getArchetype(character.archetype)
  return (
    <div className="space-y-2 px-3 pt-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-sl-text">{character.name}</p>
          <p className="text-xs text-sl-muted">{character.pronouns && `${character.pronouns} · `}{getGemType(character.gemType).label} · {archDef.label}</p>
        </div>
        {/* Form damage tracker */}
        <div className="text-right">
          <p className="text-xs text-sl-muted">Form Damage</p>
          <div className="flex gap-1 justify-end mt-0.5">
            {[0,1,2,3].map(n => (
              <button key={n} onClick={() => onUpdate({ ...character, formDamage: character.formDamage === n+1 ? 0 : n+1 })}
                title={`Form −${n+1}`}
                className={`w-4 h-4 rounded-sm border text-xs transition-all
                  ${character.formDamage > n ? 'bg-sl-danger border-sl-danger' : 'bg-transparent border-sl-border hover:border-sl-danger'}`} />
            ))}
          </div>
          {character.formDamage > 0 && <p className="text-xs text-sl-danger">Form −{character.formDamage}</p>}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-1">
        {STAT_KEYS.map(stat => {
          const val = stat === 'form' ? Math.max(0, character.stats[stat] - character.formDamage) : character.stats[stat]
          const base = character.stats[stat]
          const ceiling = archDef.ceilings[stat]
          const marked = character.markedStats.includes(stat)
          return (
            <div key={stat} className="bg-sl-surface border border-sl-border rounded p-1.5 text-center">
              <p className="text-base font-bold text-sl-text">{val}</p>
              {stat === 'form' && character.formDamage > 0 && <p className="text-xs text-sl-muted line-through leading-none">{base}</p>}
              <p className="text-xs text-sl-muted font-mono">{stat.slice(0,3).toUpperCase()}</p>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                <span className="text-xs text-sl-muted">{base}/{ceiling}</span>
                <button
                  title={marked ? 'Marked for advance' : 'Mark for advance'}
                  onClick={() => {
                    const marks = marked
                      ? character.markedStats.filter(s => s !== stat)
                      : [...character.markedStats, stat]
                    onUpdate({ ...character, markedStats: marks })
                  }}
                  className={`w-2 h-2 rounded-full border transition-colors ml-1
                    ${marked ? 'bg-sl-harmony border-sl-harmony' : 'border-sl-border hover:border-sl-harmony'}`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GemTab({ character, onUpdate }: { character: Character; onUpdate: (c: Character) => void }) {
  const gemDef  = getGemType(character.gemType)
  const archDef = getArchetype(character.archetype)
  const [editSig, setEditSig] = useState(false)
  const [sigText, setSigText] = useState(character.signatureMove)

  return (
    <div className="space-y-4 p-3">
      {/* Archetype */}
      <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-sl-muted font-mono uppercase">Archetype — {archDef.diamond}</p>
          {character.archetypeShadowComplete && (
            <span className="text-xs text-sl-success bg-sl-success/10 border border-sl-success/30 rounded px-1.5 py-0.5">Shadow lifted</span>
          )}
        </div>
        <p className="font-semibold text-sl-text">{archDef.label}</p>
        <p className="text-xs text-sl-muted italic">{archDef.tagline}</p>
        <div className="pt-1 border-t border-sl-border">
          <p className="text-xs font-semibold text-sl-text">{archDef.startingMove}</p>
          <p className="text-xs text-sl-muted">{archDef.startingMoveDesc}</p>
        </div>
        <div className="pt-1">
          <p className="text-xs font-semibold text-sl-muted">Shadow</p>
          <p className="text-xs text-sl-muted">{archDef.shadow}</p>
          <button
            onClick={() => onUpdate({ ...character, archetypeShadowComplete: !character.archetypeShadowComplete })}
            className={`mt-1 text-xs px-2 py-0.5 rounded border transition-colors
              ${character.archetypeShadowComplete
                ? 'border-sl-success text-sl-success bg-sl-success/10'
                : 'border-sl-border text-sl-muted hover:border-sl-harmony'}`}
          >
            {character.archetypeShadowComplete ? '✓ Shadow lifted' : 'Mark shadow complete'}
          </button>
        </div>
      </div>

      {/* Weapon */}
      <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
        <p className="text-xs text-sl-muted font-mono uppercase">Weapon</p>
        <p className="font-semibold text-sl-text">{character.weapon.name}</p>
        <div className="flex gap-1 flex-wrap mt-1">
          {character.weapon.tags.map(tag => (
            <span key={tag} className="text-xs bg-sl-indigo/20 text-sl-text border border-sl-indigo/30 rounded px-1.5 py-0.5">
              {WEAPON_TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      </div>

      {/* Core power */}
      <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
        <p className="text-xs text-sl-muted font-mono uppercase">Core Power — {gemDef.label}</p>
        <p className="font-semibold text-sl-text">{gemDef.corePower.name}</p>
        <p className="text-xs text-sl-muted">{gemDef.corePower.desc}</p>
      </div>

      {/* Developed power(s) */}
      {[character.developedPower, ...(character.additionalPowers ?? [])].filter(Boolean).map(pName => {
        const def = gemDef.developedPowers.find(p => p.name === pName)
        return (
          <div key={pName} className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
            <p className="text-xs text-sl-muted font-mono uppercase">Developed Power</p>
            {def ? (
              <>
                <p className="font-semibold text-sl-text">{def.name}</p>
                <p className="text-xs text-sl-muted">{def.desc}</p>
              </>
            ) : <p className="text-xs text-sl-muted">{pName}</p>}
          </div>
        )
      })}

      {/* Signature move */}
      <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-sl-muted font-mono uppercase">Signature Move</p>
          <button onClick={() => { setEditSig(!editSig); setSigText(character.signatureMove) }}
            className="text-xs text-sl-muted hover:text-sl-text">
            {editSig ? 'cancel' : 'edit'}
          </button>
        </div>
        {editSig ? (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={sigText}
              onChange={e => setSigText(e.target.value)}
              className="w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
              placeholder='When [circumstance], I can [effect]. [Optional cost].'
            />
            <button onClick={() => { onUpdate({ ...character, signatureMove: sigText }); setEditSig(false) }}
              className="w-full py-1 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold hover:opacity-90">
              Save Move
            </button>
          </div>
        ) : (
          <p className="text-sm text-sl-text italic">{character.signatureMove || 'Not yet written.'}</p>
        )}
      </div>

      {/* Optional zero note */}
      {character.optionalZero && (
        <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
          <p className="text-xs text-sl-muted font-mono uppercase">Conditioned Out — {STAT_NAMES[character.optionalZero]}</p>
          <p className="text-xs text-sl-text italic">"{character.optionalZeroSentence}"</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <p className="text-xs text-sl-muted mb-1">Notes</p>
        <textarea
          rows={4}
          value={character.notes}
          onChange={e => onUpdate({ ...character, notes: e.target.value })}
          className="w-full bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
          placeholder="Notes…"
        />
      </div>

    </div>
  )
}

function AdvanceTab({ character, onUpdate }: { character: Character; onUpdate: (c: Character) => void }) {
  const archDef = getArchetype(character.archetype)
  const gemDef  = getGemType(character.gemType)
  const xp      = character.xp ?? 0

  return (
    <div className="space-y-4 p-3">
      {/* XP counter */}
      <div className="flex items-center justify-between bg-sl-surface border border-sl-border rounded px-3 py-2">
        <div>
          <p className="text-xs font-semibold text-sl-text">XP</p>
          <p className="text-xs text-sl-muted">GM awards · spend with GM approval</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onUpdate({ ...character, xp: Math.max(0, xp - 1) })}
            className="w-6 h-6 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-sm">−</button>
          <span className="text-lg font-bold text-sl-accent w-7 text-center">{xp}</span>
          <button onClick={() => onUpdate({ ...character, xp: xp + 1 })}
            className="w-6 h-6 rounded border border-sl-border text-sl-muted hover:border-sl-accent text-sm">+</button>
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs text-sl-muted mb-1.5 font-semibold">Stats</p>
        <div className="space-y-1.5">
          {STAT_KEYS.map(s => {
            const val        = character.stats[s]
            const ceiling    = archDef.ceilings[s]
            const sigMoments = character.significantMoments ?? []
            const sigOk      = sigMoments.includes(s)

            const isNormal = val < ceiling
            const isBeyond = !isNormal && val < 5
            const isUltra  = val >= 5
            const cost     = isNormal ? statAdvanceCost(val)
                           : isBeyond ? statBeyondCeilingCost(val)
                           : statAdvanceCost(val) * 3
            const needsSig = !isNormal || requiresSignificantMoment(s, val, character.optionalZero)
            const shadowBlocked = (isBeyond || isUltra)
              && !character.archetypeShadowComplete
              && (archDef.shadowGate === s || archDef.shadowGate === 'all')
            const canAdv   = !shadowBlocked && xp >= cost && (!needsSig || sigOk)

            const ceilLabel = isNormal ? `${val}/${ceiling}`
                            : isBeyond ? `${val}/${ceiling} ↑`
                            : `${val} ★`

            return (
              <div key={s} className="bg-sl-bg border border-sl-border rounded px-2.5 py-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold flex-1 ${character.markedStats.includes(s) ? 'text-sl-accent' : 'text-sl-text'}`}>
                    {STAT_NAMES[s]}
                    {character.markedStats.includes(s) && <span className="text-sl-harmony ml-1">●</span>}
                  </span>
                  <span className="text-xs text-sl-muted">{ceilLabel}</span>
                  <span className="text-xs text-sl-muted">
                    {`→ ${val+1} · ${cost} XP`}{isBeyond ? ' ×2' : isUltra ? ' ×3' : ''}
                  </span>
                  <button
                    onClick={() => onUpdate({ ...character, stats: { ...character.stats, [s]: Math.max(0, val - 1) } })}
                    disabled={val === 0}
                    className="text-xs w-5 h-5 rounded border border-sl-border text-sl-muted hover:border-sl-danger hover:text-sl-danger disabled:opacity-30 transition-colors flex items-center justify-center shrink-0">
                    −
                  </button>
                  <button disabled={!canAdv}
                    onClick={() => canAdv && onUpdate({
                      ...character,
                      stats: { ...character.stats, [s]: val + 1 },
                      xp: xp - cost,
                      significantMoments: sigMoments.filter(m => m !== s),
                      markedStats: character.markedStats.filter(m => m !== s),
                    })}
                    className={`text-xs px-2 py-0.5 rounded whitespace-nowrap transition-all
                      ${canAdv ? 'bg-sl-accent text-sl-accent-fg hover:opacity-90 active:scale-95'
                        : 'bg-sl-surface text-sl-muted border border-sl-border cursor-not-allowed opacity-60'}`}>
                    +1
                  </button>
                </div>
                {shadowBlocked && (
                  <p className="text-xs text-sl-muted/70 italic pl-0.5">{archDef.shadow}</p>
                )}
                {!shadowBlocked && needsSig && (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={sigOk}
                      onChange={() => onUpdate({ ...character, significantMoments: sigOk ? sigMoments.filter(m => m !== s) : [...sigMoments, s] })}
                      className="accent-[var(--sl-accent)] w-3 h-3" />
                    <span className="text-xs text-sl-muted">
                      {val === 0 && character.optionalZero === s
                        ? 'Particularly significant moment confirmed (GM)'
                        : isBeyond || isUltra
                          ? 'Significant moment required — exceeding ceiling'
                          : 'Significant moment confirmed (GM) — required for 4→5'}
                    </span>
                  </label>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Powers */}
      {(() => {
        const allUnlockable = [
          ...gemDef.developedPowers.filter(p => p.name !== character.developedPower),
          ...gemDef.advancedPowers,
        ]
        const owned = (name: string) => character.developedPower === name || (character.additionalPowers ?? []).includes(name)
        const ownedCount = 1 + (character.additionalPowers?.length ?? 0)
        const standard = allUnlockable.filter(p => !p.advanced)
        const advanced = allUnlockable.filter(p => p.advanced)
        function PowerRow({ power }: { power: typeof allUnlockable[0] }) {
          const isOwned = owned(power.name)
          const cost    = power.advanced ? powerAdvanceCost(ownedCount) * 2 : powerAdvanceCost(ownedCount)
          return (
            <div className="flex items-start gap-2 p-2 rounded border border-sl-border bg-sl-bg">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-sl-text">{power.name}</p>
                <p className="text-xs text-sl-muted leading-snug">{power.desc}</p>
              </div>
              {isOwned ? (
                <span className="shrink-0 text-xs text-sl-success pt-0.5">✓</span>
              ) : (
                <button disabled={xp < cost}
                  onClick={() => onUpdate({ ...character, xp: xp - cost, additionalPowers: [...(character.additionalPowers ?? []), power.name] })}
                  className={`shrink-0 text-xs px-2 py-0.5 rounded whitespace-nowrap transition-all
                    ${xp >= cost ? 'bg-sl-accent text-sl-accent-fg hover:opacity-90' : 'bg-sl-surface text-sl-muted border border-sl-border opacity-60 cursor-not-allowed'}`}>
                  {cost} XP
                </button>
              )}
            </div>
          )
        }
        return (
          <div className="space-y-3">
            {standard.length > 0 && (
              <div>
                <p className="text-xs text-sl-muted mb-1.5 font-semibold">Powers</p>
                <div className="space-y-1.5">{standard.map(p => <PowerRow key={p.name} power={p} />)}</div>
              </div>
            )}
            {advanced.length > 0 && (
              <div>
                <p className="text-xs text-sl-muted mb-1.5 font-semibold">Advanced Powers <span className="font-normal opacity-70">(×2 cost · story justification expected)</span></p>
                <div className="space-y-1.5">{advanced.map(p => <PowerRow key={p.name} power={p} />)}</div>
              </div>
            )}
          </div>
        )
      })()}

      {/* Cost reference */}
      <div className="border-t border-sl-border pt-2 text-xs text-sl-muted font-mono space-y-0.5">
        <p className="uppercase tracking-wide mb-1">Cost reference</p>
        <div className="flex gap-3"><span>0→1: 1</span><span>1→2: 1</span><span>2→3: 2</span><span>3→4: 2</span><span>4→5: 3 ★</span></div>
        <div className="flex gap-3 pt-0.5"><span className="text-sl-muted/80">↑ beyond ceiling: ×2 ★</span><span className="text-sl-muted/80">beyond 5: ×3 ★</span></div>
        <p className="text-sl-muted/70">★ significant moment required · Powers: 2, 3, 4… XP</p>
      </div>

      {character.markedStats.length > 0 && (
        <button onClick={() => onUpdate({ ...character, markedStats: [], markedBondIds: [] })}
          className="w-full text-xs text-sl-muted hover:text-sl-text border border-sl-border rounded py-1.5 transition-colors">
          Clear session marks
        </button>
      )}
    </div>
  )
}

function StoryTab({ character, onUpdate }: { character: Character; onUpdate: (c: Character) => void }) {
  const archDef = getArchetype(character.archetype)
  function updateField(key: string, value: string) {
    onUpdate({ ...character, backstory: { ...character.backstory, [key]: value } })
  }

  return (
    <div className="space-y-3 p-3">
      {BACKSTORY_QUESTIONS.map(q => (
        <div key={q.key}>
          <label className="block text-xs text-sl-muted mb-1">{q.label}</label>
          <textarea
            rows={3}
            value={character.backstory[q.key as keyof typeof character.backstory] ?? ''}
            onChange={e => updateField(q.key, e.target.value)}
            className="w-full bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
            placeholder="…"
          />
        </div>
      ))}
      {archDef.archetypeQuestions.map((q, i) => {
        const key = `archetypeQ${i+1}`
        return (
          <div key={key}>
            <label className="block text-xs text-sl-muted mb-1 italic">{archDef.label}: {q}</label>
            <textarea
              rows={3}
              value={character.backstory[key as keyof typeof character.backstory] ?? ''}
              onChange={e => updateField(key, e.target.value)}
              className="w-full bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
              placeholder="…"
            />
          </div>
        )
      })}
    </div>
  )
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'roll',    label: 'Roll' },
  { id: 'bonds',   label: 'Bonds' },
  { id: 'gem',     label: 'Gem' },
  { id: 'fusion',  label: 'Fusion' },
  { id: 'story',   label: 'Story' },
  { id: 'advance', label: 'Advance' },
]

export function CharacterSheet({ character, roomId, onUpdate, onRoll }: Props) {
  const [tab, setTab] = useState<Tab>('roll')

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      <StatBlock character={character} onUpdate={onUpdate} />

      {/* Tabs */}
      <div className="shrink-0 flex overflow-x-auto border-b border-sl-border mt-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-3 py-1.5 text-xs font-mono whitespace-nowrap transition-colors
              ${tab === t.id ? 'text-sl-accent border-b-2 border-sl-accent' : 'text-sl-muted hover:text-sl-text'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'roll'   && <RollPanel character={character} onRoll={onRoll} />}
        {tab === 'bonds'  && (
          <BondsPanel
            bonds={character.bonds}
            roomId={roomId}
            characterName={character.name}
            onChange={bonds => onUpdate({ ...character, bonds })}
          />
        )}
        {tab === 'gem'    && <GemTab character={character} onUpdate={onUpdate} />}
        {tab === 'fusion'  && <FusionPanel roomId={roomId} characterName={character.name} />}
        {tab === 'story'   && <StoryTab character={character} onUpdate={onUpdate} />}
        {tab === 'advance' && <AdvanceTab character={character} onUpdate={onUpdate} />}
      </div>
    </div>
  )
}
