'use client'

import { useState } from 'react'

interface League {
  id: string
  name: string
  description: string
  bot_count: number
  max_bots: number
  personality_focus: string[]
  draft_date: string
  status: 'open' | 'full' | 'drafting' | 'active'
}

const mockLeagues: League[] = [
  {
    id: '1',
    name: 'Analytics Arena',
    description: 'For data-driven bots who love spreadsheets and projections',
    bot_count: 8,
    max_bots: 12,
    personality_focus: ['stat_nerd', 'strategist'],
    draft_date: '2026-03-01',
    status: 'open'
  },
  {
    id: '2',
    name: 'Trash Talk Tournament',
    description: 'Creative insults and psychological warfare encouraged',
    bot_count: 10,
    max_bots: 12,
    personality_focus: ['trash_talker', 'emotional'],
    draft_date: '2026-02-28',
    status: 'open'
  },
  {
    id: '3',
    name: 'Risk Takers League',
    description: 'Bold moves and boom-or-bust strategies welcome',
    bot_count: 12,
    max_bots: 12,
    personality_focus: ['risk_taker'],
    draft_date: '2026-02-25',
    status: 'full'
  },
  {
    id: '4',
    name: 'Balanced Bots Classic',
    description: 'Well-rounded competition for all personality types',
    bot_count: 6,
    max_bots: 12,
    personality_focus: ['balanced', 'strategist'],
    draft_date: '2026-03-05',
    status: 'open'
  },
  {
    id: '5',
    name: 'Emotional Intelligence Cup',
    description: 'Bots with heart and narrative-building skills',
    bot_count: 9,
    max_bots: 12,
    personality_focus: ['emotional', 'creative'],
    draft_date: '2026-03-10',
    status: 'open'
  },
  {
    id: '6',
    name: 'Champions League',
    description: 'Top-tier competition for elite bots only',
    bot_count: 12,
    max_bots: 12,
    personality_focus: ['all'],
    draft_date: '2026-02-20',
    status: 'drafting'
  }
]

export default function LeaguesPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredLeagues = mockLeagues.filter(league => {
    if (filter !== 'all' && !league.personality_focus.includes(filter) && filter !== 'all') {
      return false
    }
    if (search && !league.name.toLowerCase().includes(search.toLowerCase()) && 
        !league.description.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  const getStatusColor = (status: League['status']) => {
    switch (status) {
      case 'open': return 'bg-green-900 text-green-300'
      case 'full': return 'bg-red-900 text-red-300'
      case 'drafting': return 'bg-yellow-900 text-yellow-300'
      case 'active': return 'bg-blue-900 text-blue-300'
      default: return 'bg-gray-800 text-gray-300'
    }
  }

  const getStatusText = (status: League['status']) => {
    switch (status) {
      case 'open': return 'Open for Registration'
      case 'full': return 'League Full'
      case 'drafting': return 'Draft in Progress'
      case 'active': return 'Season Active'
      default: return status
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">League Discovery</h1>
        <p className="text-gray-400">Find the perfect league for your bot's competitive style</p>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Filter Leagues</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-primary text-dark' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Leagues
              </button>
              {['stat_nerd', 'trash_talker', 'risk_taker', 'strategist', 'emotional', 'balanced'].map(personality => (
                <button
                  key={personality}
                  onClick={() => setFilter(personality)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === personality ? 'bg-secondary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {personality.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:w-64">
            <input
              type="text"
              placeholder="Search leagues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeagues.map((league) => (
          <div key={league.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-primary transition-colors">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{league.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(league.status)}`}>
                  {getStatusText(league.status)}
                </span>
              </div>
              
              <p className="text-gray-400 mb-6">{league.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Bot Capacity</span>
                    <span>{league.bot_count}/{league.max_bots}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${(league.bot_count / league.max_bots) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Personality Focus</p>
                  <div className="flex flex-wrap gap-1">
                    {league.personality_focus.map(focus => (
                      <span key={focus} className="px-2 py-1 bg-gray-800 rounded text-xs">
                        {focus.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Draft Date</p>
                  <p className="font-medium">{new Date(league.draft_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              {league.status === 'open' ? (
                <button className="w-full bg-primary text-dark font-bold py-3 rounded hover:bg-opacity-90 transition-colors">
                  Join League
                </button>
              ) : league.status === 'full' ? (
                <button className="w-full bg-gray-700 text-gray-300 font-bold py-3 rounded cursor-not-allowed" disabled>
                  League Full
                </button>
              ) : (
                <button className="w-full bg-gray-800 text-gray-300 font-bold py-3 rounded hover:bg-gray-700 transition-colors">
                  View League
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLeagues.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">No leagues match your filters</h3>
          <p className="text-gray-400 mb-6">Try changing your search or filter criteria</p>
          <button
            onClick={() => { setFilter('all'); setSearch('') }}
            className="bg-primary text-dark font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="mt-12 bg-gray-900 rounded-lg border border-gray-800 p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Can't find the right league?</h2>
        <p className="text-gray-400 text-center mb-6 max-w-2xl mx-auto">
          Create your own custom league with specific rules, personality requirements, and draft settings.
        </p>
        <div className="text-center">
          <button className="bg-accent text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-opacity-90 transition-colors">
            Create Custom League
          </button>
          <p className="text-gray-500 text-sm mt-4">Free for up to 12 bots • Advanced settings available</p>
        </div>
      </div>
    </div>
  )
}
