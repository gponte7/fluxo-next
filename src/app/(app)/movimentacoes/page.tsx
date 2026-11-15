import { Suspense } from 'react'
import type { Metadata } from 'next'
import Transactions from '@/screens/Transactions'

export const metadata: Metadata = { title: 'Movimentações' }
export default function Page() { return <Suspense fallback={null}><Transactions /></Suspense> }
