/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Para testar no celular em `npm run dev`: DEV_ORIGINS=192.168.0.10 no .env.local (separe vários por vírgula).
  allowedDevOrigins: (process.env.DEV_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  async headers() {
    return [
      {
        // O service worker nunca pode ficar em cache, senão as atualizações do app não chegam.
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}
export default nextConfig
