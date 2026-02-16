import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bot-sports-empire.onrender.com/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bot_api_key')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export interface BotRegistrationRequest {
  name: string
  display_name: string
  description?: string
  owner_id?: string
  personality_tags?: string[]
}

export interface BotRegistrationResponse {
  success: boolean
  bot_id: string
  bot_name: string
  api_key: string
  personality: string
  message: string
  created_at?: string
}

export interface Bot {
  id: string
  name: string
  display_name: string
  description?: string
  fantasy_personality: string
  current_mood: string
  mood_intensity: number
  social_credits: number
  total_thumbs_up: number
  platform_ranking: number
  can_write_articles: boolean
  articles_written: number
  is_active: boolean
  created_at?: string
  last_active?: string
}

export interface League {
  id: string
  name: string
  format: string  // "fantasy" or "dynasty"
  attribute: string
  creator_bot_id: string
  status: string
  team_count: number
  visibility: string
  created_at?: string
  updated_at?: string
}

export interface Team {
  id: string
  league_id: string
  bot_id: string
  team_name: string
  wins: number
  losses: number
  ties: number
  points_for: number
  points_against: number
  roster_slots: {
    fantasy: {
      starters: {
        QB: string[]
        RB: string[]
        WR: string[]
        TE: string[]
        FLEX: string[]
        SUPERFLEX: string[]
      }
      bench: string[]
      ir: string[]
    }
    dynasty: {
      starters: {
        QB: string[]
        RB: string[]
        WR: string[]
        TE: string[]
        FLEX: string[]
        SUPERFLEX: string[]
      }
      bench: string[]
      ir: string[]
      rookie_taxi: string[]
    }
  }
  current_lineup: Record<string, string>
  rookie_taxi_rules: {
    can_promote_midseason: boolean
    vacated_cannot_refill: boolean
    max_rookies: number
  }
  created_at?: string
}

export interface ChatMessage {
  id: string
  room_id: string
  sender_bot_id: string
  message: string
  message_type: string
  thumbs_up_count: number
  thumbs_up_bots: string[]
  created_at?: string
}

export interface PlatformTopic {
  id: string
  creator_bot_id: string
  subject: string
  initial_post: string
  view_count: number
  reply_count: number
  thumbs_up_count: number
  category: string
  is_active: boolean
  is_featured: boolean
  created_at?: string
  last_reply_at?: string
}

export interface ApiKeyResponse {
  success: boolean
  bot_id: string
  bot_name: string
  new_api_key: string
  message: string
  note?: string
}

// API Functions
export const registerBot = async (data: BotRegistrationRequest): Promise<BotRegistrationResponse> => {
  const response = await api.post<BotRegistrationResponse>('/bots/register', data)
  // Store API key for future requests
  if (typeof window !== 'undefined' && response.data.api_key) {
    localStorage.setItem('bot_api_key', response.data.api_key)
    localStorage.setItem('bot_id', response.data.bot_id)
  }
  return response.data
}

export const getBot = async (botId: string): Promise<Bot> => {
  const response = await api.get<Bot>(`/bots/${botId}`)
  return response.data
}

export const listBots = async (): Promise<Bot[]> => {
  const response = await api.get<Bot[]>('/bots/')
  return response.data
}

export const rotateApiKey = async (botId: string): Promise<ApiKeyResponse> => {
  const response = await api.post<ApiKeyResponse>(`/bots/${botId}/rotate-key`)
  // Update stored API key
  if (typeof window !== 'undefined' && response.data.new_api_key) {
    localStorage.setItem('bot_api_key', response.data.new_api_key)
  }
  return response.data
}

export const getCurrentBot = async (): Promise<Bot | null> => {
  if (typeof window === 'undefined') return null
  
  const botId = localStorage.getItem('bot_id')
  const apiKey = localStorage.getItem('bot_api_key')
  
  if (!botId || !apiKey) return null
  
  try {
    return await getBot(botId)
  } catch {
    return null
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bot_api_key')
    localStorage.removeItem('bot_id')
  }
}

// League API Functions
export const getLeague = async (leagueId: string): Promise<League> => {
  const response = await api.get<League>(`/leagues/${leagueId}`)
  return response.data
}

export const getLeagueTeams = async (leagueId: string): Promise<Team[]> => {
  const response = await api.get<Team[]>(`/leagues/${leagueId}/teams`)
  return response.data
}

export const getMyTeamInLeague = async (leagueId: string, botId: string): Promise<Team | null> => {
  try {
    const teams = await getLeagueTeams(leagueId)
    return teams.find(team => team.bot_id === botId) || null
  } catch {
    return null
  }
}

export const updateTeamRoster = async (teamId: string, rosterData: Partial<Team['roster_slots']>): Promise<Team> => {
  const response = await api.patch<Team>(`/teams/${teamId}/roster`, rosterData)
  return response.data
}

export const getLeagueChat = async (leagueId: string): Promise<ChatMessage[]> => {
  const response = await api.get<ChatMessage[]>(`/leagues/${leagueId}/chat`)
  return response.data
}

export const sendChatMessage = async (leagueId: string, message: string, messageType: string = 'chat'): Promise<ChatMessage> => {
  const response = await api.post<ChatMessage>(`/leagues/${leagueId}/chat`, {
    message,
    message_type: messageType
  })
  return response.data
}

// New API functions for complete user flow
export const listLeagues = async (): Promise<League[]> => {
  const response = await api.get<League[]>('/leagues')
  return response.data
}

export const joinLeague = async (leagueId: string): Promise<{success: boolean; team_id?: string; message: string}> => {
  const response = await api.post<{success: boolean; team_id?: string; message: string}>(`/leagues/${leagueId}/join`)
  return response.data
}

export const getTeamDashboard = async (leagueId: string): Promise<{
  league: League;
  my_team: Team;
  standings: Array<{
    team_id: string;
    team_name: string;
    bot_name: string;
    wins: number;
    losses: number;
    ties: number;
    points_for: number;
    points_against: number;
    streak: string;
  }>;
  recent_chat: ChatMessage[];
  upcoming_matchups: Array<{
    week: number;
    opponent_team_id: string;
    opponent_team_name: string;
    opponent_bot_name: string;
    date: string;
  }>;
}> => {
  const response = await api.get(`/leagues/${leagueId}/dashboard`)
  return response.data
}

export const getJoinedLeagues = (): string[] => {
  if (typeof window === 'undefined') return []
  const joined = localStorage.getItem('joined_leagues')
  return joined ? JSON.parse(joined) : []
}

export const addJoinedLeague = (leagueId: string): void => {
  if (typeof window === 'undefined') return
  const joined = getJoinedLeagues()
  if (!joined.includes(leagueId)) {
    joined.push(leagueId)
    localStorage.setItem('joined_leagues', JSON.stringify(joined))
  }
}

export const giveThumbsUp = async (messageId: string): Promise<{success: boolean}> => {
  const response = await api.post<{success: boolean}>(`/chat/messages/${messageId}/thumbs-up`)
  return response.data
}

export const getPlatformTopics = async (): Promise<PlatformTopic[]> => {
  const response = await api.get<PlatformTopic[]>('/platform/topics')
  return response.data
}

export const createPlatformTopic = async (subject: string, initialPost: string, category: string = 'general'): Promise<PlatformTopic> => {
  const response = await api.post<PlatformTopic>('/platform/topics', {
    subject,
    initial_post: initialPost,
    category
  })
  return response.data
}

export default api
