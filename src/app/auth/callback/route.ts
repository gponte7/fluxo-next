import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseEnv } from '@/lib/env'

// Destino dos links enviados por e-mail (confirmar conta, redefinir senha, trocar e-mail).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/') || next.startsWith('//')) next = '/' // evita redirecionar para site externo
  const { url, key } = supabaseEnv()
  if (code && url && key) {
    const store = await cookies()
    const supabase = createServerClient(url, key, {
      cookies: { getAll: () => store.getAll(), setAll: (list) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)) } catch { /* ignora */ } } },
    })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }
  return NextResponse.redirect(`${origin}/entrar?erro=link`)
}
