export type StatKey = 'form' | 'clarity' | 'resonance' | 'radiance' | 'resolve'
export type ArchetypeKey = 'leader' | 'soldier' | 'scholar' | 'diplomat' | 'rebel'
export type GemType =
  | 'diamond' | 'goshenite' | 'howlite' | 'spinel' | 'moonstone' | 'selenite'
  | 'topaz' | 'jasper' | 'ruby' | 'amethyst' | 'bismuth' | 'agate' | 'onyx' | 'hessonite'
  | 'sapphire' | 'lapis' | 'aquamarine' | 'zircon' | 'labradorite' | 'iolite' | 'nephrite'
  | 'roseQuartz' | 'emerald' | 'morganite' | 'kunzite' | 'tourmaline' | 'turquoise'
  | 'pearl' | 'peridot' | 'jade' | 'citrine'
export type WeaponTag = 'reach' | 'concealed' | 'binding' | 'area' | 'piercing' | 'paired' | 'heavy' | 'finesse'

export interface Stats {
  form: number       // 0–5
  clarity: number    // 0–5
  resonance: number  // 0–5
  radiance: number   // 0–5
  resolve: number    // 0–5
}

export interface Bond {
  id: string
  targetName: string
  rating: number    // 0–5
  note: string      // one-sentence relationship description
}

export interface Weapon {
  name: string
  tags: WeaponTag[]
}

export interface Character {
  id: string
  name: string
  pronouns: string
  archetype: ArchetypeKey
  gemType: GemType
  stats: Stats
  formDamage: number          // current temporary Form reduction (heals over time)
  bonds: Bond[]
  weapon: Weapon
  corePower: string           // auto-assigned from gem type
  developedPower: string      // chosen from gem type options
  signatureMove: string
  optionalZero?: StatKey      // stat set to 0 for +1 bonus point
  optionalZeroSentence?: string
  archetypeShadowComplete: boolean
  markedStats: StatKey[]      // marked for potential advance this session
  markedBondIds: string[]     // bond IDs marked this session
  backstory: {
    madeFor: string
    rebellionBelief: string
    importantGem: string
    formTells: string
    wouldLeave: string
    wants: string
    bravest: string
    archetypeQ1: string
    archetypeQ2: string
    archetypeQ3?: string   // Rebel only: the open question
  }
  notes: string
  additionalPowers?: string[]   // powers unlocked through advancement
  portrait?: string
}

// Snapshot synced to OBR player metadata
export interface CharacterSnapshot {
  name: string
  archetype: ArchetypeKey
  gemType: GemType
  stats: Stats
  formDamage: number
  bonds: Array<{ targetName: string; rating: number }>
  pronouns?: string
}
