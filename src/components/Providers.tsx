'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '../hooks/useAuth'
import { PwaProvider } from '../hooks/usePwa'
import { ThemeProvider } from '../hooks/useTheme'
import { StatusBanners } from './PwaUi'
import { configured } from '../lib/supabase'

function Setup() {
  return <div className="mx-auto max-w-lg p-8"><h1 className="font-display text-2xl font-bold">Configure o Supabase</h1><p className="mt-2 text-sm text-muted">Crie o arquivo <code>.env.local</code> a partir do <code>.env.example</code>, preencha <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> e reinicie o servidor.</p></div>
}
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PwaProvider>
        {configured ? <AuthProvider>{children}</AuthProvider> : <Setup />}
        <StatusBanners />
      </PwaProvider>
    </ThemeProvider>
  )
}
