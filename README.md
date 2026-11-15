# Fluxo — organização financeira pessoal (Next.js + PWA)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 3 · Supabase (Auth + Postgres + RLS) · React Hook Form + Zod · Recharts · Lucide.

## Como rodar
1. No Supabase, rode `supabase/schema.sql` no SQL Editor (se já tinha o banco do Fluxo anterior, ele continua igual — não precisa rodar de novo).
2. Em **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback` (e a mesma rota no domínio de produção)
3. `cp .env.example .env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. `npm install` e `npm run dev` (http://localhost:3000).

> Os links dos e-mails (confirmar conta, recuperar senha, trocar e-mail) agora passam por `/auth/callback`.
> Abra o link no **mesmo navegador** em que pediu (o login usa PKCE).

## Testar no celular (npm run dev)
1. Celular e computador na **mesma rede Wi-Fi**.
2. Descubra o IP do computador: Windows `ipconfig` (Endereço IPv4), Mac/Linux `ifconfig` ou `ip addr` (ex.: `192.168.0.10`).
3. Em `.env.local` adicione `DEV_ORIGINS=192.168.0.10` e reinicie o `npm run dev` (sem isso o Next 16 bloqueia os arquivos e a tela fica sem funcionar).
4. No celular, abra `http://192.168.0.10:3000`.
5. Para testar **instalação, offline e atualização do PWA** é preciso HTTPS: use um túnel (`npx cloudflared tunnel --url http://localhost:3000`) ou a depuração USB do Chrome com redirecionamento de porta, e rode `npm run build && npm start` (o service worker só existe em produção).

## O que mudou em relação à versão Vite
- Rotas protegidas **no servidor** (`src/proxy.ts`): quem não está logado nem chega a ver a tela. O RLS continua sendo a garantia final.
- Sessão em cookies (`@supabase/ssr`) em vez de localStorage.
- Telas ficam em `src/screens`, rotas em `src/app`. Variáveis de ambiente agora são `NEXT_PUBLIC_*`.

## PWA (instalável no celular)
| Peça | Onde |
|---|---|
| Manifest (nome, cores, ícones, atalhos) | `src/app/manifest.ts` |
| Service worker | `public/sw.js` (registrado só em produção, por `src/hooks/usePwa.tsx`) |
| Tela offline | `src/app/offline/page.tsx` |
| Ícones (any, maskable, Apple) | `public/icons/` |
| Convite de instalação, aviso offline, aviso de nova versão | `src/components/PwaUi.tsx` |
| Cabeçalhos do SW e de segurança | `next.config.mjs` |

**Privacidade:** o service worker guarda em cache só arquivos estáticos e a tela offline. Páginas logadas e dados financeiros **nunca** são armazenados no aparelho; sem internet o app mostra a tela offline.

**Atualizações:** ao publicar uma nova versão, o app instalado mostra “Nova versão disponível” e atualiza ao toque. Só altere `VERSION` em `public/sw.js` se mudar a lista de arquivos pré-carregados.

**Testar:** PWA só instala em HTTPS (ou localhost). Rode `npm run build && npm start`, abra no Chrome → DevTools → Application → Manifest / Service Workers, ou use o Lighthouse (categoria PWA). No Android: menu ⋮ → “Instalar app”. No iPhone: Safari → Compartilhar → “Adicionar à Tela de Início”.

**Trocar o ícone:** substitua os PNGs de `public/icons/` mantendo nomes e tamanhos (192, 512, maskable 512 com o desenho dentro dos 60% centrais, e apple-touch-icon 180).

## Deploy na Vercel
Importe o repositório (a Vercel detecta o Next.js). Em Environment Variables adicione as duas `NEXT_PUBLIC_*`, faça o deploy e cadastre `https://SEU-DOMINIO/auth/callback` nas Redirect URLs do Supabase (e o domínio como Site URL).
