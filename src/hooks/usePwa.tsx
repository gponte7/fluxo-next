'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
interface PwaCtx {
  canInstall: boolean // navegador oferece instalação (Android/desktop)
  isIOS: boolean // iPhone/iPad no Safari: instalação é manual
  standalone: boolean // já está rodando como app instalado
  online: boolean
  updateReady: boolean
  install: () => Promise<void>
  applyUpdate: () => void
}
const Ctx = createContext<PwaCtx>({ canInstall: false, isIOS: false, standalone: false, online: true, updateReady: false, install: async () => {}, applyUpdate: () => {} })

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [standalone, setStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [online, setOnline] = useState(true)
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean }
    setStandalone(window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true)
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1))
    setOnline(navigator.onLine)
    const on = () => setOnline(true), off = () => setOnline(false)
    const before = (e: Event) => { e.preventDefault(); setDeferred(e as BeforeInstallPromptEvent) }
    const installed = () => { setDeferred(null); setStandalone(true) }
    window.addEventListener('online', on); window.addEventListener('offline', off)
    window.addEventListener('beforeinstallprompt', before); window.addEventListener('appinstalled', installed)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); window.removeEventListener('beforeinstallprompt', before); window.removeEventListener('appinstalled', installed) }
  }, [])

  useEffect(() => { // registra o service worker (só em produção, para não atrapalhar o desenvolvimento)
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return
    let reloaded = false
    const onChange = () => { if (!reloaded) { reloaded = true; window.location.reload() } }
    navigator.serviceWorker.addEventListener('controllerchange', onChange)
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then((reg) => {
      if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting)
      reg.addEventListener('updatefound', () => {
        const w = reg.installing
        w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) setWaiting(w) })
      })
      const check = () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}) }
      document.addEventListener('visibilitychange', check)
    }).catch(() => {})
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onChange)
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt(); await deferred.userChoice; setDeferred(null)
  }, [deferred])
  const applyUpdate = useCallback(() => waiting?.postMessage('SKIP_WAITING'), [waiting])

  return <Ctx.Provider value={{ canInstall: !!deferred, isIOS, standalone, online, updateReady: !!waiting, install, applyUpdate }}>{children}</Ctx.Provider>
}
export const usePwa = () => useContext(Ctx)
