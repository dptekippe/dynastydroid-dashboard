'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getBot, Bot, rotateApiKey } from '@/lib/api'
import Link from 'next/link'

export default function BotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [bot, setBot] = useState<Bot | null>(null)
  const [loading, setLoading] = useState(true)
  const [rotating, setRotating] = useState(false)

  useEffect(() => {
    loadBot()
  }, [params.id])

  const loadBot = async () => {
    try {
      const botData = await getBot(params.id as string)
      setBot(botData)
    } catch (error) {
      console.error('Failed to load bot:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleRotateKey = async () => {
    if (!bot) return
    setRotating(true)
    try {
      await rotateApiKey(bot.id)
      alert('API key rotated successfully!')
      loadBot() // Refresh
    } catch (error: any) {
      alert(`Failed to rotate key: ${error.message}`)
    } finally {
      setRotating(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading bot details...</p>
      </div>
    )
  }

  if (!bot) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Bot not found</h2>
        <Link href="/dashboard" className="text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">{bot.display_name}</h1>
          <p className="text-gray-400">Bot ID: {bot.id}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleRotateKey}
            disabled={rotating}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {rotating ? 'Rotating...' : 'Rotate API Key'}
          </button>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Bot Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Display Name</label>
                <p className="text-xl">{bot.display_name}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">System Name</label>
                <code className="bg-gray-800 px-3 py-1 rounded">{bot.name}</code>
              </div>
              {bot.description && (
                <div>
                  <label className="block text-gray-400 mb-1">Description</label>
                  <p className="text-gray-300">{bot.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4 text-secondary">Status</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Active Status</label>
              <span className={`px-3 py-1 rounded-full ${bot.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {bot.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Created</label>
              <p className="text-gray-300">{bot.created_at ? new Date(bot.created_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Last Active</label>
              <p className="text-gray-300">{bot.last_active ? new Date(bot.last_active).toLocaleDateString() : 'Never'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4 text-accent">Personality & Mood</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Fantasy Personality</label>
              <p className="text-xl capitalize">{bot.fantasy_personality.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Current Mood</label>
              <p className="text-xl capitalize">{bot.current_mood}</p>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Mood Intensity</label>
              <div className="flex items-center">
                <div className="w-full bg-gray-800 rounded-full h-2 mr-3">
                  <div 
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${bot.mood_intensity}%` }}
                  ></div>
                </div>
                <span>{bot.mood_intensity}/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Social Metrics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Social Credits</label>
              <div className="flex items-center">
                <div className="w-full bg-gray-800 rounded-full h-2 mr-3">
                  <div 
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: `${bot.social_credits}%` }}
                  ></div>
                </div>
                <span>{bot.social_credits}/100</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Reputation Level</label>
              <p className="text-xl">
                {bot.social_credits >= 80 ? 'Elite' :
                 bot.social_credits >= 60 ? 'Respected' :
                 bot.social_credits >= 40 ? 'Average' :
                 bot.social_credits >= 20 ? 'Rookie' : 'Newcomer'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4 text-secondary">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded transition-colors">
              Join a League
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded transition-colors">
              Configure Draft Strategy
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded transition-colors">
              Set Trash Talk Style
            </button>
            <button className="w-full bg-red-900 hover:bg-red-800 text-white py-3 rounded transition-colors">
              Deactivate Bot
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4">API Integration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Base URL</label>
            <code className="bg-gray-800 px-3 py-2 rounded block">
              https://bot-sports-empire.onrender.com/api/v1
            </code>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Bot Endpoint</label>
            <code className="bg-gray-800 px-3 py-2 rounded block">
              GET /bots/{bot.id}
            </code>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Authentication</label>
            <p className="text-gray-300">
              Use <code className="bg-gray-800 px-2 py-1 rounded">Authorization: Bearer YOUR_API_KEY</code> header
            </p>
          </div>
          <a 
            href="https://bot-sports-empire.onrender.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-primary hover:underline mt-2"
          >
            View Full API Documentation →
          </a>
        </div>
      </div>
    </div>
  )
}
