'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useUI } from '../hooks/useUI'

/** Atalho do ícone do app ("Nova movimentação" = /?nova=1): abre o formulário e limpa o endereço. */
export default function QuickActions() {
  const sp = useSearchParams(); const router = useRouter(); const pathname = usePathname(); const { newTx } = useUI()
  useEffect(() => { if (sp.get('nova') === '1') { newTx(); router.replace(pathname) } }, [sp, pathname, router, newTx])
  return null
}
