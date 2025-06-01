import { Suspense } from 'react'
import Cinema from '../../pages/Cinema'

export const dynamic = 'force-dynamic'

export default function CinemaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Cinema />
    </Suspense>
  )
}