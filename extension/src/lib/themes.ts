import { useState, useEffect } from 'react'

export interface Theme {
  id: string
  name: string
  hex: string
  fg: string
}

export const THEMES: Theme[] = [
  // White court
  { id: 'moonstone',   name: 'Moonstone',   hex: '#A8C8F0', fg: '#0d1a1a' },
  { id: 'pearl',       name: 'Pearl',       hex: '#e8d5b0', fg: '#0d1a1a' },
  { id: 'goshenite',   name: 'Goshenite',   hex: '#c8dde8', fg: '#0d1a1a' },
  // Yellow court
  { id: 'topaz',       name: 'Topaz',       hex: '#F5E06B', fg: '#0d1a1a' },
  { id: 'carnelian',   name: 'Carnelian',   hex: '#fb923c', fg: '#0d1a1a' },
  { id: 'ruby',        name: 'Ruby',        hex: '#e63757', fg: '#ffffff' },
  { id: 'jasper',      name: 'Jasper',      hex: '#d4622a', fg: '#ffffff' },
  { id: 'amethyst',    name: 'Amethyst',    hex: '#a78bfa', fg: '#0d1a1a' },
  { id: 'onyx',        name: 'Onyx',        hex: '#94b4b4', fg: '#0d1a1a' },
  // Blue court
  { id: 'sapphire',    name: 'Sapphire',    hex: '#4189d4', fg: '#ffffff' },
  { id: 'lapis',       name: 'Lapis',       hex: '#4a9eff', fg: '#0d1a1a' },
  { id: 'aquamarine',  name: 'Aquamarine',  hex: '#2ccfcf', fg: '#0d1a1a' },
  { id: 'zircon',      name: 'Zircon',      hex: '#7eb8f7', fg: '#0d1a1a' },
  // Pink court
  { id: 'rose',        name: 'Rose Quartz', hex: '#f472b6', fg: '#0d1a1a' },
  { id: 'morganite',   name: 'Morganite',   hex: '#f9a8d4', fg: '#0d1a1a' },
  { id: 'kunzite',     name: 'Kunzite',     hex: '#e879f9', fg: '#0d1a1a' },
  { id: 'turquoise',   name: 'Turquoise',   hex: '#0fb8a0', fg: '#0d1a1a' },
  // Cross-court
  { id: 'emerald',     name: 'Emerald',     hex: '#34d399', fg: '#0d1a1a' },
  { id: 'peridot',     name: 'Peridot',     hex: '#95c41a', fg: '#0d1a1a' },
  { id: 'bismuth',     name: 'Bismuth',     hex: '#d946ef', fg: '#0d1a1a' },
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
