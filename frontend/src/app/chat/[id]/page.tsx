'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: number
  title: string
  created_at: string
}

// ── Typing Indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-kelana-blue flex items-center justify-center text-white text-sm flex-shrink-0">
        ✦
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-kelana-sky rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-kelana-sky rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-kelana-sky rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">KelanaAI is thinking...</p>
      </div>
    </div>
  )
}

// ── Message Bubble ─────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time   = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })
  const date = new Date(message.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
        isUser ? 'bg-kelana-gold text-kelana-dark font-bold' : 'bg-kelana-blue text-white'
      }`}>
        {isUser ? '👤' : '✦'}
      </div>

      {/* Bubble + timestamp */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-kelana-blue text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-kelana-dark rounded-bl-sm'
        }`}>
          {message.content}
        </div>
        {/* Timestamp */}
        <p className="text-xs text-gray-400 mt-1 px-1">
          {date} · {time}
        </p>
      </div>
    </div>
  )
}

// ── Chat Content ──────────────────────────────────────────────────────────────
function ChatContent({ convId }: { convId: string }) {
  const { token, logout } = useAuth()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages,     setMessages]     = useState<Message[]>([])
  const [input,        setInput]        = useState('')
  const [sending,      setSending]      = useState(false)
  const [loading,      setLoading]      = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Load conversation + messages
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/v1/conversations/${convId}`, { headers }).then((r) => r.json()),
      fetch(`${API}/api/v1/conversations/${convId}/messages`, { headers }).then((r) => r.json()),
    ]).then(([conv, msgs]) => {
      setConversation(conv)
      setMessages(Array.isArray(msgs) ? msgs : [])
      setLoading(false)
    })
  }, [convId, token])

  // Auto-scroll when messages load or change
  useEffect(() => {
    if (!loading) scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || sending) return

    setInput('')
    setSending(true)

    // Optimistic user message
    const tempUserMsg: Message = {
      id: Date.now(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempUserMsg])
    scrollToBottom()

    try {
      const res  = await fetch(`${API}/api/v1/conversations/${convId}/messages`, {
        method: 'POST', headers,
        body: JSON.stringify({ content }),
      })
      const data = await res.json()

      // Replace temp message + add AI response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        data.user_message,
        data.assistant_message,
      ])
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id))
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kelana-light">
        <svg className="animate-spin h-10 w-10 text-kelana-sky" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-kelana-light">
      {/* ── Header with conversation title ── */}
      <header className="bg-kelana-dark shadow-lg flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/conversations" className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
              ← Back
            </Link>
            <div className="min-w-0">
              {/* Conversation title */}
              <p className="text-white font-semibold truncate text-sm sm:text-base">
                {conversation?.title || 'Conversation'}
              </p>
              <p className="text-gray-400 text-xs">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-xl">✈️</span>
              <span className="text-white font-bold hidden sm:block">
                Kelana<span className="text-kelana-gold">AI</span>
              </span>
            </Link>
            <button onClick={logout} className="text-gray-400 hover:text-red-400 text-xs transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="text-6xl mb-4">✈️</span>
              <p className="font-medium text-gray-500 text-lg mb-1">Start your conversation</p>
              <p className="text-sm text-center max-w-xs">
                Ask KelanaAI anything about travel — destinations, itineraries, budgets, visa requirements, and more!
              </p>
              <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
                {[
                  '🇯🇵 Plan a 5-day trip to Japan under $2000',
                  '🏖️ Best beaches in Bali for families',
                  '🛂 Do Indonesians need a visa for Japan?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-left text-sm bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-kelana-light hover:border-kelana-sky transition-all text-kelana-dark"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {/* Typing indicator */}
              {sending && <TypingIndicator />}
            </>
          )}
          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask KelanaAI about your travel plans... (Enter to send, Shift+Enter for new line)"
              rows={1}
              disabled={sending}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-kelana-sky resize-none disabled:opacity-60 max-h-32 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = Math.min(t.scrollHeight, 128) + 'px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="bg-kelana-blue text-white p-3 rounded-xl hover:bg-kelana-sky transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {sending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            KelanaAI remembers your full conversation history ✦
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ProtectedRoute><ChatContent convId={params.id} /></ProtectedRoute>
}
