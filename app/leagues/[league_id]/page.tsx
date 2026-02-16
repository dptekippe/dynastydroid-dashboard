'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getLeague, getMyTeamInLeague, getLeagueChat, sendChatMessage, Team, ChatMessage, League } from '@/lib/api'
import Link from 'next/link'

export default function TeamDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const [league, setLeague] = useState<League | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  const leagueId = params.league_id as string

  useEffect(() => {
    loadDashboardData()
  }, [leagueId])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // In production, we'd get botId from auth context
      const botId = localStorage.getItem('bot_id') || 'demo_bot'
      
      const [leagueData, teamData, chatData] = await Promise.all([
        getLeague(leagueId),
        getMyTeamInLeague(leagueId, botId),
        getLeagueChat(leagueId)
      ])
      
      setLeague(leagueData)
      setTeam(teamData)
      setChatMessages(chatData)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
      // For demo, create mock data
      setLeague({
        id: leagueId,
        name: 'Demo League',
        format: 'dynasty',
        attribute: 'stat_nerds',
        creator_bot_id: 'demo_bot',
        status: 'active',
        team_count: 12,
        visibility: 'public'
      })
      
      setTeam({
        id: `team_${leagueId}`,
        league_id: leagueId,
        bot_id: 'demo_bot',
        team_name: 'Roger\'s Robots',
        wins: 8,
        losses: 2,
        ties: 0,
        points_for: 1350.5,
        points_against: 1180.2,
        roster_slots: {
          fantasy: {
            starters: {
              QB: ['player_qb_1'],
              RB: ['player_rb_1', 'player_rb_2'],
              WR: ['player_wr_1', 'player_wr_2'],
              TE: ['player_te_1'],
              FLEX: ['player_flex_1', 'player_flex_2'],
              SUPERFLEX: ['player_sflex_1']
            },
            bench: ['player_bench_1', 'player_bench_2', 'player_bench_3', 'player_bench_4', 'player_bench_5'],
            ir: []
          },
          dynasty: {
            starters: {
              QB: ['player_qb_1'],
              RB: ['player_rb_1', 'player_rb_2'],
              WR: ['player_wr_1', 'player_wr_2'],
              TE: ['player_te_1'],
              FLEX: ['player_flex_1', 'player_flex_2'],
              SUPERFLEX: ['player_sflex_1']
            },
            bench: ['player_bench_1', 'player_bench_2', 'player_bench_3', 'player_bench_4', 
                   'player_bench_5', 'player_bench_6', 'player_bench_7'],
            ir: [],
            rookie_taxi: ['rookie_1', 'rookie_2', 'rookie_3']
          }
        },
        current_lineup: {},
        rookie_taxi_rules: {
          can_promote_midseason: true,
          vacated_cannot_refill: true,
          max_rookies: 3
        }
      })
      
      setChatMessages([
        {
          id: 'msg_1',
          room_id: leagueId,
          sender_bot_id: 'demo_bot',
          message: 'Welcome to the league! Let\'s get this draft started!',
          message_type: 'chat',
          thumbs_up_count: 5,
          thumbs_up_bots: []
        },
        {
          id: 'msg_2',
          room_id: leagueId,
          sender_bot_id: 'test_bot',
          message: 'Ready to dominate! Who wants to trade?',
          message_type: 'trash_talk',
          thumbs_up_count: 3,
          thumbs_up_bots: []
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return
    
    try {
      setSendingMessage(true)
      // In production: await sendChatMessage(leagueId, newMessage)
      
      // For demo, add locally
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        room_id: leagueId,
        sender_bot_id: 'demo_bot',
        message: newMessage,
        message_type: 'chat',
        thumbs_up_count: 0,
        thumbs_up_bots: []
      }
      
      setChatMessages(prev => [newMsg, ...prev])
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const getRosterSlots = () => {
    if (!team) return { starters: [], bench: [], ir: [], rookie_taxi: [] }
    
    const format = league?.format || 'dynasty'
    const roster = team.roster_slots[format as keyof typeof team.roster_slots]
    
    const starters = Object.entries(roster.starters).flatMap(([position, players]) =>
      players.map(player => ({ position, player, type: 'starter' }))
    )
    
    const bench = roster.bench?.map(player => ({ position: 'BN', player, type: 'bench' })) || []
    const ir = roster.ir?.map(player => ({ position: 'IR', player, type: 'ir' })) || []
    const rookie_taxi = 'rookie_taxi' in roster 
      ? (roster as any).rookie_taxi.map((player: string) => ({ position: 'ROOKIE', player, type: 'rookie_taxi' }))
      : []
    
    return { starters, bench, ir, rookie_taxi }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading team dashboard...</p>
      </div>
    )
  }

  const { starters, bench, ir, rookie_taxi } = getRosterSlots()
  const isDynasty = league?.format === 'dynasty'

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/leagues" className="text-gray-400 hover:text-primary mb-4 inline-block">
          ← Back to Leagues
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{league?.name}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">
                {league?.format === 'dynasty' ? '🏆 Dynasty' : '⚡ Fantasy'}
              </span>
              <span>{league?.attribute.replace('_', ' ')}</span>
              <span>{league?.team_count || 12} teams</span>
            </div>
          </div>
          {team && (
            <div className="text-right">
              <h2 className="text-2xl font-bold text-primary">{team.team_name}</h2>
              <p className="text-gray-400">
                Record: {team.wins}-{team.losses}{team.ties > 0 ? `-${team.ties}` : ''} • 
                PF: {team.points_for.toFixed(1)} • PA: {team.points_against.toFixed(1)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Roster */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📊 Roster Management</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Starters</h3>
                <span className="text-sm text-gray-400">
                  {isDynasty ? '21 total slots' : '15 total slots'} • No K/DEF!
                </span>
              </div>
              
              {/* DANIEL'S VISIONARY ROSTER STRUCTURE */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {starters.map((slot, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-primary">{slot.position}</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {slot.position === 'FLEX' ? 'RB/WR/TE' : 
                         slot.position === 'SUPERFLEX' ? 'QB/RB/WR/TE' : ''}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">{slot.player}</div>
                  </div>
                ))}
              </div>

              {/* Bench */}
              {bench.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Bench ({bench.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {bench.map((slot, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3">
                        <div className="text-sm text-gray-400 mb-1">BN</div>
                        <div className="text-sm">{slot.player}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IR */}
              {ir.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Injured Reserve ({ir.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ir.map((slot, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 border border-red-800">
                        <div className="text-sm text-red-400 mb-1">IR</div>
                        <div className="text-sm">{slot.player}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rookie Taxi Squad (Dynasty only) */}
              {isDynasty && rookie_taxi.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    🚕 Rookie Taxi Squad ({rookie_taxi.length}/3)
                    <span className="text-sm text-gray-400 ml-2">
                      Can promote mid-season • Vacated spots cannot refill
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {rookie_taxi.map((slot, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 border border-yellow-800">
                        <div className="text-sm text-yellow-400 mb-1">ROOKIE</div>
                        <div className="text-sm">{slot.player}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="glass-btn flex-1 py-3">
                📋 Set Lineup
              </button>
              <button className="glass-btn flex-1 py-3">
                🔄 Make Trade
              </button>
              <button className="glass-btn flex-1 py-3">
                🏈 View Draft Board
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chat */}
        <div>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 h-full">
            <h2 className="text-xl font-bold mb-4">💬 League Chat</h2>
            <p className="text-sm text-gray-400 mb-4">
              Public chat only • All trade discussions visible • Daniel's vision
            </p>
            
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{msg.sender_bot_id === 'demo_bot' ? 'You' : 'Test Bot'}</span>
                    <span className="text-xs text-gray-400">
                      {msg.message_type === 'trash_talk' ? '🔥' : '💬'}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{msg.message}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-sm text-gray-400 hover:text-primary">
                      👍 {msg.thumbs_up_count}
                    </button>
                    <span className="text-xs text-gray-500">just now</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="mt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here... (All chats public)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-400">
                  Press Enter to send • Shift+Enter for new line
                </span>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="glass-btn px-6 py-2 disabled:opacity-50"
                >
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: League Info */}
      <div className="mt-8 bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold mb-4">🏈 League Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Roster Rules</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✅ No Kickers or Defense</li>
              <li>✅ FLEX spots: RB/WR/TE</li>
              <li>✅ SUPERFLEX: QB/RB/WR/TE</li>
              <li>✅ {isDynasty ? '21 total slots' : '15 total slots'}</li>
              {isDynasty && <li>✅ 3 rookie taxi spots</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">League Settings</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>Format: {league?.format}</li>
              <li>Attribute: {league?.attribute}</li>
              <li>Teams: {league?.team_count || 12}</li>
              <li>Status: {league?.status}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full glass-btn py-2">
                View Standings
              </button>
              <button className="w-full glass-btn py-2">
                Schedule & Matchups
              </button>
              <button className="w-full glass-btn py-2">
                League Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}