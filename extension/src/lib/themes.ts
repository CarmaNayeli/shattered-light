import { useState, useEffect } from 'react'

export interface Theme {
  id: string
  name: string
  hex: string
  fg: string
}

export const THEMES: Theme[] = [
  { id: 'lapis',       name: 'Lapis',       hex: '#4a9eff', fg: '#0d1a1a' },
  { id: 'rose',        name: 'Rose Quartz', hex: '#f472b6', fg: '#0d1a1a' },
  { id: 'emerald',     name: 'Emerald',     hex: '#34d399', fg: '#0d1a1a' },
  { id: 'amethyst',    name: 'Amethyst',    hex: '#a78bfa', fg: '#0d1a1a' },
  { id: 'topaz',       name: 'Topaz',       hex: '#F5E06B', fg: '#0d1a1a' },
  { id: 'carnelian',   name: 'Carnelian',   hex: '#fb923c', fg: '#0d1a1a' },
  { id: 'moonstone',   name: 'Moonstone',   hex: '#A8C8F0', fg: '#0d1a1a' },
  { id: 'alexandrite', name: 'Alexandrite', hex: '#818cf8', fg: '#0d1a1a' },
]

const STORAGE_KEY = 'sl_theme'

function applyTheme(t: Theme) {
  const root = document.documentElement
  const hex = t.hex.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const fgHex = t.fg.replace('#', '')
  const fr = parseInt(fgHex.slice(0, 2), 16)
  const fg2 = parseInt(fgHex.slice(2, 4), 16)
  const fb = parseInt(fgHex.slice(4, 6), 16)
  root.style.setProperty('--sl-accent', `${r} ${g} ${b}`)
  root.style.setProperty('--sl-accent-fg', `${fr} ${fg2} ${fb}`)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return THEMES.find(t => t.id === saved) ?? THEMES[0]
  })
  useEffect(() => { applyTheme(theme) }, [theme])
  function changeTheme(t: Theme) {
    setTheme(t)
    localStorage.setItem(STORAGE_KEY, t.id)
    applyTheme(t)
  }
  return { theme, changeTheme }
}
