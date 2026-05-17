import { useState, useEffect, useCallback, useRef } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import { supabase } from '../lib/supabase'
import type { Character, CharacterSnapshot } from '../types/character'

const SLOT_COUNT = 3

function toSnapshot(char: Character): CharacterSnapshot {
  return {
    name:       char.name,
    archetype:  char.archetype,
    gemType:    char.gemType,
    stats:      char.stats,
    formDamage: char.formDamage,
    bonds:      char.bonds.map(b => ({ targetName: b.targetName, rating: b.rating })),
    pronouns:   char.pronouns,
  }
}

function parseSlots(raw: unknown): (Character | null)[] {
  if (!raw) return Array(SLOT_COUNT).fill(null)
  const data = raw as Record<string, unknown>
  if (Array.isArray(data.slots)) {
    const slots = [...data.slots] as (Character | null)[]
    while (slots.length < SLOT_COUNT) slots.push(null)
    return slots.slice(0, SLOT_COUNT)
  }
  if ((data as Record<string, unknown>).id) {
    return [raw as Character, ...Array(SLOT_COUNT - 1).fill(null)]
  }
  return Array(SLOT_COUNT).fill(null)
}

export function useCharacter(supabaseUserId: string, roomId: string) {
  const [chars, setChars]     = useState<(Character | null)[]>(Array(SLOT_COUNT).fill(null))
  const [loading, setLoading] = useState(true)
  const charsRef              = useRef(chars)
  charsRef.current            = chars

  useEffect(() => {
    if (!supabaseUserId || !roomId) return
    load()
  }, [supabaseUserId, roomId])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('characters')
      .select('character_data')
      .eq('user_id', supabaseUserId)
      .eq('room_id', roomId)
      .maybeSingle()

    const slots = parseSlots(data?.character_data)
    setChars(slots)
    charsRef.current = slots
    const first = slots.find(c => c !== null)
    if (first) await OBR.player.setMetadata({ sl: toSnapshot(first) })
    setLoading(false)
  }

  async function persistSlots(slots: (Character | null)[], syncChar: Character | null) {
    const [{ error }] = await Promise.all([
      supabase.from('characters').upsert(
        { user_id: supabaseUserId, room_id: roomId, character_data: { slots } },
        { onConflict: 'user_id,room_id' }
      ),
      OBR.player.setMetadata({ sl: syncChar ? toSnapshot(syncChar) : null }),
    ])
    if (error) console.error('[useCharacter] save failed:', error.message, error)
  }

  const saveCharacter = useCallback(async (char: Character, slot: number) => {
    const newChars = [...charsRef.current]
    newChars[slot] = char
    setChars(newChars)
    charsRef.current = newChars
    await persistSlots(newChars, char)
  }, [supabaseUserId, roomId])

  const deleteCharacter = useCallback(async (slot: number) => {
    const newChars = [...charsRef.current]
    newChars[slot] = null
    setChars(newChars)
    charsRef.current = newChars
    const remaining = newChars.find(c => c !== null) ?? null
    await persistSlots(newChars, remaining)
  }, [supabaseUserId, roomId])

  return { chars, loading, saveCharacter, deleteCharacter }
}
