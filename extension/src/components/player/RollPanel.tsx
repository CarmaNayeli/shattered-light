import { useState, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { rollPool, highest, secondHighest, getOutcome, outcomeLabel, isResonance, countSixes, collateralResult, collateralLabel } from '../../lib/dice'
import { initDicePlus, getDicePlusState, rollViaDicePlus } from '../../lib/dicePlus'
import { STAT_KEYS, STAT_NAMES } from '../../lib/character-defaults'
import type { Character, StatKey } from '../../types/character'
import type { ChatMessage } from '../../types/chat'

interface Props {
  character: Character
  onRoll: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'playerId' | 'playerName'>) => void
}

type Modifier = 'normal' | 'advantage' | 'disadvantage'

export function RollPanel({ character, onRoll }: Props) {
  const [activeStat, setActiveStat]     = useState<StatKey | null>(null)
  const [activeBond, setActiveBond]     = useState<string | null>(null)
  const [modifier, setModifier]         = useState<Modifier>('normal')
  const [diamondPressure, setDiamond]   = useState(false)
  const [lastRoll, setLastRoll]         = useState<{
    dice: number[]; droppedDie?: number; stat: StatKey; bondName?: string
  } | null>(null)
  const [diceState, setDiceState] = useState(() => getDicePlusState())
  const [rolling, setRolling]     = useState(false)

  useEffect(() => { initDicePlus() }, [])

  const { stats, bonds, formDamage } = character

  function effectiveStat(stat: StatKey): number {
    if (stat === 'form') return Math.max(0, stats.form - formDamage)
    return stats[stat]
  }

  function bondDice(): number {
    if (diamondPressure && activeStat === 'resolve') {
      return bonds.reduce((sum, b) => sum + Math.min(4, b.rating), 0)
    }
    if (!activeBond) return 0
    const bond = bonds.find(b => b.id === activeBond)
    if (!bond) return 0
    return Math.min(4, bond.rating)
  }

  function poolSize(): number {
    if (!activeStat) return 0
    return effectiveStat(activeStat) + bondDice()
  }

  async function handleRoll() {
    if (!activeStat || poolSize() === 0 || rolling) return
    setRolling(true)

    const totalPool = modifier !== 'normal' ? poolSize() + 1 : poolSize()
    let rawDice: number[]

    if (getDicePlusState() !== 'unavailable') {
      try {
        const [pid, pname] = await Promise.all([OBR.player.getId(), OBR.player.getName()])
        rawDice = (await rollViaDicePlus(totalPool, pid, pname)) ?? rollPool(totalPool)
      } catch {
        rawDice = rollPool(totalPool)
      }
    } else {
      rawDice = rollPool(totalPool)
    }

    setDiceState(getDicePlusState())
    setRolling(false)

    let rolled = rawDice
    let droppedDie: number | undefined

    if (modifier === 'disadvantage') {
      const maxVal = Math.max(...rolled)
      const dropIdx = rolled.indexOf(maxVal)
      droppedDie = maxVal
      rolled = [...rolled.slice(0, dropIdx), ...rolled.slice(dropIdx + 1)]
    } else if (modifier === 'advantage') {
      const minVal = Math.min(...rolled)
      const dropIdx = rolled.indexOf(minVal)
      droppedDie = minVal
      rolled = [...rolled.slice(0, dropIdx), ...rolled.slice(dropIdx + 1)]
    }

    const high   = highest(rolled)
    const second = secondHighest(rolled)
    const outcome = getOutcome(high)
    const res = isResonance(rolled)
    const bond = (!diamondPressure || activeStat !== 'resolve') && activeBond
      ? bonds.find(b => b.id === activeBond)
      : null

    const modSuffix = modifier === 'advantage' ? ' (adv)' : modifier === 'disadvantage' ? ' (dis)' : ''
    const pressureSuffix = diamondPressure && activeStat === 'resolve' ? ' [Diamond pressure]' : ''
    const bondLabel = bond ? ` + ${bond.targetName}` : diamondPressure && activeStat === 'resolve' && bonds.length > 0 ? ' + all bonds' : ''
    const label = `${STAT_NAMES[activeStat]}${bondLabel}${modSuffix}${pressureSuffix}`

    setLastRoll({ dice: rolled, droppedDie, stat: activeStat, bondName: bond?.targetName })

    onRoll({
      type:        'roll_pool',
      rollLabel:   label,
      dice:        rolled,
      highest:     high,
      outcome,
      isResonance: res,
      collateral:  second,
    })
  }

  const selectedBond = activeBond ? bonds.find(b => b.id === activeBond) : null

  return (
    <div className="space-y-4 p-3">
      {/* Stat selector */}
      <div>
        <p className="text-xs text-sl-muted mb-2 uppercase tracking-wide font-mono">Choose a stat to roll</p>
        <div className="grid grid-cols-5 gap-1.5">
          {STAT_KEYS.map(stat => {
            const eff = effectiveStat(stat)
            const damaged = stat === 'form' && formDamage > 0
            return (
              <button
                key={stat}
                onClick={() => setActiveStat(activeStat === stat ? null : stat)}
                className={`flex flex-col items-center py-2 rounded border transition-all
                  ${activeStat === stat
                    ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                    : 'bg-sl-surface border-sl-border text-sl-text hover:border-sl-accent'
                  }`}
              >
                <span className="text-lg font-bold leading-none">{eff}</span>
                <span className="text-xs mt-0.5 font-mono">{STAT_NAMES[stat].slice(0, 3).toUpperCase()}</span>
                {damaged && <span className="text-xs text-sl-danger leading-none">-{formDamage}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Diamond pressure toggle (Resolve only) */}
      {activeStat === 'resolve' && bonds.length > 0 && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={diamondPressure} onChange={e => { setDiamond(e.target.checked); if (e.target.checked) setActiveBond(null) }}
            className="accent-[var(--sl-accent)] w-3 h-3" />
          <span className="text-xs text-sl-muted">
            Diamond authority — all bonds stack (+{bonds.reduce((s, b) => s + Math.min(4, b.rating), 0)}d6 total)
          </span>
        </label>
      )}

      {/* Bond selector */}
      {bonds.length > 0 && !diamondPressure && (
        <div>
          <p className="text-xs text-sl-muted mb-2 uppercase tracking-wide font-mono">Add Bond dice (optional)</p>
          <div className="space-y-1">
            {bonds.map(bond => (
              <button
                key={bond.id}
                onClick={() => setActiveBond(activeBond === bond.id ? null : bond.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded border text-sm transition-all
                  ${activeBond === bond.id
                    ? 'bg-sl-bond/20 border-sl-bond text-sl-text'
                    : 'bg-sl-surface border-sl-border text-sl-muted hover:border-sl-bond'
                  }`}
              >
                <span className="font-medium">{bond.targetName}</span>
                <span className={`text-xs font-mono ${activeBond === bond.id ? 'text-sl-bond' : 'text-sl-muted'}`}>
                  +{Math.min(4, bond.rating)}d6
                </span>
              </button>
            ))}
          </div>
          {activeBond && (
            <p className="text-xs text-sl-muted mt-1 px-1">
              Bond {selectedBond?.rating}/5 with {selectedBond?.targetName} — adds {Math.min(4, selectedBond?.rating ?? 0)} dice
            </p>
          )}
        </div>
      )}

      {/* Advantage / disadvantage */}
      <div className="flex gap-1">
        {(['normal', 'advantage', 'disadvantage'] as Modifier[]).map(m => (
          <button key={m} onClick={() => setModifier(modifier === m ? 'normal' : m)}
            className={`flex-1 text-xs py-1 rounded border transition-colors capitalize
              ${modifier === m
                ? m === 'advantage'    ? 'border-sl-success text-sl-success bg-sl-success/10'
                : m === 'disadvantage' ? 'border-sl-danger text-sl-danger bg-sl-danger/10'
                : 'border-sl-accent text-sl-accent bg-sl-accent/10'
                : 'border-sl-border text-sl-muted hover:border-sl-accent'}`}>
            {m === 'normal' ? 'Normal' : m === 'advantage' ? 'Adv +1 drop low' : 'Dis +1 drop high'}
          </button>
        ))}
      </div>

      {/* Pool summary + roll */}
      <div className="border-t border-sl-border pt-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {!activeStat && <p className="text-sm text-sl-muted">Select a stat above</p>}
            {activeStat && poolSize() > 0 && (
              <p className="text-sm text-sl-text">
                Roll <span className="font-bold text-sl-accent">{modifier !== 'normal' ? poolSize() + 1 : poolSize()}d6</span>
                {modifier !== 'normal' && <span className="text-sl-muted text-xs"> drop {modifier === 'disadvantage' ? 'highest' : 'lowest'}</span>}
                {!diamondPressure && activeBond && <span className="text-sl-muted text-xs"> ({effectiveStat(activeStat!)} stat + {bondDice()} bond)</span>}
                {diamondPressure && activeStat === 'resolve' && <span className="text-sl-muted text-xs"> ({effectiveStat('resolve')} + {bondDice()} all bonds)</span>}
              </p>
            )}
            {activeStat && poolSize() === 0 && (
              <p className="text-sm text-sl-danger">
                Stat is 0 — add a Bond to roll
              </p>
            )}
            {diceState === 'ready' && (
              <p className="text-xs text-sl-muted mt-0.5 font-mono">◆ Dice+ active</p>
            )}
          </div>
          <button
            onClick={handleRoll}
            disabled={!activeStat || poolSize() === 0 || rolling}
            className="px-4 py-2 rounded bg-sl-accent text-sl-accent-fg text-sm font-bold disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all min-w-[4rem]"
          >
            {rolling ? '…' : 'Roll'}
          </button>
        </div>
        {rolling && diceState !== 'unavailable' && (
          <p className="text-xs text-sl-muted mt-1 font-mono animate-pulse">Waiting for Dice+…</p>
        )}
      </div>

      {/* Last roll result */}
      {lastRoll && (
        <div className="bg-sl-surface border border-sl-border rounded p-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-sl-muted font-mono uppercase">{STAT_NAMES[lastRoll.stat]}{lastRoll.bondName ? ` + ${lastRoll.bondName}` : ''}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {lastRoll.droppedDie !== undefined && (
              <span className="w-7 h-7 flex items-center justify-center rounded text-sm font-bold border border-sl-border text-sl-muted/40 line-through opacity-50">
                {lastRoll.droppedDie}
              </span>
            )}
            {lastRoll.dice.map((d, i) => {
              const isHigh = d === highest(lastRoll.dice) && i === lastRoll.dice.indexOf(d)
              const sixes = countSixes(lastRoll.dice)
              const isSixAndMultiple = d === 6 && sixes >= 2
              return (
                <span key={i} className={`w-7 h-7 flex items-center justify-center rounded text-sm font-bold border
                  ${isSixAndMultiple
                    ? 'bg-sl-harmony text-sl-bg border-sl-harmony'
                    : isHigh
                      ? 'bg-sl-accent text-sl-accent-fg border-sl-accent'
                      : 'bg-sl-bg text-sl-muted border-sl-border'
                  }`}>
                  {d}
                </span>
              )
            })}
          </div>
          {(() => {
            const high = highest(lastRoll.dice)
            const outcome = getOutcome(high)
            const res = isResonance(lastRoll.dice)
            const second = secondHighest(lastRoll.dice)
            const coll = second !== undefined ? collateralResult(second) : null
            return (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold
                    ${outcome === 'success' ? 'text-sl-success' : outcome === 'partial' ? 'text-sl-partial' : 'text-sl-miss'}`}>
                    {outcomeLabel(outcome)}
                  </span>
                  {res && <span className="text-xs bg-sl-harmony/20 text-sl-harmony border border-sl-harmony/30 rounded px-1.5 py-0.5 font-semibold">Resonance</span>}
                </div>
                {res && <p className="text-xs text-sl-harmony">Two or more 6s — something exceptional happens. Collaborate on what it means.</p>}
                {!res && coll && second !== undefined && lastRoll.dice.length > 1 && (
                  <p className="text-xs text-sl-muted">Second die {second}: {collateralLabel(coll)}</p>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Quick reference */}
      <div className="border-t border-sl-border pt-3">
        <p className="text-xs text-sl-muted mb-1.5 font-mono uppercase tracking-wide">Quick Reference</p>
        <div className="space-y-1 text-xs text-sl-muted font-mono">
          <div className="flex gap-2"><span className="text-sl-success w-4">6</span><span>Clean success</span></div>
          <div className="flex gap-2"><span className="text-sl-partial w-4">4–5</span><span>Success with cost</span></div>
          <div className="flex gap-2"><span className="text-sl-miss w-4">1–3</span><span>Miss — GM moves</span></div>
          <div className="flex gap-2"><span className="text-sl-harmony w-8">2+ 6s</span><span>Resonance result</span></div>
        </div>
      </div>
    </div>
  )
}
