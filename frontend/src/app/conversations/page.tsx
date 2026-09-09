'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Conversation {
  id: number
  title: string
  created_at: string
}

function ConversationsContent() {
  const { token, user, logout } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading]             = useState(true)
  const [creating, setCreating]           = useState(false)
  const [newTitle, setNewTitle]           = useState('')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    fetch(`${API}/api/v1/conversations`, { headers })
      .then((r) => r.json())
      .then(setConversations)
      .finally(() => setLoading(false))
  }, [token])

  const createConversation = async () => {
    const title = newTitle.trim() || 'New Conversation'
    setCreating(true)
    const res  = await fetch(`${API}/api/v1/conversations`, {
      method: 'POST', headers,
      body: JSON.stringify({ title }),
    })
    const conv = await res.json()
    setConversations((prev) => [conv, ...prev])
    setNewTitle('')
    setCreating(false)
    window.location.href = `/chat/${conv.id}`
  }

  const deleteConversation = async (id: number) => {
    if (!confirm('Delete this conversation?')) return
    await fetch(`${API}/api/v1/conversations/${id}`, { method: 'DELETE', headers })
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-kelana-light">
      {/* Navbar */}
      <nav className="bg-kelana-dark sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="text-white font-bold text-xl">Kelana<span className="text-kelana-gold">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
            <span className="text-gray-300 text-sm hidden sm:block">👋 {user?.name}</span>
            <button onClick={logout} className="text-gray-400 hover:text-red-400 text-sm">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-kelana-dark mb-2">💬 Travel Assistant</h1>
          <p className="text-gray-500">Chat with KelanaAI about your travel plans. Every conversation is remembered.</p>
        </div>

        {/* New conversation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-kelana-dark mb-3">Start a New Conversation</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Planning Japan trip in December..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createConversation()}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kelana-sky"
            />
            <button
              onClick={createConversation}
              disabled={creating}
              className="bg-kelana-gold text-kelana-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-400 transition-all text-sm disabled:opacity-60"
            >
              {creating ? '...' : '+ New Chat'}
            </button>
          </div>
        </div>

        {/* Conversation list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-kelana-sky" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl mb-4 block">💬</span>
            <p className="font-medium text-gray-500">No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat above!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {conversations.map((conv) => (
              <div key={conv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between group hover:shadow-md transition-all">
                <Link href={`/chat/${conv.id}`} className="flex-1 min-w-0">
                  <p className="font-semibold text-kelana-dark truncate">{conv.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(conv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Link>
                <div className="flex items-center gap-2 ml-3">
                  <Link href={`/chat/${conv.id}`} className="bg-kelana-light text-kelana-blue text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-kelana-sky hover:text-white transition-all">
                    Open →
                  </Link>
                  <button onClick={() => deleteConversation(conv.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ConversationsPage() {
  return <ProtectedRoute><ConversationsContent /></ProtectedRoute>
}
