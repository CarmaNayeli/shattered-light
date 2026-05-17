import { useState, useEffect, useCallback } from 'react'
import OBR from '@owlbear-rodeo/sdk'
import type { FusionSheet } from '../types/fusion'

const METADATA_KEY = 'sl_fusions'

export function useFusion(roomId: string) {
  const [fusions, setFusions] = useState<FusionSheet[]>([])

  useEffect(() => {
    if (!roomId) return
    OBR.onReady(async () => {
      const meta = await OBR.room.getMetadata()
      setFusions((meta[METADATA_KEY] as FusionSheet[]) ?? [])
      OBR.room.onMetadataChange(m => {
        setFusions((m[METADATA_KEY] as FusionSheet[]) ?? [])
      })
    })
  }, [roomId])

  const saveFusion = useCallback(async (fusion: FusionSheet) => {
    const next = fusions.some(f => f.id === fusion.id)
      ? fusions.map(f => f.id === fusion.id ? fusion : f)
      : [...fusions, fusion]
    setFusions(next)
    await OBR.room.setMetadata({ [METADATA_KEY]: next })
  }, [fusions])

  const deleteFusion = useCallback(async (id: string) => {
    const next = fusions.filter(f => f.id !== id)
    setFusions(next)
    await OBR.room.setMetadata({ [METADATA_KEY]: next })
  }, [fusions])

  const updateHarmony = useCallback(async (id: string, harmony: number) => {
    const next = fusions.map(f => f.id === id ? { ...f, harmony } : f)
    setFusions(next)
    await OBR.room.setMetadata({ [METADATA_KEY]: next })
  }, [fusions])

  return { fusions, saveFusion, deleteFusion, updateHarmony }
}
