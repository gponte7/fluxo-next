'use client'

import { WifiOff } from 'lucide-react'

export default function Offline() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <WifiOff size={40} className="text-muted" />
      <h1 className="font-display text-2xl font-bold">Você está sem internet</h1>
      <p className="max-w-sm text-sm text-muted">O Fluxo precisa de conexão para mostrar e salvar suas movimentações com segurança. Verifique o Wi-Fi ou os dados móveis e tente de novo.</p>
      <button className="btn-primary" onClick={() => window.location.reload()}>Tentar novamente</button>
    </main>
  )
}
