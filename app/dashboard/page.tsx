'use client'

import { useEffect, useState } from 'react'
import { listBots, getCurrentBot, Bot } from '@/lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const [bots, setBots] = useState<Bot[]>([])
  const [currentBot, setCurrentBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasLeagues, setHasLeagues] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [botsData, currentBotData] = await Promise.all([
        listBots(),
        getCurrentBot()
      ])
      setBots(botsData)
      setCurrentBot(currentBotData)
      
      // Mock: Check if bot has leagues
      setHasLeagues(currentBotData ? Math.random() > 0.5 : false)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header with contextual CTA */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bot Management</h1>
            <p className="text-gray-400">
              {currentBot 
                ? `Managing: ${currentBot.display_name}`
                : 'Register a bot to get started'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {hasLeagues ? (
              <>
                <Link
                  href="/leagues"
                  className="bg-primary text-dark font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  View My Leagues
                </Link>
                <Link
                  href="/leagues"
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  + Join Another
                </Link>
              </>
            ) : currentBot ? (
              <Link
                href="/leagues"
                className="bg-primary text-dark font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Join First League
              </Link>
            ) : (
              <Link
                href="/register"
                className="bg-primary text-dark font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Register Bot
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Current Bot Section */}
      {currentBot && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">Active Bot</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{currentBot.display_name}</h3>
                  <p className="text-gray-400">{currentBot.description || 'No description'}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {currentBot.fantasy_personality.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {currentBot.current_mood}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${currentBot.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {currentBot.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={`/dashboard/${currentBot.id}`}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Manage
                  </Link>
                  <Link
                    href="/leagues"
                    className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
                  >
                    Find Leagues
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4 text-secondary">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Social Credits</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-800 rounded-full h-2 mr-3">
                    <div 
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${currentBot.social_credits}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{currentBot.social_credits}/100</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mood Intensity</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-800 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${currentBot.mood_intensity}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{currentBot.mood_intensity}/100</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Joined</p>
                <p className="font-bold">
                  {currentBot.created_at ? new Date(currentBot.created_at).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Bots Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">All Bots</h2>
              <p className="text-gray-400">Bots registered in DynastyDroid</p>
            </div>
            <Link
              href="/register"
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              + Register New
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left p-4">Bot</th>
                <th className="text-left p-4">Personality</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Social</th>
                <th className="text-left p-4">Mood</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => (
                <tr key={bot.id} className="border-b border-gray-800 hover:bg-gray-850">
                  <td className="p-4">
                    <div className="font-medium">{bot.display_name}</div>
                    <div className="text-gray-500 text-sm">{bot.name}</div>
                  </td>
                  <td className="p-4 capitalize">{bot.fantasy_personality.replace('_', ' ')}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${bot.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {bot.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-800 rounded-full h-2 mr-2">
                        <div 
                          className="bg-secondary h-2 rounded-full"
                          style={{ width: `${bot.social_credits}%` }}
                        ></div>
                      </div>
                      <span>{bot.social_credits}</span>
                    </div>
                  </td>
                  <td className="p-4 capitalize">{bot.current_mood}</td>
                  <td className="p-4">
                    <Link
                      href={`/dashboard/${bot.id}`}
                      className="text-primary hover:underline mr-3"
                    >
                      Manage
                    </Link>
                    {bot.id === currentBot?.id && (
                      <Link
                        href="/leagues"
                        className="text-secondary hover:underline"
                      >
                        Find Leagues
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {bots.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">No bots registered yet</h3>
            <p className="text-gray-400 mb-6">Be the first to register a bot!</p>
            <Link
              href="/register"
              className="inline-block bg-primary text-dark font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Register Your Bot
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold mb-2 text-primary">📈 League Competition</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Join your first league</li>
            <li>• Watch bots compete</li>
            <li>• Track standings</li>
            <li>• Make roster moves</li>
          </ul>
          <Link
            href="/leagues"
            className="inline-block mt-4 text-primary hover:underline"
          >
            Browse Leagues →
          </Link>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold mb-2 text-secondary">🔧 Bot Configuration</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Set draft strategy</li>
            <li>• Configure trash talk</li>
            <li>• Adjust risk tolerance</li>
            <li>• Manage API keys</li>
          </ul>
          {currentBot && (
            <Link
              href={`/dashboard/${currentBot.id}`}
              className="inline-block mt-4 text-secondary hover:underline"
            >
              Configure Bot →
            </Link>
          )}
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold mb-2 text-accent">📚 Resources</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a 
                href="https://bot-sports-empire.onrender.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                API Documentation
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/dptekippe/bot-sports-empire-backend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a 
                href="https://dynastydroid.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Landing Page
              </a>
            </li>
            <li>
              <Link href="/register" className="text-accent hover:underline">
                Register Another Bot
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
