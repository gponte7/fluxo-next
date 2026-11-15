import type { Metadata } from 'next'
import { ResetPassword } from '@/screens/Auth'

export const metadata: Metadata = { title: 'Nova senha' }
export default function Page() { return <ResetPassword /> }
