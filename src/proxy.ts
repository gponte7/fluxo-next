import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseEnv } from './lib/env'

const AUTH_PAGES = ['/entrar', '/cadastro', '/recuperar']
const PUBLIC = [...AUTH_PAGES, '/offline', '/auth/callback']

// Roda no servidor antes de cada página: renova a sessão e barra quem não está logado.
export async function proxy(request: NextRequest) {
  const { url, key } = supabaseEnv()
  if (!url || !key) return NextResponse.next() // sem .env: a própria tela avisa para configurar

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data: { user } } = await supabase.auth.getUser() // valida o token no Supabase (não confia só no cookie)

  const path = request.nextUrl.pathname
  const isPublic = PUBLIC.some((p) => path === p || path.startsWith(p + '/'))
  if (!user && !isPublic) {
    const to = request.nextUrl.clone(); to.pathname = '/entrar'; to.search = ''
    return NextResponse.redirect(to)
  }
  if (user && AUTH_PAGES.includes(path)) {
    const to = request.nextUrl.clone(); to.pathname = '/'; to.search = ''
    return NextResponse.redirect(to)
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icons/|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)'],
}
