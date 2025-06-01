import { Suspense } from 'react'
import Home from '../pages/Home'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  )
}