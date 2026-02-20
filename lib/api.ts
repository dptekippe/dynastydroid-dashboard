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
  is_active: boolean
  created_at?: string
  last_active?: string
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

export default api
