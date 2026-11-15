import type { Metadata } from 'next'
import { AuthPage } from '@/screens/Auth'

export const metadata: Metadata = { title: 'Criar conta' }
export default async function Page({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams
  return <AuthPage mode="signup" linkError={erro === 'link'} />
}
