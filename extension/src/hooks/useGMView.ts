import { useState, useEffect, useCallback } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { supabase } from '../lib/supabase'
import type { CharacterSnapshot } from '../types/character'
import type { NPC } from '../lib/character-defaults'

export interface PlayerEntry {
  playerId: string
  playerName: string
  snapshot: CharacterSnapshot | null
}

export function useGMView(roomId: string, gmUserId: string) {
  const [players, setPlayers]   = useState<PlayerEntry[]>([])
  const [npcs,    setNpcs]      = useState<NPC[]>([])
  const [loading, setLoading]   = useState(true)

  // Load NPCs from Supabase
  useEffect(() => {
    if (!roomId || !gmUserId) return
    loadNPCs()
  }, [roomId, gmUserId])

  async function loadNPCs() {
    const { data } = await supabase
      .from('npcs')
      .select('npc_data')
      .eq('room_id', roomId)
      .maybeSingle()
    setNpcs((data?.npc_data as NPC[]) ?? [])
    setLoading(false)
  }

  async function persistNPCs(list: NPC[]) {
    await supabase.from('npcs').upsert(
      { room_id: roomId, gm_user_id: gmUserId, npc_data: list },
      { onConflict: 'room_id' }
    )
  }

  const saveNPC = useCallback(async (npc: NPC) => {
    const next = npcs.some(n => n.id === npc.id)
      ? npcs.map(n => n.id === npc.id ? npc : n)
      : [...npcs, npc]
    setNpcs(next)
    await persistNPCs(next)
  }, [npcs, roomId, gmUserId])

  const deleteNPC = useCallback(async (id: string) => {
    const next = npcs.filter(n => n.id !== id)
    setNpcs(next)
    await persistNPCs(next)
  }, [npcs, roomId, gmUserId])

  // Watch OBR player list for snapshots
  useEffect(() => {
    OBR.onReady(async () => {
      async function syncPlayers() {
        const list = await OBR.party.getPlayers()
        const entries: PlayerEntry[] = list.map(p => ({
          playerId:   p.id,
          playerName: p.name,
          snapshot:   (p.metadata?.['sl'] as CharacterSnapshot) ?? null,
        }))
        setPlayers(entries)
      }
      await syncPlayers()
      OBR.party.onChange(syncPlayers)
    })
  }, [])

  return { players, npcs, loading, saveNPC, deleteNPC }
}
