export type MessageType = 'chat' | 'roll_pool' | 'roll_manual' | 'system' | 'move'
export type RollOutcome = 'success' | 'partial' | 'miss'

export interface ChatMessage {
  id: string
  type: MessageType
  playerId: string
  playerName: string
  accentColor?: string
  timestamp: number
  // chat
  text?: string
  // roll fields
  rollLabel?: string    // e.g. "Form", "Resolve + Lapis Bond"
  dice?: number[]       // all dice rolled
  highest?: number      // single highest die
  outcome?: RollOutcome // success / partial / miss
  isResonance?: boolean // two or more 6s
  collateral?: number   // second highest die (optional texture)
  // manual roll
  formula?: string
  total?: number
  breakdown?: string
  // move announcement
  moveName?: string
  moveDesc?: string
}
