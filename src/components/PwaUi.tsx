'use client'

import { useEffect, useState } from 'react'
import { Download, RefreshCw, Share, WifiOff, X } from 'lucide-react'
import { usePwa } from '../hooks/usePwa'

const KEY = 'fluxo-instalar-dispensado'
const DAYS = 14

/** Aviso fixo no topo quando o aparelho está sem internet, e aviso de nova versão do app. */
export function StatusBanners() {
  const { online, updateReady, applyUpdate } = usePwa()
  return (
    <>
      {!online && <div role="status" className="fixed inset-x-0 top-0 z-[70] flex items-center justify-center gap-2 bg-ink px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] text-center text-xs text-bg"><WifiOff size={14} />Você está sem internet. Alterações só serão salvas quando a conexão voltar.</div>}
      {updateReady && <div role="status" className="fixed inset-x-3 bottom-24 z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-bg shadow-lg md:bottom-6"><span>Nova versão do Fluxo disponível.</span><button className="flex items-center gap-1 font-semibold underline" onClick={applyUpdate}><RefreshCw size={14} />Atualizar</button></div>}
    </>
  )
}

function useDismissed() {
  const [hidden, setHidden] = useState(true)
  useEffect(() => { try { const t = Number(localStorage.getItem(KEY) ?? 0); setHidden(Date.now() - t < DAYS * 864e5) } catch { setHidden(false) } }, [])
  return { hidden, dismiss: () => { try { localStorage.setItem(KEY, String(Date.now())) } catch { /* ignora */ } setHidden(true) } }
}

/** Convite para instalar: botão nativo no Android/desktop e instruções no iPhone. */
export function InstallBanner() {
  const { canInstall, isIOS, standalone, install } = usePwa()
  const { hidden, dismiss } = useDismissed()
  if (standalone || hidden || (!canInstall && !isIOS)) return null
  return (
    <div className="card mb-4 flex items-start gap-3 !p-3">
      <Download className="mt-0.5 shrink-0 text-brand" size={20} />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold">Instale o Fluxo no seu celular</p>
        {canInstall
          ? <p className="text-muted">Abre em tela cheia, como um app, direto da tela inicial.</p>
          : <p className="text-muted">Toque em <Share size={14} className="inline align-text-bottom" /> Compartilhar e depois em <b>Adicionar à Tela de Início</b>.</p>}
        {canInstall && <button className="btn-primary mt-2 !py-1.5" onClick={install}>Instalar app</button>}
      </div>
      <button aria-label="Dispensar" className="rounded-lg p-1 text-muted hover:bg-line/50" onClick={dismiss}><X size={18} /></button>
    </div>
  )
}

/** Versão fixa para a tela de Configurações (sempre visível enquanto o app não estiver instalado). */
export function InstallCard() {
  const { canInstall, isIOS, standalone, install } = usePwa()
  if (standalone) return <p className="text-sm text-muted">O Fluxo já está instalado neste aparelho.</p>
  if (canInstall) return <button className="btn-primary" onClick={install}><Download size={16} />Instalar app</button>
  if (isIOS) return <p className="text-sm text-muted">No iPhone/iPad: abra no Safari, toque em Compartilhar e escolha <b>Adicionar à Tela de Início</b>.</p>
  return <p className="text-sm text-muted">Para instalar, use o menu do navegador (Chrome ou Edge: “Instalar app”). Se a opção não aparecer, o navegador não oferece instalação.</p>
}
