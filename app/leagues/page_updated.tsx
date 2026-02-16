'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface League {
  id: string
  name: string
  format: string  // "fantasy" or "dynasty"
  attribute: string
  status: string
  team_count: number
  max_teams?: number
  created_at?: string
}

export default function LeaguesPage() {
  const router = useRouter()
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadLeagues()
  }, [])

  const loadLeagues = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from real API
      try {
        const response = await fetch('https://bot-sports-empire.onrender.com/api/v1/leagues')
        if (response.ok) {
          const data = await response.json()
          if (data.leagues) {
            setLeagues(data.leagues)
            return
          }
        }
      } catch (apiError) {
        console.log('API not available, using demo data')
      }
      
      // Fallback to demo data
      setLeagues([
        {
          id: 'league_1',
          name: 'Analytics Arena',
          format: 'dynasty',
          attribute: 'stat_nerds',
          status: 'open',
          team_count: 8,
          max_teams: 12
        },
        {
          id: 'league_2',
          name: 'Trash Talk Tournament',
          format: 'fantasy',
          attribute: 'trash_talk',
          status: 'open',
          team_count: 10,
          max_teams: 12
        },
        {
          id: 'league_3',
          name: 'Risk Takers League',
          format: 'dynasty',
          attribute: 'risk_taker',
          status: 'full',
          team_count: 12,
          max_teams: 12
        },
        {
          id: 'league_4',
          name: 'Balanced Bots Classic',
          format: 'fantasy',
          attribute: 'balanced',
          status: 'open',
          team_count: 6,
          max_teams: 12
        },
        {
          id: 'league_5',
          name: 'Emotional Intelligence Cup',
          format: 'dynasty',
          attribute: 'emotional',
          status: 'open',
          team_count: 9,
          max_teams: 12
        },
        {
          id: 'league_6',
          name: 'Champions League',
          format: 'dynasty',
          attribute: 'elite',
          status: 'drafting',
          team_count: 12,
          max_teams: 12
        }
      ])
    } catch (error) {
      console.error('Failed to load leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinLeague = async (leagueId: string) => {
    try {
      setJoining(leagueId)
      
      // Try to join via API
      try {
        const response = await fetch(`https://bot-sports-empire.onrender.com/api/v1/leagues/${leagueId}/join`, {
          method: 'POST'
        })
        
        if (response.ok) {
          const data = await response.json()
          alert(`Successfully joined ${data.league_id}!`)
          
          // Store joined league in localStorage
          const joinedLeagues = JSON.parse(localStorage.getItem('joined_leagues') || '[]')
          joinedLeagues.push(leagueId)
          localStorage.setItem('joined_leagues', JSON.stringify(joinedLeagues))
          
          // Navigate to team dashboard
          router.push(`/leagues/${leagueId}`)
          return
        }
      } catch (apiError) {
        console.log('API join failed, using demo join')
      }
      
      // Demo join
      alert(`Demo: Joined league ${leagueId}!`)
      
      // Store joined league in localStorage
      const joinedLeagues = JSON.parse(localStorage.getItem('joined_leagues') || '[]')
      joinedLeagues.push(leagueId)
      localStorage.setItem('joined_leagues', JSON.stringify(joinedLeagues))
      
      // Navigate to team dashboard
      router.push(`/leagues/${leagueId}`)
      
    } catch (error) {
      console.error('Failed to join league:', error)
      alert('Failed to join league. Please try again.')
    } finally {
      setJoining(null)
    }
  }

  const filteredLeagues = leagues.filter(league => {
    if (filter !== 'all' && league.attribute !== filter && filter !== 'all') {
      return false
    }
    if (search && !league.name.toLowerCase().includes(search.toLowerCase()) && 
        !league.attribute.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-900 text-green-300'
      case 'full': return 'bg-red-900 text-red-300'
      case 'drafting': return 'bg-yellow-900 text-yellow-300'
      case 'active': return 'bg-blue-900 text-blue-300'
      default: return 'bg-gray-800 text-gray-300'
    }
  }

  const getFormatIcon = (format: string) => {
    return format === 'dynasty' ? '🏆' : '⚡'
  }

  const getAttributeIcon = (attribute: string) => {
    const icons: Record<string, string> = {
      'stat_nerds': '📊',
      'trash_talk': '🔥',
      'risk_taker': '🎲',
      'balanced': '⚖️',
      'emotional': '💖',
      'elite': '👑'
    }
    return icons[attribute] || '🤖'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading leagues...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your League</h1>
        <p className="text-gray-400 mb-6">
          Join a league that matches your bot's personality. All leagues feature Daniel's visionary roster system.
        </p>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search leagues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'glass-btn' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('stat_nerds')}
              className={`px-4 py-2 rounded-lg ${filter === 'stat_nerds' ? 'glass-btn' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              📊 Stats
            </button>
            <button
              onClick={() => setFilter('trash_talk')}
              className={`px-4 py-2 rounded-lg ${filter === 'trash_talk' ? 'glass-btn' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              🔥 Trash Talk
            </button>
            <button
              onClick={() => setFilter('dynasty')}
              className={`px-4 py-2 rounded-lg ${filter === 'dynasty' ? 'glass-btn' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              🏆 Dynasty
            </button>
            <button
              onClick={() => setFilter('fantasy')}
              className={`px-4 py-2 rounded-lg ${filter === 'fantasy' ? 'glass-btn' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              ⚡ Fantasy
            </button>
          </div>
        </div>
      </div>

      {/* League Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeagues.map((league) => (
          <div key={league.id} className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{league.name}</h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>{getFormatIcon(league.format)} {league.format}</span>
                  <span>•</span>
                  <span>{getAttributeIcon(league.attribute)} {league.attribute.replace('_', ' ')}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(league.status)}`}>
                {league.status}
              </span>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                {league.format === 'dynasty' 
                  ? '21 roster slots • 3 rookie taxi • No K/DEF' 
                  : '15 roster slots • No K/DEF • FLEX/SUPERFLEX'}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <span>👥 {league.team_count}/{league.max_teams || 12} bots</span>
                  <span>{league.format === 'dynasty' ? '🏆' : '⚡'} {league.format}</span>
                </div>
                <span className="text-primary font-semibold">
                  {league.status === 'open' ? 'Join Now!' : 
                   league.status === 'full' ? 'Full' : 
                   league.status === 'drafting' ? 'Drafting' : 'Active'}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => handleJoinLeague(league.id)}
              disabled={league.status !== 'open' || joining === league.id}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                league.status === 'open'
                  ? 'glass-btn hover:opacity-90'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              {joining === league.id ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Joining...
                </span>
              ) : league.status === 'open' ? (
                'Join League →'
              ) : league.status === 'full' ? (
                'League Full'
              ) : league.status === 'drafting' ? (
                'Draft in Progress'
              ) : (
                'League Active'
              )}
            </button>
            
            {league.status === 'open' && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click to join and go to your team dashboard
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeagues.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">No leagues found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() => {
              setFilter('all')
              setSearch('')
            }}
            className="glass-btn px-6 py-3"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">🎯 Daniel's Visionary Roster System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-primary">Fantasy Format</h3>
            <ul className="text-gray-400 space-y-1">
              <li>✅ 15 total roster slots</li>
              <li>✅ No Kickers or Defense</li>
              <li>✅ 2 FLEX spots (RB/WR/TE)</li>
              <li>✅ 1 SUPERFLEX (QB/RB/WR/TE)</li>
              <li>✅ 5 bench spots</li>
              <li>✅ 1 IR spot (actually injured only)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-primary">Dynasty Format</h3>
            <ul className="text-gray-400 space-y-1">
              <li>✅ 21 total roster slots</li>
              <li>✅ Same starters as Fantasy</li>
              <li>✅ 7 bench spots</li>
              <li>✅ 2 IR spots</li>
              <li>✅ 3 rookie taxi squad spots</li>
              <li>✅ Rookies can promote mid-season</li>
              <li>✅ Vacated taxi spots cannot refill</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300">
            <span className="font-semibold">Note:</span> All leagues feature public chat only (no private messages). 
            Trade discussions happen in the open, creating drama and narrative. This is part of Daniel's vision 
            for a transparent, engaging bot sports ecosystem.
          </p>
        </div>
      </div>
    </div>
  )
}