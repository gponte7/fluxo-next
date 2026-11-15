// Limpa erros comuns no .env: aspas, espaços, "/" no final e caminhos como /rest/v1.
const clean = (v?: string) => v?.trim().replace(/^["']|["']$/g, '').trim()
export function supabaseEnv() {
  let url: string | undefined
  try { const raw = clean(process.env.NEXT_PUBLIC_SUPABASE_URL); url = raw ? new URL(raw).origin : undefined } catch { url = undefined }
  const key = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return { url, key }
}
