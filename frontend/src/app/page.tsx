'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

// ── Types ─────────────────────────────────────────────────────────────────────
interface TripResult {
  id: number
  destination: string
  days: number
  budget: number
  daily_budget: number
  category: string
  ai_recommendation?: string
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="bg-kelana-dark/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-white font-bold text-xl tracking-tight">
              Kelana<span className="text-kelana-gold">AI</span>
            </span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#plan" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Plan Trip</a>
            <a href="#features" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Features</a>
            <a href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Dashboard</a>
            <a href="#footer" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">About</a>
          </div>
          <a href="#plan" className="btn-primary text-sm py-2 px-4">
            Start Planning →
          </a>
        </div>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80"
          alt="Japan travel destination — torii gates at sunset"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-kelana-dark/60 via-kelana-dark/40 to-kelana-dark/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-kelana-gold/20 border border-kelana-gold/40 text-kelana-gold text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          <span>✦</span> Powered by Amazon Bedrock AI
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Plan Your Dream Trip
          <span className="block text-kelana-gold">with AI</span>
        </h1>
        <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          KelanaAI generates personalized day-by-day itineraries tailored to your destination, budget, and travel style — in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#plan" className="btn-primary">
            🗺️ Plan My Trip
          </a>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Trip Planner Form ─────────────────────────────────────────────────────────
function TripPlannerForm() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    destination: '',
    days: '',
    budget: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TripResult | null>(null)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const token = localStorage.getItem('kelana_token')
    if (!token) {
      setError('Please login first to plan a trip.')
      setLoading(false)
      window.location.href = '/login'
      return
    }

    try {
      const tripRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/trips`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination: form.destination,
          days: parseInt(form.days),
          budget: parseFloat(form.budget),
        }),
      })

      if (!tripRes.ok) throw new Error('Failed to create trip')
      const trip: TripResult = await tripRes.json()

      const genRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/trips/${trip.id}/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!genRes.ok) throw new Error('Failed to generate AI recommendation')
      const generated: TripResult = await genRes.json()
      setResult(generated)
    } catch (err) {
      setError('Something went wrong. Make sure you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="plan" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-kelana-dark mb-3">
            Plan Your Trip
          </h2>
          <p className="text-gray-500 text-lg">
            Fill in the details and let AI build your itinerary
          </p>
        </div>

        {/* Form card */}
        <div className="card shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Destination */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-semibold text-kelana-dark mb-1.5">
                  🌏 Destination
                </label>
                <input
                  name="destination"
                  type="text"
                  placeholder="e.g. Japan, Bali, Paris..."
                  value={form.destination}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Days */}
              <div>
                <label className="block text-sm font-semibold text-kelana-dark mb-1.5">
                  📅 Days
                </label>
                <input
                  name="days"
                  type="number"
                  placeholder="5"
                  min="1"
                  max="30"
                  value={form.days}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Budget */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-kelana-dark mb-1.5">
                  💰 Budget (USD)
                </label>
                <input
                  name="budget"
                  type="number"
                  placeholder="2000"
                  min="100"
                  value={form.budget}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generating AI Itinerary...
                </span>
              ) : '✦ Generate AI Itinerary'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 card shadow-lg border-l-4 border-kelana-sky">
            {/* Trip summary */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: '📍 Destination', value: result.destination },
                { label: '📅 Days', value: `${result.days} days` },
                { label: '💰 Budget', value: `$${result.budget.toLocaleString()}` },
                { label: '📊 Category', value: result.category },
                { label: '💵 Daily Budget', value: `$${result.daily_budget.toLocaleString()}/day` },
              ].map((item) => (
                <div key={item.label} className="bg-kelana-light rounded-lg px-4 py-2 text-sm">
                  <span className="text-gray-500">{item.label}: </span>
                  <span className="font-semibold text-kelana-dark">{item.value}</span>
                </div>
              ))}
            </div>

            {/* AI Recommendation */}
            {result.ai_recommendation && (
              <div>
                <h3 className="text-lg font-bold text-kelana-dark mb-4 flex items-center gap-2">
                  <span className="text-kelana-gold">✦</span> AI-Generated Itinerary
                </h3>
                <div className="bg-kelana-light rounded-xl p-5 prose prose-sm max-w-none text-kelana-dark leading-relaxed whitespace-pre-wrap text-sm">
                  {result.ai_recommendation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Planning',
      desc: 'Amazon Bedrock Nova Lite generates personalized itineraries based on your unique preferences and budget.',
    },
    {
      icon: '📅',
      title: 'Day-by-Day Itinerary',
      desc: 'Get a detailed schedule for every day — morning activities, cultural sites, dinner spots, and nightlife.',
    },
    {
      icon: '💰',
      title: 'Budget Smart',
      desc: 'Automatically categorized as Backpacker, Standard, or Luxury — with daily budget breakdown included.',
    },
    {
      icon: '🌍',
      title: 'Any Destination',
      desc: 'From Japan to Bali, Paris to Madura — KelanaAI handles any destination around the world.',
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      desc: 'Generate a complete travel plan in seconds. No waiting, no searching, just planning.',
    },
    {
      icon: '💾',
      title: 'Saved to Database',
      desc: 'Your AI itineraries are stored in PostgreSQL so you can always revisit and reference them.',
    },
  ]

  return (
    <section id="features" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-kelana-dark mb-3">
            Why KelanaAI?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything you need to plan the perfect trip, powered by generative AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-md transition-shadow duration-200 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {f.icon}
              </div>
              <h3 className="font-bold text-kelana-dark text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="footer" className="bg-kelana-dark text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✈️</span>
              <span className="text-white font-bold text-xl">
                Kelana<span className="text-kelana-gold">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Smart travel planning powered by Amazon Bedrock and generative AI. Built with Python, FastAPI & Next.js.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#plan" className="hover:text-kelana-gold transition-colors">Plan a Trip</a></li>
              <li><a href="#features" className="hover:text-kelana-gold transition-colors">Features</a></li>
              <li><a href="/dashboard" className="hover:text-kelana-gold transition-colors">Trip Dashboard</a></li>
              <li><a href="https://kelanaai11.onrender.com/docs" target="_blank" className="hover:text-kelana-gold transition-colors">API Docs</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-sm">
              <li>☁️ Amazon Bedrock (Nova Lite)</li>
              <li>🐍 Python + FastAPI</li>
              <li>🗄️ PostgreSQL + SQLAlchemy</li>
              <li>⚛️ Next.js + Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p>© 2026 KelanaAI. Built for MAIN Phase 2 — Alkademi.</p>
          <div className="flex gap-4">
            <a href="https://github.com/husyenalijaber" target="_blank" className="hover:text-kelana-gold transition-colors">
              GitHub
            </a>
            <a href="https://kelanaai11.onrender.com/docs" target="_blank" className="hover:text-kelana-gold transition-colors">
              API
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TripPlannerForm />
        <Features />
      </main>
      <Footer />
    </>
  )
}
