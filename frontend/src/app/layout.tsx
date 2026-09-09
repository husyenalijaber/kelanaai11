import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'KelanaAI — Smart Travel Planner',
  description: 'AI-powered travel planning with Amazon Bedrock',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-kelana-light">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
