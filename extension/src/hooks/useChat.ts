import { useState, useEffect, useCallback, useRef } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import type { ChatMessage } from '../types/chat'

const OBR_CHANNEL  = 'sl_chat'
const BC_CHANNEL   = 'sl_chat_local'
const METADATA_KEY = 'sl_chat_history'
const MAX          = 120
const MAX_PERSIST  = 50

export function useChat(playerId: string, playerName: string, accentColor?: string) {
  const seen            = useRef(new Set<string>())
  const latestMessages  = useRef<ChatMessage[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])

  function append(msg: ChatMessage) {
    if (seen.current.has(msg.id)) return
    seen.current.add(msg.id)
    const next = [...latestMessages.current.slice(-(MAX - 1)), msg]
    latestMessages.current = next
    setMessages(next)
  }

  useEffect(() => {
    OBR.onReady(() => {
      OBR.room.getMetadata()
        .then(meta => {
          const history = (meta[METADATA_KEY] ?? []) as ChatMessage[]
          history.slice(-MAX_PERSIST).forEach(msg => append(msg))
        })
        .catch(() => {})

      const unsub = OBR.room.onMetadataChange(meta => {
        const history = (meta[METADATA_KEY] ?? []) as ChatMessage[]
        history.slice(-MAX_PERSIST).forEach(msg => append(msg))
      })
      return unsub
    })
  }, [])

  useEffect(() => {
    if (!playerId) return
    const unsubOBR = OBR.broadcast.onMessage(OBR_CHANNEL, event => {
      append(event.data as ChatMessage)
    })
    const bc = new BroadcastChannel(BC_CHANNEL)
    bc.onmessage = (event: MessageEvent<ChatMessage>) => { append(event.data) }
    return () => { unsubOBR(); bc.close() }
  }, [playerId])

  const send = useCallback(async (msg: ChatMessage) => {
    seen.current.add(msg.id)
    const next = [...latestMessages.current.slice(-(MAX - 1)), msg]
    latestMessages.current = next
    setMessages(next)
    await OBR.broadcast.sendMessage(OBR_CHANNEL, msg)
    const bc = new BroadcastChannel(BC_CHANNEL)
    bc.postMessage(msg)
    bc.close()
    OBR.room.setMetadata({ [METADATA_KEY]: latestMessages.current.slice(-MAX_PERSIST) }).catch(() => {})
  }, [])

  const sendChat = useCallback(async (text: string) => {
    await send({ id: crypto.randomUUID(), type: 'chat', playerId, playerName, accentColor, timestamp: Date.now(), text })
  }, [playerId, playerName, accentColor, send])

  const announceRoll = useCallback(async (
    partial: Omit<ChatMessage, 'id' | 'timestamp' | 'playerId' | 'playerName'>
  ) => {
    await send({ ...partial, id: crypto.randomUUID(), playerId, playerName, accentColor, timestamp: Date.now() })
  }, [playerId, playerName, accentColor, send])

  return { messages, sendChat, announceRoll }
}
