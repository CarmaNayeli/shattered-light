export interface FusionStats {
  stat1Name: string
  stat1Value: number   // 0–5
  stat2Name: string
  stat2Value: number
  stat3Name: string
  stat3Value: number
}

export interface FusionSheet {
  id: string
  name: string
  constituent1: string   // gem character name
  constituent2: string
  appearance: string
  stats: FusionStats
  harmony: number        // 0–5 (current)
  signatureMove1: string // physical
  signatureMove2: string // relational
  relationshipNote: string
  createdAt: number
}
