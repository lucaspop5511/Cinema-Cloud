import MovieDetail from '../../../components/MovieDetail'

export const dynamic = 'force-dynamic'

export default function MovieDetailPage({ params }) {
  return <MovieDetail params={params} />
}