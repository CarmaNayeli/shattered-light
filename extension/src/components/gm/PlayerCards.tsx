import { getArchetype, getGemType, STAT_KEYS } from '../../lib/character-defaults'
import type { PlayerEntry } from '../../hooks/useGMView'

interface Props {
  players: PlayerEntry[]
}

function StatPip({ val, label, damaged }: { val: number; label: string; damaged?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-sm font-bold ${damaged ? 'text-sl-danger' : 'text-sl-text'}`}>{val}</p>
      <p className="text-xs text-sl-muted font-mono">{label}</p>
    </div>
  )
}

export function PlayerCards({ players }: Props) {
  if (players.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-sl-muted py-10">
        No players connected yet. Players appear here once they open the extension.
      </div>
    )
  }

  return (
    <div className="p-3 space-y-3">
      {players.map(entry => {
        const snap = entry.snapshot
        if (!snap) {
          return (
            <div key={entry.playerId} className="bg-sl-surface border border-sl-border rounded-lg p-3">
              <p className="font-semibold text-sl-text text-sm">{entry.playerName}</p>
              <p className="text-xs text-sl-muted mt-1">No character loaded</p>
            </div>
          )
        }

        const gemDef  = getGemType(snap.gemType as any)
        const archDef = getArchetype(snap.archetype)
        const effForm = Math.max(0, snap.stats.form - snap.formDamage)

        return (
          <div key={entry.playerId} className="bg-sl-surface border border-sl-border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-sl-text truncate">{snap.name}</p>
                <p className="text-xs text-sl-muted">{snap.pronouns ? `${snap.pronouns} · ` : ''}{gemDef.label} · {archDef.label}</p>
                <p className="text-xs text-sl-muted font-mono">{entry.playerName}</p>
              </div>
              {snap.formDamage > 0 && (
                <div className="shrink-0 text-right">
                  <div className="flex gap-0.5 justify-end">
                    {[0,1,2,3].map(n => (
                      <div key={n} className={`w-3.5 h-3.5 rounded-sm border text-xs
                        ${n < snap.formDamage ? 'bg-sl-danger border-sl-danger' : 'border-sl-border'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-sl-danger mt-0.5">Form −{snap.formDamage}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1">
              {STAT_KEYS.map(s => (
                <StatPip
                  key={s}
                  val={s === 'form' ? effForm : snap.stats[s]}
                  label={s.slice(0,3).toUpperCase()}
                  damaged={s === 'form' && snap.formDamage > 0}
                />
              ))}
            </div>

            {snap.bonds && snap.bonds.length > 0 && (
              <div className="flex gap-1 flex-wrap pt-1 border-t border-sl-border">
                {snap.bonds.slice(0,4).map(b => (
                  <span key={b.targetName} className="text-xs bg-sl-bond/10 border border-sl-bond/20 text-sl-bond rounded-full px-2 py-0.5">
                    {b.targetName} <span className="opacity-60">·{b.rating}</span>
                  </span>
                ))}
                {snap.bonds.length > 4 && (
                  <span className="text-xs text-sl-muted">+{snap.bonds.length - 4}</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
