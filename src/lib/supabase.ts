import { createBrowserClient } from '@supabase/ssr'
import { supabaseEnv } from './env'

const { url, key } = supabaseEnv()
export const configured = Boolean(url && key)
// Cliente do navegador: guarda a sessão em cookies, que o proxy.ts lê no servidor para proteger as rotas.
export const supabase = createBrowserClient(url || 'http://localhost:54321', key || 'chave-nao-configurada')
