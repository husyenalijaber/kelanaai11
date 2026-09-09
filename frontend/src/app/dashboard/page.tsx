'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import TripCard, { Trip } from '@/components/TripCard'
import Pagination from '@/components/Pagination'

const API      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const PAGE_SIZE = 6

function StatsBar({ trips }: { trips: Trip[] }) {
  const total       = trips.length
  const totalBudget = trips.reduce((s, t) => s + t.budget, 0)
  const withAI      = trips.filter((t) => t.ai_recommendation).length
  const avgDays     = total ? Math.round(trips.reduce((s, t) => s + t.days, 0) / total) : 0
  const stats = [
    { label: 'Total Trips',    value: total,   icon: '✈️' },
    { label: 'AI Itineraries', value: withAI,  icon: '✦'  },
    { label: 'Avg Days/Trip',  value: avgDays, icon: '📅' },
    { label: 'Total Budget',   value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalBudget), icon: '💰' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="text-2xl font-bold text-kelana-dark">{s.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function DashboardContent() {
  const { token, user, logout } = useAuth()
  const [trips,       setTrips]       = useState<Trip[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [generating,  setGenerating]  = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [search,      setSearch]      = useState('')
  const [filter,      setFilter]      = useState('all')

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/v1/trips`, { headers: authHeaders })
      if (!res.ok) throw new Error('Failed to fetch')
      const data: Trip[] = await res.json()
      setTrips(data.reverse())
    } catch {
      setError('Could not load trips. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  const handleGenerate = async (id: number) => {
    setGenerating(id)
    try {
      const res = await fetch(`${API}/api/v1/trips/${id}/generate`, { method: 'POST', headers: authHeaders })
      if (!res.ok) throw new Error()
      const updated: Trip = await res.json()
      setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch { alert('Failed to generate AI itinerary.') }
    finally { setGenerating(null) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(`Delete Trip #${id}?`)) return
    try {
      await fetch(`${API}/api/v1/trips/${id}`, { method: 'DELETE', headers: authHeaders })
      setTrips((prev) => prev.filter((t) => t.id !== id))
    } catch { alert('Failed to delete trip.') }
  }

  const filtered  = trips.filter((t) => filter === 'all' || t.category.toLowerCase() === filter).filter((t) => t.destination.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-kelana-light">
      <nav className="bg-kelana-dark sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-white font-bold text-xl">Kelana<span className="text-kelana-gold">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm hidden sm:block">👋 {user?.name}</span>
            <Link href="/" className="text-gray-300 hover:text-white text-sm transition-colors">+ New Trip</Link>
            <button onClick={logout} className="text-gray-400 hover:text-red-400 text-sm transition-colors">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-kelana-dark mb-2">Trip History Dashboard</h1>
          <p className="text-gray-500">All your AI-planned travel adventures in one place.</p>
        </div>

        {!loading && !error && <StatsBar trips={trips} />}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" placeholder="🔍 Search destination..." value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-kelana-sky" />
          <div className="flex gap-2">
            {['all', 'backpacker', 'standard', 'luxury'].map((f) => (
              <button key={f} onClick={() => { setFilter(f); setCurrentPage(1) }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-kelana-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-kelana-light'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="flex justify-center py-24 text-gray-400"><svg className="animate-spin h-10 w-10 text-kelana-sky" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg></div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">⚠️ {error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center py-24 text-gray-400">
            <span className="text-6xl mb-4">🗺️</span>
            <p className="text-lg font-medium text-gray-500 mb-2">No trips found</p>
            <Link href="/" className="mt-4 bg-kelana-gold text-kelana-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-yellow-400 transition-all">Plan a Trip →</Link>
          </div>
        )}

        {!loading && !error && paginated.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((trip) => (
                <TripCard key={trip.id} trip={trip} onGenerate={handleGenerate} onDelete={handleDelete} generating={generating === trip.id} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <p className="text-center text-xs text-gray-400 mt-3">Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} trips</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>
}
