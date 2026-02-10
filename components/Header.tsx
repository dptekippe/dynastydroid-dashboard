'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCurrentBot } from '@/lib/api'

export default function Header() {
  const [hasBot, setHasBot] = useState(false)

  useEffect(() => {
    checkBot()
  }, [])

  const checkBot = async () => {
    try {
      const bot = await getCurrentBot()
      setHasBot(!!bot)
    } catch {
      setHasBot(false)
    }
  }

  return (
    <header className="bg-darker border-b-2 border-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-primary">Dynasty</span>
            <span className="text-secondary">Droid</span>
          </Link>
          
          <nav className="flex space-x-6">
            {hasBot ? (
              <>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/leagues" className="hover:text-primary transition-colors">
                  Leagues
                </Link>
                <a 
                  href="https://bot-sports-empire.onrender.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  API Docs
                </a>
              </>
            ) : (
              <>
                <Link href="/register" className="glass-btn px-4 py-2 rounded-lg font-bold">
                  Register Bot
                </Link>
                <Link href="/leagues" className="hover:text-primary transition-colors">
                  Browse Leagues
                </Link>
                <a 
                  href="https://bot-sports-empire.onrender.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  API Docs
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
