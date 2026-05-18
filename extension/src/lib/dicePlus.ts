import OBR from '@owlbear-rodeo/sdk'

const SOURCE = 'shattered-light.extension'

type DicePlusState = 'untested' | 'ready' | 'unavailable'
let state: DicePlusState = 'untested'

export function getDicePlusState(): DicePlusState { return state }

/** Call once when the panel mounts. Sends a ready ping to Dice+ after 2 s. */
export function initDicePlus(): void {
  setTimeout(() => {
    OBR.broadcast.sendMessage(
      'dice-plus/isReady',
      { requestId: crypto.randomUUID() },
      { destination: 'ALL' },
    ).catch(() => {})
  }, 2000)
}

interface DicePlusResultData {
  rollId?: string
  groups?: Array<{ dice: Array<{ value: number; kept?: boolean }> }>
  total?: number
}

function extractValues(event: { data: unknown }): { rollId: string; values: number[] } | null {
  const raw = event.data as { rollId?: string; result?: DicePlusResultData } & DicePlusResultData
  // Dice+ sends either { rollId, groups } or { result: { rollId, groups } }
  const data: DicePlusResultData = (raw?.result ?? raw) as DicePlusResultData
  if (!data?.rollId) return null
  const values = data.groups
    ?.flatMap(g => g.dice.map(d => d.value))
    .filter((v): v is number => typeof v === 'number')
  return values?.length ? { rollId: data.rollId, values } : null
}

/**
 * Request a pool of d6s from Dice+. Returns die values on success, null on
 * timeout or if Dice+ is unavailable (caller should fall back to local dice).
 */
export async function rollViaDicePlus(
  count: number,
  playerId: string,
  playerName: string,
): Promise<number[] | null> {
  if (state === 'unavailable') return null

  const timeout = state === 'ready' ? 8_000 : 5_000
  const rollId  = `roll_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

  return new Promise(resolve => {
    let done = false
    const unsubs: Array<() => void> = []

    function finish(values: number[] | null) {
      if (done) return
      done = true
      clearTimeout(timer)
      unsubs.forEach(u => u())
      state = values !== null ? 'ready' : (state === 'untested' ? 'unavailable' : state)
      resolve(values)
    }

    function onResult(event: { data: unknown }) {
      const parsed = extractValues(event)
      if (parsed?.rollId === rollId) finish(parsed.values)
    }

    const timer = setTimeout(() => finish(null), timeout)

    // Dice+ broadcasts to the global channel and to a player-specific channel
    unsubs.push(OBR.broadcast.onMessage('dice-plus/roll-result', onResult))
    unsubs.push(OBR.broadcast.onMessage(`${playerId}/roll-result`, onResult))

    OBR.broadcast.sendMessage(
      'dice-plus/roll-request',
      {
        rollId,
        playerId,
        playerName,
        rollTarget:   'everyone',
        diceNotation: `${count}d6`,
        showResults:  false,
        timestamp:    Date.now(),
        source:       SOURCE,
      },
      { destination: 'ALL' },
    ).catch(() => finish(null))
  })
}
