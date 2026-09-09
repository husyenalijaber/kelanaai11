'use client'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Trip {
  id: number
  destination: string
  days: number
  budget: number
  daily_budget: number
  category: string
  ai_recommendation?: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map destination name → flag emoji */
function getDestinationFlag(destination: string): string {
  const map: Record<string, string> = {
    japan: '🇯🇵', indonesia: '🇮🇩', bali: '🇮🇩', jakarta: '🇮🇩',
    france: '🇫🇷', paris: '🇫🇷', italy: '🇮🇹', rome: '🇮🇹',
    thailand: '🇹🇭', bangkok: '🇹🇭', singapore: '🇸🇬',
    malaysia: '🇲🇾', 'kuala lumpur': '🇲🇾',
    usa: '🇺🇸', 'new york': '🇺🇸', 'los angeles': '🇺🇸',
    uk: '🇬🇧', london: '🇬🇧', australia: '🇦🇺', sydney: '🇦🇺',
    korea: '🇰🇷', seoul: '🇰🇷', china: '🇨🇳', dubai: '🇦🇪',
    india: '🇮🇳', madura: '🇮🇩', yogyakarta: '🇮🇩',
    vietnam: '🇻🇳', 'ho chi minh': '🇻🇳', hanoi: '🇻🇳',
    spain: '🇪🇸', barcelona: '🇪🇸', germany: '🇩🇪', berlin: '🇩🇪',
    netherlands: '🇳🇱', amsterdam: '🇳🇱', greece: '🇬🇷', athens: '🇬🇷',
    turkey: '🇹🇷', istanbul: '🇹🇷', egypt: '🇪🇬', cairo: '🇪🇬',
    morocco: '🇲🇦', switzerland: '🇨🇭', portugal: '🇵🇹', lisbon: '🇵🇹',
  }
  const key = destination.toLowerCase()
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v
  }
  return '🌍'
}

/** Category → color classes + label */
function getCategoryStyle(category: string): { bg: string; text: string; border: string } {
  switch (category.toLowerCase()) {
    case 'luxury':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' }
    case 'standard':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' }
    case 'backpacker':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' }
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-300' }
  }
}

/** Infer travel style from budget & days */
function getTravelStyle(budget: number, days: number): { label: string; icon: string } {
  const perDay = budget / days
  if (perDay > 400) return { label: 'Luxury', icon: '👑' }
  if (perDay > 200) return { label: 'Couple', icon: '💑' }
  if (perDay > 100) return { label: 'Family', icon: '👨‍👩‍👧' }
  return { label: 'Solo', icon: '🎒' }
}

/** Format currency */
function formatBudget(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── TripCard Component ────────────────────────────────────────────────────────
interface TripCardProps {
  trip: Trip
  onGenerate?: (id: number) => void
  onDelete?: (id: number) => void
  generating?: boolean
}

export default function TripCard({ trip, onGenerate, onDelete, generating }: TripCardProps) {
  const flag     = getDestinationFlag(trip.destination)
  const catStyle = getCategoryStyle(trip.category)
  const style    = getTravelStyle(trip.budget, trip.days)
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Card header */}
      <div className="bg-gradient-to-r from-kelana-dark to-kelana-blue p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{flag}</span>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">
                {trip.destination}
              </h3>
              <p className="text-gray-300 text-sm mt-0.5">Trip #{trip.id}</p>
            </div>
          </div>
          {/* Category badge */}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {trip.category === 'Luxury' && '💎 '}
            {trip.category === 'Standard' && '⭐ '}
            {trip.category === 'Backpacker' && '🎒 '}
            {trip.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-kelana-light rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">📅 Duration</p>
            <p className="text-kelana-dark font-bold text-sm">{trip.days} Days</p>
          </div>
          <div className="bg-kelana-light rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">💰 Total Budget</p>
            <p className="text-kelana-dark font-bold text-sm">{formatBudget(trip.budget)}</p>
          </div>
          <div className="bg-kelana-light rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">💵 Daily Budget</p>
            <p className="text-kelana-dark font-bold text-sm">{formatBudget(trip.daily_budget)}/day</p>
          </div>
          <div className="bg-kelana-light rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">🧳 Travel Style</p>
            <p className="text-kelana-dark font-bold text-sm">{style.icon} {style.label}</p>
          </div>
        </div>

        {/* AI Recommendation preview */}
        {trip.ai_recommendation ? (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-sm font-semibold text-kelana-blue hover:text-kelana-sky transition-colors py-2 border-t border-gray-100"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-kelana-gold">✦</span> AI Itinerary
              </span>
              <span className="text-xs text-gray-400">{expanded ? '▲ Hide' : '▼ Show'}</span>
            </button>
            {expanded && (
              <div className="mt-2 bg-kelana-light rounded-xl p-4 text-xs text-kelana-dark leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {trip.ai_recommendation}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-400 italic">No AI itinerary yet.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {onGenerate && (
            <button
              onClick={() => onGenerate(trip.id)}
              disabled={generating}
              className="flex-1 bg-kelana-gold text-kelana-dark text-xs font-semibold py-2 px-3 rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '⏳ Generating...' : '✦ Generate AI Plan'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="bg-red-50 text-red-500 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-red-100 transition-all border border-red-100"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Need React for useState
import React from 'react'
