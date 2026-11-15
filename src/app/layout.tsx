import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import Providers from '@/components/Providers'

const themeScript = `try{var p=localStorage.getItem('preferencia-tema');if(p==='escuro'||(p!=='claro'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`

export const metadata: Metadata = {
  applicationName: 'Fluxo',
  title: { default: 'Fluxo', template: '%s · Fluxo' },
  description: 'Organize suas entradas e saídas e acompanhe seu saldo mês a mês.',
  appleWebApp: { capable: true, title: 'Fluxo', statusBarStyle: 'default' },
  formatDetection: { telephone: false },
  other: { 'apple-mobile-web-app-capable': 'yes' }, // iOS mais antigo; o Next já emite a versão padrão (mobile-web-app-capable)
  icons: {
    icon: [{ url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' }, { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
}
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f4f6f3' }, { media: '(prefers-color-scheme: dark)', color: '#0f1513' }],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
