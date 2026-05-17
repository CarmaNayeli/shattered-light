import { useState } from 'react'
import { RollPanel } from './RollPanel'
import { BondsPanel } from './BondsPanel'
import { FusionPanel } from './FusionPanel'
import { STAT_KEYS, STAT_NAMES, getArchetype, getGemType, WEAPON_TAG_LABELS, BACKSTORY_QUESTIONS } from '../../lib/character-defaults'
import type { Character } from '../../types/character'
import type { ChatMessage } from '../../types/chat'

type Tab = 'roll' | 'bonds' | 'gem' | 'fusion' | 'story'

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

      {/* Developed power */}
      <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
        <p className="text-xs text-sl-muted font-mono uppercase">Developed Power</p>
        {(() => {
          const dev = gemDef.developedPowers.find(p => p.name === character.developedPower)
          return dev ? (
            <>
              <p className="font-semibold text-sl-text">{dev.name}</p>
              <p className="text-xs text-sl-muted">{dev.desc}</p>
            </>
          ) : <p className="text-xs text-sl-muted">{character.developedPower || 'None chosen'}</p>
        })()}
      </div>

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
  { id: 'roll',   label: 'Roll' },
  { id: 'bonds',  label: 'Bonds' },
  { id: 'gem',    label: 'Gem' },
  { id: 'fusion', label: 'Fusion' },
  { id: 'story',  label: 'Story' },
]

export function CharacterSheet({ character, roomId, onUpdate, onRoll }: Props) {
  const [tab, setTab] = useState<Tab>('roll')

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      <StatBlock character={character} onUpdate={onUpdate} />

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-sl-border mt-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 text-xs font-mono transition-colors
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
        {tab === 'fusion' && <FusionPanel roomId={roomId} characterName={character.name} />}
        {tab === 'story'  && <StoryTab character={character} onUpdate={onUpdate} />}
      </div>
    </div>
  )
}
