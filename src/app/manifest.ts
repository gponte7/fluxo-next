import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Fluxo — Finanças pessoais',
    short_name: 'Fluxo',
    description: 'Organize suas entradas e saídas e acompanhe seu saldo mês a mês.',
    start_url: '/?origem=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f4f6f3',
    theme_color: '#27407f',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['finance', 'productivity'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Nova movimentação', short_name: 'Nova', url: '/?nova=1', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'Movimentações', short_name: 'Lançamentos', url: '/movimentacoes', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'Relatórios', short_name: 'Relatórios', url: '/relatorios', icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }] },
    ],
  }
}
