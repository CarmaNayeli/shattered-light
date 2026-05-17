import { useState, useEffect } from 'react'
import OBR from '@owlbear-rodeo/sdk'

export interface OBRContext {
  ready: boolean
  role: 'GM' | 'PLAYER' | null
  playerId: string
  playerName: string
  roomId: string
}

export function useOBR(): OBRContext {
  const [ctx, setCtx] = useState<OBRContext>({
    ready: false,
    role: null,
    playerId: '',
    playerName: '',
    roomId: '',
  })

  useEffect(() => {
    OBR.onReady(async () => {
      const [role, playerId, playerName, roomMeta] = await Promise.all([
        OBR.player.getRole(),
        OBR.player.getId(),
        OBR.player.getName(),
        OBR.room.getMetadata(),
      ])

      let roomId = roomMeta['sl_room_id'] as string | undefined
      if (!roomId) {
        roomId = crypto.randomUUID()
        await OBR.room.setMetadata({ sl_room_id: roomId })
      }

      setCtx({ ready: true, role, playerId, playerName, roomId })
    })
  }, [])

  return ctx
}
