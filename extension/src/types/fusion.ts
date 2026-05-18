export interface FusionStats {
  stat1Name: string
  stat1Value: number   // 0–5
  stat2Name: string
  stat2Value: number
  stat3Name: string
  stat3Value: number
}

export interface FusionBaseStats {
  form: number
  clarity: number
  resonance: number
  radiance: number
  resolve: number
}

export interface FusionSheet {
  id: string
  name: string
  constituent1: string   // gem character name
  constituent2: string
  appearance: string
  baseGemCount: number          // 2 for standard, 3+ for meta-fusions
  baseStats: FusionBaseStats    // standard stats: round(avg of constituent stats + baseGemCount)
  stats: FusionStats            // up to 3 custom fusion-specific stats
  harmony: number        // 0–5 (current)
  signatureMove1: string // physical
  signatureMove2: string // relational
  relationshipNote: string
  notes: string
  xp: number             // fusion's own XP track (earned while fused only)
  significantMoments?: number[]  // stat indices (1,2,3) where sig. moment confirmed
  createdAt: number
}
