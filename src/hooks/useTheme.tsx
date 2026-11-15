'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
export type ThemePref = 'sistema' | 'claro' | 'escuro'
const KEY = 'preferencia-tema'
const query = '(prefers-color-scheme: dark)'
const Ctx = createContext<{ dark: boolean; pref: ThemePref; setPref: (p: ThemePref) => void }>({ dark: false, pref: 'sistema', setPref: () => {} })

// Servidor e navegador começam iguais ('sistema'); a classe "dark" inicial vem do script no <head> (sem piscar).
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>('sistema')
  const [sys, setSys] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v === 'claro' || v === 'escuro') setPrefState(v) } catch { /* ignora */ }
    const mq = window.matchMedia(query); setSys(mq.matches)
    const on = () => setSys(mq.matches)
    mq.addEventListener('change', on); setReady(true)
    return () => mq.removeEventListener('change', on)
  }, [])
  const dark = pref === 'escuro' || (pref === 'sistema' && sys)
  useEffect(() => { if (!ready) return; document.documentElement.classList.toggle('dark', dark); document.documentElement.style.colorScheme = dark ? 'dark' : 'light' }, [dark, ready])
  const setPref = (p: ThemePref) => { setPrefState(p); try { localStorage.setItem(KEY, p) } catch { /* ignora */ } }
  return <Ctx.Provider value={{ dark, pref, setPref }}>{children}</Ctx.Provider>
}
export const useTheme = () => useContext(Ctx)
export const useColors = () => {
  const { dark } = useTheme()
  return dark
    ? { inc: '#3ec98d', exp: '#f47286', brand: '#84a2f5', line: '#26332e', muted: '#94a39b' }
    : { inc: '#178a5b', exp: '#c83952', brand: '#27407f', line: '#dde3de', muted: '#5e6b64' }
}
