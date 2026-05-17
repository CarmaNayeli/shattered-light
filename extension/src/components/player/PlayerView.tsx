import { useState, useRef, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { CharacterCreation } from './CharacterCreation'
import { CharacterSheet } from './CharacterSheet'
import { useCharacter } from '../../hooks/useCharacter'
import { useChat } from '../../hooks/useChat'
import { THEMES, useTheme } from '../../lib/themes'
import { getArchetype, getGemType } from '../../lib/character-defaults'
import { CHAT_STATS_KEY } from '../../lib/dice'

interface Props {
  supabaseUserId: string
  playerId: string
  playerName: string
  roomId: string
  userEmail: string
  onSignOut: () => void
}

type View = 'menu' | 'sheet' | 'create'

function StarLogo({ size = 48 }: { size?: number }) {
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

export function PlayerView({ supabaseUserId, playerId, playerName, roomId, userEmail, onSignOut }: Props) {
  const { theme, changeTheme }   = useTheme()
  const { chars, loading, saveCharacter, deleteCharacter } = useCharacter(supabaseUserId, roomId)
  const [view, setView]          = useState<View>('menu')
  const [activeSlot, setActiveSlot]   = useState(0)
  const [createSlot, setCreateSlot]   = useState(0)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [unread, setUnread]      = useState(0)
  const [chatOpen, setChatOpen]  = useState(false)
  const prevLen = useRef(0)

  const activeChar = chars[activeSlot] ?? null
  const charName   = activeChar?.name ?? playerName

  const { messages, announceRoll } = useChat(playerId, charName, theme.hex)

  useEffect(() => {
    if (!chatOpen && messages.length > prevLen.current) setUnread(u => u + (messages.length - prevLen.current))
    prevLen.current = messages.length
  }, [messages, chatOpen])

  async function toggleChat() {
    if (chatOpen) {
      await OBR.popover.close('sl-chat')
      setChatOpen(false)
    } else {
      setUnread(0)
      if (activeChar) localStorage.setItem(CHAT_STATS_KEY, JSON.stringify({ stats: activeChar.stats }))
      const chatUrl = new URL(`?mode=chat&charName=${encodeURIComponent(charName)}`, window.location.href).toString()
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

  if (loading) return <div className="flex items-center justify-center h-full bg-sl-bg"><p className="text-sl-muted text-sm">Loading…</p></div>

  if (view === 'menu') {
    return (
      <div className="flex flex-col items-center h-full bg-sl-bg px-4 overflow-y-auto">
        <div className="w-full max-w-xs space-y-5 py-6">
          <div className="text-center space-y-1">
            <StarLogo size={56} />
            <h1 className="text-base font-bold text-sl-accent font-mono tracking-widest mt-1">SHATTERED LIGHT</h1>
            <p className="text-xs text-sl-muted truncate">{userEmail}</p>
          </div>

          <div className="space-y-2">
            {chars.map((char, slot) => {
              if (char) {
                const gemDef = getGemType(char.gemType)
                const archDef = getArchetype(char.archetype)
                const isConfirm = confirmDelete === slot
                return (
                  <div key={slot} className="bg-sl-surface border border-sl-border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sl-text truncate">{char.name}</p>
                        <p className="text-xs text-sl-muted">{gemDef.label} · {archDef.label}{char.pronouns ? ` · ${char.pronouns}` : ''}</p>
                      </div>
                      <button onClick={() => { setActiveSlot(slot); setView('sheet') }}
                        className="shrink-0 px-3 py-1 rounded bg-sl-accent text-sl-accent-fg text-xs font-semibold hover:opacity-90">Open</button>
                    </div>
                    {/* Stats mini */}
                    <div className="flex gap-1">
                      {(['form','clarity','resonance','radiance','resolve'] as const).map(s => (
                        <div key={s} className="flex-1 text-center">
                          <p className="text-sm font-bold text-sl-text">{char.stats[s]}</p>
                          <p className="text-xs text-sl-muted font-mono">{s.slice(0,3).toUpperCase()}</p>
                        </div>
                      ))}
                    </div>
                    {/* Bonds */}
                    {char.bonds.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {char.bonds.slice(0,3).map(b => (
                          <span key={b.id} className="text-xs text-sl-bond bg-sl-bond/10 border border-sl-bond/20 rounded-full px-2 py-0.5">{b.targetName}</span>
                        ))}
                        {char.bonds.length > 3 && <span className="text-xs text-sl-muted">+{char.bonds.length - 3}</span>}
                      </div>
                    )}
                    {isConfirm ? (
                      <div className="border border-red-500/40 rounded p-2 space-y-1.5 bg-red-500/5">
                        <p className="text-xs text-sl-muted text-center">Delete <span className="text-sl-text font-medium">{char.name}</span>?</p>
                        <div className="flex gap-2">
                          <button onClick={async () => { await deleteCharacter(slot); setConfirmDelete(null) }}
                            className="flex-1 py-1 rounded bg-red-600 text-white text-xs font-semibold">Delete</button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="flex-1 py-1 rounded border border-sl-border text-sl-muted text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(slot)} className="w-full text-xs text-sl-muted hover:text-red-400 text-right">Delete</button>
                    )}
                  </div>
                )
              }
              return (
                <button key={slot} onClick={() => { setCreateSlot(slot); setView('create') }}
                  className="w-full py-3 rounded-lg border border-dashed border-sl-border text-sl-muted text-sm hover:border-sl-accent hover:text-sl-text transition-colors">
                  + New Gem
                </button>
              )
            })}
          </div>

          <div className="text-center">
            <p className="text-xs text-sl-muted">
              Full rulebook at{' '}
              <a href="https://shattered-light.vercel.app/" target="_blank" rel="noreferrer" className="underline hover:text-sl-accent">shattered-light.vercel.app</a>
            </p>
          </div>

          <button onClick={onSignOut} className="w-full py-2 text-xs text-sl-muted hover:text-sl-danger">Sign Out</button>

          {/* Theme picker */}
          <div className="pt-2 border-t border-sl-border space-y-2">
            <p className="text-xs text-sl-muted text-center tracking-wide uppercase font-mono">Gem Color</p>
            <div className="grid grid-cols-8 gap-2 justify-items-center">
              {THEMES.map(t => (
                <button key={t.id} title={t.name} onClick={() => changeTheme(t)}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{ backgroundColor: t.hex, outline: theme.id === t.id ? `2px solid ${t.hex}` : '2px solid transparent', outlineOffset: '2px', opacity: theme.id === t.id ? 1 : 0.6 }}
                />
              ))}
            </div>
            <p className="text-xs text-sl-muted text-center">{theme.name}</p>
          </div>

          {/* Chat roll reference */}
          <div className="pt-2 border-t border-sl-border space-y-1.5">
            <p className="text-xs text-sl-muted text-center uppercase tracking-wide font-mono">Chat Roll Commands</p>
            <div className="bg-sl-surface border border-sl-border rounded p-2.5 text-xs space-y-1">
              <p className="text-sl-muted">Type in chat to roll dice:</p>
              <div className="font-mono space-y-0.5">
                <div className="flex gap-2"><span className="text-sl-accent">!r 3d6</span><span className="text-sl-muted">pool of 3</span></div>
                <div className="flex gap-2"><span className="text-sl-accent">!r 2d6+1d6</span><span className="text-sl-muted">mixed</span></div>
                <div className="flex gap-2"><span className="text-sl-accent">{'!r {FORM}d6'}</span><span className="text-sl-muted">stat var</span></div>
              </div>
              <p className="text-sl-muted pt-0.5">Stats: FORM · CLARITY · RESONANCE · RADIANCE · RESOLVE</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'create') {
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 px-4 py-2 border-b border-sl-border">
          <button onClick={() => setView('menu')} className="text-xs text-sl-muted hover:text-sl-text">← Back</button>
        </div>
        <div className="flex-1 overflow-hidden">
          <CharacterCreation roomId={roomId} onComplete={async char => { await saveCharacter(char, createSlot); setActiveSlot(createSlot); setView('sheet') }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-sl-bg">
      <div className="shrink-0 px-4 py-1.5 border-b border-sl-border flex items-center justify-between">
        <button onClick={() => setView('menu')} className="text-xs text-sl-muted hover:text-sl-text">← Menu</button>
        <button onClick={toggleChat}
          className={`flex items-center gap-1.5 text-xs transition-colors ${chatOpen ? 'text-sl-accent' : 'text-sl-muted hover:text-sl-text'}`}>
          Chat
          {!chatOpen && unread > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-sl-accent text-sl-accent-fg text-xs font-bold leading-none">{unread}</span>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <CharacterSheet
          character={activeChar!}
          roomId={roomId}
          onUpdate={char => saveCharacter(char, activeSlot)}
          onRoll={announceRoll}
        />
      </div>
    </div>
  )
}
