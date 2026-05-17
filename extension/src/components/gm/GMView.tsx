import { useState } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { useGMView } from '../../hooks/useGMView'
import { useChat } from '../../hooks/useChat'
import { THEMES, useTheme } from '../../lib/themes'
import { PlayerCards } from './PlayerCards'
import { NPCCreator } from './NPCCreator'
import { NPCSheet } from './NPCSheet'
import { InitiativeTracker } from './InitiativeTracker'

type Tab = 'players' | 'npcs' | 'initiative'

interface Props {
  supabaseUserId: string
  playerId: string
  playerName: string
  roomId: string
  userEmail: string
  onSignOut: () => void
}

function StarLogo({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} aria-hidden="true">
      <polygon points="256,256 207,188 256,36 305,188"   fill="#FFFFFF" stroke="#A8C8F0" strokeWidth="2"/>
      <polygon points="256,256 305,188 465,188 336,282"  fill="#F5E06B"/>
      <polygon points="256,256 336,282 385,434 256,340"  fill="#2C2C2C"/>
      <polygon points="256,256 256,340 127,434 176,282"  fill="#F4A0C0"/>
      <polygon points="256,256 176,282 47,188 207,188"   fill="#A8C8F0"/>
    </svg>
  )
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'players',    label: 'Players' },
  { id: 'npcs',       label: 'NPCs' },
  { id: 'initiative', label: 'Initiative' },
]

export function GMView({ supabaseUserId, playerId, playerName, roomId, userEmail, onSignOut }: Props) {
  const { theme, changeTheme } = useTheme()
  const { players, npcs, loading, saveNPC, deleteNPC } = useGMView(roomId, supabaseUserId)
  useChat(playerId, playerName, theme.hex)
  const [tab, setTab]         = useState<Tab>('players')
  const [chatOpen, setChatOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  async function toggleChat() {
    if (chatOpen) {
      await OBR.popover.close('sl-chat')
      setChatOpen(false)
    } else {
      const chatUrl = new URL(`?mode=chat&charName=${encodeURIComponent(playerName)}`, window.location.href).toString()
      await OBR.popover.open({
        id: 'sl-chat', url: chatUrl, width: 420, height: 300,
        anchorReference: 'POSITION',
        anchorPosition: { left: 4, top: 99999 },
        anchorOrigin: { horizontal: 'LEFT', vertical: 'BOTTOM' },
        transformOrigin: { horizontal: 'LEFT', vertical: 'BOTTOM' },
        disableClickAway: true,
      })
      setChatOpen(true)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-sl-bg">
      <p className="text-sl-muted text-sm">Loading…</p>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      {/* Top bar */}
      <div className="shrink-0 px-4 py-2 border-b border-sl-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarLogo size={28} />
          <div>
            <p className="text-xs font-bold text-sl-accent font-mono tracking-widest leading-tight">SHATTERED LIGHT</p>
            <p className="text-xs text-sl-muted leading-tight truncate max-w-[120px]" title={userEmail}>GM · {userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleChat}
            className={`text-xs transition-colors ${chatOpen ? 'text-sl-accent' : 'text-sl-muted hover:text-sl-text'}`}
          >
            Chat
          </button>
          <button onClick={onSignOut} className="text-xs text-sl-muted hover:text-sl-danger">Sign Out</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-sl-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 text-xs font-mono transition-colors
              ${tab === t.id ? 'text-sl-accent border-b-2 border-sl-accent' : 'text-sl-muted hover:text-sl-text'}`}
          >
            {t.label}
            {t.id === 'players' && players.length > 0 && (
              <span className="ml-1 text-sl-muted opacity-60">({players.length})</span>
            )}
            {t.id === 'npcs' && npcs.length > 0 && (
              <span className="ml-1 text-sl-muted opacity-60">({npcs.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'players' && <PlayerCards players={players} />}

        {tab === 'npcs' && (
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-sl-text">NPCs</h3>
              {!creating && (
                <button onClick={() => setCreating(true)} className="text-xs text-sl-accent hover:opacity-80">+ New NPC</button>
              )}
            </div>

            {creating && (
              <NPCCreator
                onSave={async npc => { await saveNPC(npc); setCreating(false) }}
                onCancel={() => setCreating(false)}
              />
            )}

            {npcs.length === 0 && !creating && (
              <p className="text-xs text-sl-muted text-center py-8">No NPCs yet — add one above.</p>
            )}

            {npcs.map(npc => (
              <NPCSheet
                key={npc.id}
                npc={npc}
                onUpdate={saveNPC}
                onDelete={deleteNPC}
              />
            ))}
          </div>
        )}

        {tab === 'initiative' && (
          <InitiativeTracker players={players} npcs={npcs} />
        )}
      </div>

      {/* Theme picker footer */}
      <div className="shrink-0 px-4 py-2 border-t border-sl-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-sl-muted font-mono">Color</span>
          <div className="flex gap-1.5">
            {THEMES.map(t => (
              <button
                key={t.id}
                title={t.name}
                onClick={() => changeTheme(t)}
                className="w-4 h-4 rounded-full transition-all"
                style={{
                  backgroundColor: t.hex,
                  outline: theme.id === t.id ? `2px solid ${t.hex}` : '2px solid transparent',
                  outlineOffset: '2px',
                  opacity: theme.id === t.id ? 1 : 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
