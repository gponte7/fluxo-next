/* Service worker do Fluxo.
 * Regras de privacidade: dados financeiros e páginas autenticadas NUNCA vão para o cache.
 * Só são guardados arquivos estáticos (JS/CSS versionados, ícones, fontes) e a tela de "offline". */
const VERSION = 'v1'
const STATIC = `fluxo-static-${VERSION}`
const RUNTIME = `fluxo-runtime-${VERSION}`
const PRECACHE = ['/offline', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC).then((c) => c.addAll(PRECACHE)))
})
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keep = [STATIC, RUNTIME]
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k)
    await self.clients.claim()
  })())
})
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting() })

const cacheFirst = async (req, name) => {
  const hit = await caches.match(req); if (hit) return hit
  const res = await fetch(req)
  if (res.ok) (await caches.open(name)).put(req, res.clone())
  return res
}
const staleWhileRevalidate = async (req, name) => {
  const cache = await caches.open(name); const hit = await cache.match(req)
  const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res }).catch(() => hit)
  return hit || net
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return e.respondWith(staleWhileRevalidate(req, RUNTIME))
  if (url.origin !== self.location.origin) return // Supabase e demais APIs: sempre direto na rede
  if (url.pathname.startsWith('/_next/static/')) return e.respondWith(cacheFirst(req, STATIC))
  if (url.pathname.startsWith('/icons/')) return e.respondWith(staleWhileRevalidate(req, STATIC))
  if (req.mode === 'navigate') {
    return e.respondWith(fetch(req).catch(async () => (await caches.match('/offline')) || Response.error()))
  }
})
