import { useState, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import {
  ARCHETYPES, GEM_TYPES, GEM_TYPE_KEYS, STAT_KEYS, STAT_NAMES, STAT_DESCS, COURTS,
  BACKSTORY_QUESTIONS, WEAPON_TAG_LABELS, getGemTypesForArchetype,
} from '../../lib/character-defaults'
import { supabase } from '../../lib/supabase'
import type { NPC } from '../../lib/character-defaults'
import type { FusionSheet } from '../../types/fusion'
import type { Character, ArchetypeKey, GemType, StatKey, Bond, WeaponTag, Weapon } from '../../types/character'

const FUSIONS_META_KEY = 'sl_fusions'
const CUSTOM_VAL       = '__custom__'

interface Props {
  roomId: string
  onComplete: (char: Character) => void
}

const TOTAL_STEPS = 8

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? 'bg-sl-accent' : 'bg-sl-border'}`} />
      ))}
    </div>
  )
}

export function CharacterCreation({ roomId, onComplete }: Props) {
  const [step, setStep]               = useState(1)
  const [name, setName]               = useState('')
  const [pronouns, setPronouns]       = useState('')
  const [archetype, setArchetype]     = useState<ArchetypeKey | null>(null)
  const [gemType, setGemType]         = useState<GemType | null>(null)
  const [showAllGems, setShowAllGems] = useState(false)
  const [stats, setStats]             = useState<Record<StatKey, number>>({ form:0, clarity:0, resonance:0, radiance:0, resolve:0 })
  const [optZero, setOptZero]         = useState<StatKey | null>(null)
  const [optZeroSentence, setOptZeroSentence] = useState('')
  const [weaponIdx, setWeaponIdx]         = useState<number | null>(null)
  const [customWeaponName, setCustomWeaponName] = useState('')
  const [customWeaponTags, setCustomWeaponTags] = useState<WeaponTag[]>([])
  const [expandedGem, setExpandedGem]   = useState<GemType | null>(null)
  const [developedPower, setDevPower]   = useState<string | null>(null)
  const [signatureMove, setSigMove]   = useState('')
  const [bonds, setBonds]             = useState<Bond[]>([])
  const [newBondNameSel, setNewBondNameSel]     = useState('')
  const [newBondNameCustom, setNewBondNameCustom] = useState('')
  const [newBondNote, setNewBondNote] = useState('')
  const [newBondRating, setNewBondRating] = useState(1)
  const [backstory, setBackstory]     = useState<Record<string, string>>({})
  const [notes, setNotes]             = useState('')
  const [partyNames, setPartyNames]   = useState<string[]>([])
  const [npcNames, setNpcNames]       = useState<string[]>([])
  const [fusionNames, setFusionNames] = useState<string[]>([])

  useEffect(() => {
    OBR.onReady(async () => {
      const players = await OBR.party.getPlayers()
      setPartyNames(players.map(p => (p.metadata?.['sl'] as { name?: string } | undefined)?.name || p.name))
    })
  }, [])

  useEffect(() => {
    if (!roomId) return
    supabase.from('npcs').select('npc_data').eq('room_id', roomId).maybeSingle()
      .then(({ data }) => setNpcNames(((data?.npc_data as NPC[]) ?? []).map(n => n.name).filter(Boolean)))
    OBR.onReady(async () => {
      const meta = await OBR.room.getMetadata()
      setFusionNames(((meta[FUSIONS_META_KEY] as FusionSheet[]) ?? []).map(f => f.name))
    })
  }, [roomId])

  const archDef = archetype ? ARCHETYPES[archetype] : null
  const gemDef  = gemType   ? GEM_TYPES[gemType]   : null

  const totalPoints = optZero ? 6 : 5
  const usedPoints  = Object.values(stats).reduce((a, b) => a + b, 0)
  const remaining   = totalPoints - usedPoints
  const maxStat     = (stat: StatKey) => archDef ? archDef.ceilings[stat] : 4

  function adjustStat(stat: StatKey, delta: number) {
    const next = stats[stat] + delta
    if (next < 0 || next > maxStat(stat)) return
    if (delta > 0 && remaining <= 0) return
    if (stat === optZero) return
    setStats({ ...stats, [stat]: next })
  }

  const newBondName = newBondNameSel === CUSTOM_VAL ? newBondNameCustom : newBondNameSel

  function addBond() {
    if (!newBondName.trim() || bonds.length >= 5) return
    setBonds([...bonds, {
      id: crypto.randomUUID(),
      targetName: newBondName.trim(),
      rating: newBondRating,
      note: newBondNote.trim(),
    }])
    setNewBondNameSel(''); setNewBondNameCustom(''); setNewBondNote(''); setNewBondRating(1)
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return archetype !== null
      case 2: return gemType !== null
      case 3: return remaining === 0 && (!optZero || optZeroSentence.trim().length > 0)
      case 4: return weaponIdx !== null && (weaponIdx !== -1 || customWeaponName.trim().length > 0)
      case 5: return developedPower !== null
      case 6: return signatureMove.trim().length > 0
      case 7: return true
      case 8: return true
      default: return false
    }
  }

  function finish() {
    if (!archetype || !gemType || !gemDef || !archDef) return
    const weapon: Weapon = weaponIdx === -1
      ? { name: customWeaponName.trim(), tags: customWeaponTags }
      : {
          name:   gemDef.weapons[weaponIdx!].name,
          tags:   gemDef.weapons[weaponIdx!].tags as WeaponTag[],
          toHit:  gemDef.weapons[weaponIdx!].toHit,
          damage: gemDef.weapons[weaponIdx!].damage,
        }
    const char: Character = {
      id:         crypto.randomUUID(),
      name:       name.trim() || gemDef.label,
      pronouns:   pronouns.trim(),
      archetype,
      gemType,
      stats:      { ...stats, ...(optZero ? { [optZero]: 0 } : {}) },
      formDamage: 0,
      bonds,
      weapon,
      corePower:  gemDef.corePower.name,
      developedPower: developedPower!,
      signatureMove: signatureMove.trim(),
      optionalZero: optZero ?? undefined,
      optionalZeroSentence: optZero ? optZeroSentence.trim() : undefined,
      archetypeShadowComplete: false,
      markedStats: [],
      markedBondIds: [],
      xp: 0,
      significantMoments: [],
      backstory: {
        madeFor:         backstory.madeFor ?? '',
        rebellionBelief: backstory.rebellionBelief ?? '',
        importantGem:    backstory.importantGem ?? '',
        formTells:       backstory.formTells ?? '',
        wouldLeave:      backstory.wouldLeave ?? '',
        wants:           backstory.wants ?? '',
        bravest:         backstory.bravest ?? '',
        archetypeQ1:     backstory.archetypeQ1 ?? '',
        archetypeQ2:     backstory.archetypeQ2 ?? '',
        archetypeQ3:     backstory.archetypeQ3 ?? '',
      },
      notes,
    }
    onComplete(char)
  }

  const inputCls = 'w-full bg-sl-bg border border-sl-border rounded px-3 py-2 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent'
  const cardCls  = (selected: boolean) => `border rounded p-3 cursor-pointer transition-all text-left w-full ${selected ? 'border-sl-accent bg-sl-accent/10' : 'border-sl-border bg-sl-surface hover:border-sl-accent/50'}`

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <StepBar step={step} />

        {/* Step 1 — Archetype */}
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 1 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Archetype</h2>
              <p className="text-xs text-sl-muted mt-1">The Diamond whose logic shaped you — even in rebellion.</p>
            </div>
            {(Object.keys(ARCHETYPES) as ArchetypeKey[]).map(key => {
              const a = ARCHETYPES[key]
              return (
                <button key={key} onClick={() => setArchetype(key)} className={cardCls(archetype === key)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sl-text">{a.label}</span>
                    <span className="text-xs text-sl-muted">— {a.diamond}</span>
                  </div>
                  <p className="text-xs text-sl-muted italic mb-1">{a.tagline}</p>
                  <p className="text-xs text-sl-muted">{a.startingMove}: {a.startingMoveDesc.slice(0, 80)}…</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {STAT_KEYS.map(s => (
                      <span key={s} className={`text-xs px-1 rounded ${archetype === key ? 'bg-sl-accent/20 text-sl-accent' : 'bg-sl-bg text-sl-muted'}`}>
                        {STAT_NAMES[s].slice(0,3)} {a.ceilings[s]}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2 — Gem Type */}
        {step === 2 && archDef && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 2 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Gem Type</h2>
              <p className="text-xs text-sl-muted mt-1">Recommended for {archDef.label} are highlighted. Tap a gem to select; use ▼ to preview its powers and weapons.</p>
            </div>
            <button onClick={() => setShowAllGems(!showAllGems)} className="text-xs text-sl-accent hover:opacity-80">
              {showAllGems ? 'Show recommended only' : 'Show all gem types'}
            </button>
            {(() => {
              const recommended = getGemTypesForArchetype(archetype!)
              const display = showAllGems ? GEM_TYPE_KEYS : recommended
              const grouped: Partial<Record<string, GemType[]>> = {}
              display.forEach(k => {
                const court = GEM_TYPES[k].court
                if (!grouped[court]) grouped[court] = []
                grouped[court]!.push(k)
              })
              return Object.entries(grouped).map(([court, keys]) => (
                <div key={court}>
                  <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1.5">{COURTS[court as keyof typeof COURTS]}</p>
                  <div className="space-y-1.5">
                    {keys!.map(key => {
                      const g = GEM_TYPES[key]
                      const isRec = recommended.includes(key)
                      const isOpen = expandedGem === key
                      const isSelected = gemType === key
                      return (
                        <div key={key} className={`border rounded transition-all ${isSelected ? 'border-sl-accent bg-sl-accent/10' : 'border-sl-border bg-sl-surface'}`}>
                          {/* Header row */}
                          <div className="flex items-center gap-2 p-3">
                            <button onClick={() => setGemType(key)} className="flex-1 text-left min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sl-text text-sm">{g.label}</span>
                                {isRec && <span className="text-xs text-sl-accent bg-sl-accent/10 border border-sl-accent/20 rounded px-1">recommended</span>}
                              </div>
                              <p className="text-xs text-sl-muted mt-0.5">{g.corePower.name} · {g.weapons[0].name}{g.weapons.length > 1 ? ` +${g.weapons.length - 1}` : ''}</p>
                            </button>
                            <button
                              onClick={() => setExpandedGem(isOpen ? null : key)}
                              className="shrink-0 w-6 h-6 flex items-center justify-center text-sl-muted hover:text-sl-text text-xs"
                              aria-label={isOpen ? 'Collapse' : 'Expand'}
                            >
                              {isOpen ? '▲' : '▼'}
                            </button>
                          </div>

                          {/* Expanded details */}
                          {isOpen && (
                            <div className="px-3 pb-3 pt-0 border-t border-sl-border space-y-3">
                              {/* Core power */}
                              <div className="pt-2">
                                <p className="text-xs text-sl-muted font-mono uppercase mb-0.5">Core Power</p>
                                <p className="text-xs font-semibold text-sl-text">{g.corePower.name}</p>
                                <p className="text-xs text-sl-muted">{g.corePower.desc}</p>
                              </div>
                              {/* Developed powers */}
                              <div>
                                <p className="text-xs text-sl-muted font-mono uppercase mb-0.5">Developed Powers (choose one later)</p>
                                <div className="space-y-1.5">
                                  {g.developedPowers.map(p => (
                                    <div key={p.name} className="bg-sl-bg rounded p-2">
                                      <p className="text-xs font-semibold text-sl-text">{p.name}</p>
                                      <p className="text-xs text-sl-muted">{p.desc}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Weapons */}
                              <div>
                                <p className="text-xs text-sl-muted font-mono uppercase mb-0.5">Weapons</p>
                                <div className="space-y-1">
                                  {g.weapons.map((w, i) => (
                                    <div key={i} className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs text-sl-text font-medium">{w.name}</span>
                                      <div className="flex gap-1 flex-wrap">
                                        {w.tags.map(tag => (
                                          <span key={tag} className="text-xs bg-sl-indigo/20 text-sl-text border border-sl-indigo/30 rounded px-1">{WEAPON_TAG_LABELS[tag]}</span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button onClick={() => setGemType(key)} className={`w-full py-1.5 rounded text-xs font-semibold transition-colors ${isSelected ? 'bg-sl-accent/20 text-sl-accent border border-sl-accent' : 'bg-sl-accent text-sl-accent-fg hover:opacity-90'}`}>
                                {isSelected ? '✓ Selected' : `Select ${g.label}`}
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            })()}
          </div>
        )}

        {/* Step 3 — Stats */}
        {step === 3 && archDef && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 3 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Assign Stats</h2>
              <p className="text-xs text-sl-muted mt-1">Distribute {totalPoints} points within your archetype's ceilings. No stat above 4 at creation.</p>
            </div>
            <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-sl-text font-semibold">The Optional Zero</p>
                {optZero && <button onClick={() => { setOptZero(null); setOptZeroSentence(''); setStats({ ...stats, [optZero]: 0 }) }} className="text-xs text-sl-muted hover:text-sl-danger">Remove</button>}
              </div>
              <p className="text-xs text-sl-muted">Set one stat to 0 and lock it — gain +1 bonus point. Write one sentence explaining why.</p>
              {!optZero ? (
                <div className="flex gap-1 flex-wrap">
                  {STAT_KEYS.map(s => (
                    <button key={s} onClick={() => { setOptZero(s); setStats({ ...stats, [s]: 0 }) }}
                      className="text-xs px-2 py-1 rounded border border-sl-border text-sl-muted hover:border-sl-accent hover:text-sl-text">
                      {STAT_NAMES[s]}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-sl-accent">{STAT_NAMES[optZero]} set to 0 (+1 bonus point)</p>
                  <textarea rows={2} value={optZeroSentence} onChange={e => setOptZeroSentence(e.target.value)}
                    className="w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
                    placeholder="She was told that caring about others was a Pearl's weakness, and she believed it." />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-sl-text">Points remaining: <span className={remaining === 0 ? 'text-sl-success font-bold' : 'text-sl-accent font-bold'}>{remaining}</span></p>
            </div>
            <div className="space-y-2">
              {STAT_KEYS.map(stat => {
                const val = stats[stat]
                const ceil = maxStat(stat)
                const isZeroed = stat === optZero
                return (
                  <div key={stat} className={`flex items-center gap-3 bg-sl-surface border rounded p-2.5 ${isZeroed ? 'border-sl-danger/40 opacity-60' : 'border-sl-border'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-sl-text w-20">{STAT_NAMES[stat]}</span>
                        <span className="text-xs text-sl-muted">max {ceil}</span>
                        {isZeroed && <span className="text-xs text-sl-danger">locked at 0</span>}
                      </div>
                      <p className="text-xs text-sl-muted mt-0.5">{STAT_DESCS[stat]}</p>
                    </div>
                    {!isZeroed && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => adjustStat(stat, -1)} disabled={val <= 0}
                          className="w-6 h-6 rounded border border-sl-border text-sl-muted hover:border-sl-accent disabled:opacity-30 text-sm">−</button>
                        <span className="w-5 text-center font-bold text-sl-text">{val}</span>
                        <button onClick={() => adjustStat(stat, +1)} disabled={val >= ceil || remaining <= 0}
                          className="w-6 h-6 rounded border border-sl-border text-sl-muted hover:border-sl-accent disabled:opacity-30 text-sm">+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Weapon */}
        {step === 4 && gemDef && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 4 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Weapon</h2>
              <p className="text-xs text-sl-muted mt-1">Every gem summons a weapon from their gem. Your listed weapon is the one that feels like yours.</p>
            </div>
            {gemDef.weapons.map((w, i) => (
              <button key={i} onClick={() => setWeaponIdx(i)} className={cardCls(weaponIdx === i)}>
                <p className="font-medium text-sl-text">{w.name}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {w.tags.map(tag => (
                    <span key={tag} className="text-xs bg-sl-indigo/20 text-sl-text border border-sl-indigo/30 rounded px-1.5 py-0.5">{WEAPON_TAG_LABELS[tag]}</span>
                  ))}
                </div>
              </button>
            ))}

            {/* Custom weapon */}
            <div className={`border rounded p-3 transition-all ${weaponIdx === -1 ? 'border-sl-accent bg-sl-accent/10' : 'border-sl-border bg-sl-surface'}`}>
              <button onClick={() => setWeaponIdx(-1)} className="w-full text-left">
                <p className="font-medium text-sl-text text-sm">Custom weapon</p>
                <p className="text-xs text-sl-muted">Name your own and pick its tags</p>
              </button>
              {weaponIdx === -1 && (
                <div className="mt-3 space-y-2">
                  <input
                    className={inputCls}
                    value={customWeaponName}
                    onChange={e => setCustomWeaponName(e.target.value)}
                    placeholder="Weapon name…"
                  />
                  <div>
                    <p className="text-xs text-sl-muted mb-1.5">Tags (choose any that apply)</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(Object.keys(WEAPON_TAG_LABELS) as WeaponTag[]).map(tag => {
                        const active = customWeaponTags.includes(tag)
                        return (
                          <button
                            key={tag}
                            onClick={() => setCustomWeaponTags(active
                              ? customWeaponTags.filter(t => t !== tag)
                              : [...customWeaponTags, tag]
                            )}
                            className={`text-xs rounded px-2 py-1 border transition-colors ${active ? 'bg-sl-indigo/40 border-sl-accent text-sl-text' : 'bg-sl-bg border-sl-border text-sl-muted hover:border-sl-accent'}`}
                          >
                            {WEAPON_TAG_LABELS[tag]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5 — Developed Power */}
        {step === 5 && gemDef && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 5 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Powers</h2>
              <p className="text-xs text-sl-muted mt-1">Your core power is automatic. Choose one developed power.</p>
            </div>
            <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1">
              <p className="text-xs text-sl-muted font-mono uppercase">Core Power — always</p>
              <p className="font-semibold text-sl-text">{gemDef.corePower.name}</p>
              <p className="text-xs text-sl-muted">{gemDef.corePower.desc}</p>
            </div>
            <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Choose one developed power</p>
            {gemDef.developedPowers.map(p => (
              <button key={p.name} onClick={() => setDevPower(p.name)} className={cardCls(developedPower === p.name)}>
                <p className="font-medium text-sl-text">{p.name}</p>
                <p className="text-xs text-sl-muted mt-0.5">{p.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 6 — Signature Move */}
        {step === 6 && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 6 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Signature Move</h2>
              <p className="text-xs text-sl-muted mt-1">The one thing that is mechanically, specifically, irreducibly you. Not your gem type — this gem, as you've written them.</p>
            </div>
            <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-1.5">
              <p className="text-xs text-sl-muted font-mono uppercase">Template</p>
              <p className="text-xs text-sl-muted italic">When [specific circumstance], I can [effect]. [Optional cost or condition].</p>
            </div>
            <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
              <p className="text-xs text-sl-muted font-mono uppercase">Examples</p>
              <div className="space-y-1.5 text-xs text-sl-muted italic">
                <p>"When I step between someone and the thing coming for them, I take the hit without rolling."</p>
                <p>"When I've been dismissed in this scene, my next roll gets bonus dice equal to how many times."</p>
                <p>"When I tell the truth about something I've been hiding, every gem who hears it gets a bonus die."</p>
                <p>"When everything has failed and I'm the last one standing, I don't poof."</p>
                <p>"When I fuse with another gem, the fusion begins with one additional Harmony box, to a maximum of 5."</p>
              </div>
            </div>
            <div>
              <label className="block text-xs text-sl-muted mb-1">Your signature move</label>
              <textarea rows={4} value={signatureMove} onChange={e => setSigMove(e.target.value)}
                className="w-full bg-sl-bg border border-sl-border rounded px-3 py-2 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
                placeholder="When I…" />
            </div>
          </div>
        )}

        {/* Step 7 — Starting Bonds */}
        {step === 7 && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 7 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Starting Bonds</h2>
              <p className="text-xs text-sl-muted mt-1">One Bond may start at 3 (requires a shared history). All others start at 1 or 2. Skip this step if you're playing a solo session zero.</p>
            </div>
            <div className="space-y-2">
              {bonds.map(b => (
                <div key={b.id} className="bg-sl-surface border border-sl-border rounded p-2 flex items-center justify-between gap-2">
                  <div><p className="text-sm font-medium text-sl-text">{b.targetName}</p><p className="text-xs text-sl-muted">Bond {b.rating} · {b.note || 'no note'}</p></div>
                  <button onClick={() => setBonds(bonds.filter(x => x.id !== b.id))} className="text-xs text-sl-muted hover:text-sl-danger">✕</button>
                </div>
              ))}
            </div>
            <div className="border border-dashed border-sl-border rounded p-3 space-y-2">
              <p className="text-xs text-sl-muted">Add a starting Bond</p>
              {(() => {
                type G = 'Players' | 'NPCs' | 'Fusions'
                const opts: Array<{ value: string; group: G }> = [
                  ...partyNames.map(v => ({ value: v, group: 'Players' as G })),
                  ...npcNames.map(v => ({ value: v, group: 'NPCs' as G })),
                  ...fusionNames.map(v => ({ value: v, group: 'Fusions' as G })),
                ]
                const grouped: Partial<Record<G, typeof opts>> = {}
                for (const o of opts) { if (!grouped[o.group]) grouped[o.group] = []; grouped[o.group]!.push(o) }
                return (
                  <>
                    <select className={inputCls} value={newBondNameSel} onChange={e => setNewBondNameSel(e.target.value)}>
                      <option value="">— Select —</option>
                      {(['Players','NPCs','Fusions'] as G[]).map(g => grouped[g]?.length ? (
                        <optgroup key={g} label={g}>
                          {grouped[g]!.map(o => <option key={o.value} value={o.value}>{o.value}</option>)}
                        </optgroup>
                      ) : null)}
                      <option value={CUSTOM_VAL}>Custom…</option>
                    </select>
                    {newBondNameSel === CUSTOM_VAL && (
                      <input className={inputCls} value={newBondNameCustom} onChange={e => setNewBondNameCustom(e.target.value)} placeholder="Gem's name" onKeyDown={e => e.key === 'Enter' && addBond()} />
                    )}
                  </>
                )
              })()}
              <div className="flex items-center gap-2">
                <label className="text-xs text-sl-muted">Rating:</label>
                {[1,2,3].map(n => (
                  <button key={n} onClick={() => setNewBondRating(n)}
                    className={`px-2 py-1 rounded border text-xs transition-colors ${newBondRating === n ? 'border-sl-bond bg-sl-bond/20 text-sl-text' : 'border-sl-border text-sl-muted hover:border-sl-bond'}`}>
                    {n}
                  </button>
                ))}
              </div>
              <textarea rows={2} value={newBondNote} onChange={e => setNewBondNote(e.target.value)}
                className="w-full bg-sl-bg border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
                placeholder="One sentence about this relationship (required for Bond 3)…" />
              <button onClick={addBond} disabled={!newBondName.trim() || bonds.length >= 5 || (newBondRating === 3 && !newBondNote.trim())}
                className="w-full py-1.5 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold disabled:opacity-40 hover:opacity-90">
                Add Bond
              </button>
            </div>
          </div>
        )}

        {/* Step 8 — Backstory (+ optional name/pronouns) */}
        {step === 8 && archDef && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide mb-1">Step 8 of {TOTAL_STEPS}</p>
              <h2 className="text-lg font-bold text-sl-text">Backstory</h2>
              <p className="text-xs text-sl-muted mt-1">Answer these before your first session. Write as much or as little as feels true.</p>
            </div>

            {/* Optional name + pronouns */}
            <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
              <p className="text-xs text-sl-muted font-mono uppercase tracking-wide">Identity (optional)</p>
              <div>
                <label className="block text-xs text-sl-muted mb-1">Name <span className="opacity-60">— leave blank to use gem type</span></label>
                <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder={gemDef?.label ?? 'Your gem name'} />
              </div>
              <div>
                <label className="block text-xs text-sl-muted mb-1">Pronouns</label>
                <input className={inputCls} value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="she/her, they/them…" />
              </div>
            </div>

            {BACKSTORY_QUESTIONS.map(q => (
              <div key={q.key}>
                <label className="block text-xs text-sl-muted mb-1">{q.label}</label>
                <textarea rows={2} value={backstory[q.key] ?? ''} onChange={e => setBackstory({ ...backstory, [q.key]: e.target.value })}
                  className="w-full bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
                  placeholder="…" />
              </div>
            ))}
            {archDef.archetypeQuestions.map((q, i) => (
              <div key={i}>
                <label className="block text-xs text-sl-muted mb-1 italic">{archDef.label}: {q}</label>
                <textarea rows={2} value={backstory[`archetypeQ${i+1}`] ?? ''} onChange={e => setBackstory({ ...backstory, [`archetypeQ${i+1}`]: e.target.value })}
                  className="w-full bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
                  placeholder="…" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-sl-muted mb-1">Notes</label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full bg-sl-surface border border-sl-border rounded px-2 py-1.5 text-xs text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent resize-none"
                placeholder="Any other notes…" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="shrink-0 px-4 py-3 border-t border-sl-border flex gap-2">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 rounded border border-sl-border text-sl-muted text-sm hover:border-sl-accent">
            ← Back
          </button>
        )}
        <div className="flex-1" />
        {step < TOTAL_STEPS ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}
            className="px-5 py-2 rounded bg-sl-accent text-sl-accent-fg text-sm font-semibold disabled:opacity-40 hover:opacity-90">
            Next →
          </button>
        ) : (
          <button onClick={finish}
            className="px-5 py-2 rounded bg-sl-accent text-sl-accent-fg text-sm font-bold hover:opacity-90">
            Create Gem
          </button>
        )}
      </div>
    </div>
  )
}
