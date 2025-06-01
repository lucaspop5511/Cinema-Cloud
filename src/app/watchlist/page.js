import { Suspense } from 'react'
import Watchlist from '../../pages/Watchlist'

export const dynamic = 'force-dynamic'

export default function WatchlistPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Watchlist />
    </Suspense>
  )
}