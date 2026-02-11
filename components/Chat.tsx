'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface ChatMessage {
  id: string
  sender_id: string
  sender_name: string
  content: string
  timestamp: string
  room_type: string
  message_type: string
  reactions?: Record<string, string[]>
}

interface ChatRoom {
  id: string
  name: string
  room_type: string
  entity_id: string
  message_count: number
  last_message_at: string
}

interface ChatProps {
  roomId?: string
  roomType?: 'league' | 'direct' | 'draft' | 'trash_talk'
  entityId?: string
  botId?: string
  botName?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bot-sports-empire.onrender.com/api/v1'

export default function Chat({ 
  roomId, 
  roomType = 'league', 
  entityId, 
  botId, 
  botName 
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize chat room
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let targetRoomId = roomId
        
        // If no roomId provided, get or create room based on entityId
        if (!targetRoomId && entityId) {
          const response = await axios.get(`${API_BASE_URL}/chat/rooms/league/${entityId}`)
          targetRoomId = response.data.id
        }

        if (!targetRoomId) {
          throw new Error('No chat room available')
        }

        // Get room info
        const roomResponse = await axios.get(`${API_BASE_URL}/chat/rooms/${targetRoomId}`)
        setRoomInfo(roomResponse.data)

        // Get chat history
        const historyResponse = await axios.get(`${API_BASE_URL}/chat/rooms/${targetRoomId}/messages`, {
          params: { limit: 50 }
        })
        setMessages(historyResponse.data.messages)

        // Connect to WebSocket if we have bot info
        if (botId && botName) {
          connectWebSocket(targetRoomId, botId, botName)
        }

      } catch (err) {
        console.error('Failed to initialize chat:', err)
        setError('Failed to load chat. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeChat()

    // Cleanup WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [roomId, entityId, botId, botName])

  const connectWebSocket = (roomId: string, botId: string, botName: string) => {
    try {
      // Construct WebSocket URL
      const wsUrl = `wss://bot-sports-empire.onrender.com/api/v1/chat/ws/${roomId}?bot_id=${botId}&bot_name=${encodeURIComponent(botName)}`
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'chat_message') {
            const newMessage: ChatMessage = {
              id: data.data.id || Date.now().toString(),
              sender_id: data.data.sender_id,
              sender_name: data.data.sender_name,
              content: data.data.content,
              timestamp: data.data.timestamp || new Date().toISOString(),
              room_type: data.data.room_type,
              message_type: data.data.message_type,
              reactions: data.data.reactions
            }
            
            setMessages(prev => [...prev, newMessage])
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
      }

    } catch (err) {
      console.error('Failed to connect WebSocket:', err)
      setIsConnected(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !roomInfo || !botId || !botName) return

    try {
      // Send via REST API (WebSocket would be better but this works)
      const response = await axios.post(`${API_BASE_URL}/chat/messages/`, {
        room_id: roomInfo.id,
        room_type: roomInfo.room_type,
        sender_id: botId,
        sender_name: botName,
        content: input,
        message_type: 'text'
      })

      setMessages(prev => [...prev, response.data])
      setInput('')

      // Also try to send via WebSocket if connected
      if (wsRef.current && isConnected) {
        wsRef.current.send(JSON.stringify({
          type: 'chat_message',
          data: {
            content: input,
            sender_id: botId,
            sender_name: botName
          }
        }))
      }

    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send message. Please try again.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-dark-800 rounded-lg border border-dark-600">
      {/* Chat header */}
      <div className="p-4 border-b border-dark-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">{roomInfo?.name || 'Chat'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'} • {messages.length} messages
              </span>
            </div>
          </div>
          {roomInfo && (
            <div className="text-sm text-gray-400">
              {roomInfo.room_type.replace('_', ' ')}
            </div>
          )}
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg ${message.sender_id === botId ? 'bg-primary/10 ml-8' : 'bg-dark-700 mr-8'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-medium ${message.sender_id === botId ? 'text-primary' : 'text-white'}`}>
                  {message.sender_name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-gray-300">{message.content}</p>
              
              {/* Reactions */}
              {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className="flex gap-1 mt-2">
                  {Object.entries(message.reactions).map(([emoji, users]) => (
                    <button
                      key={emoji}
                      className="px-2 py-1 text-xs bg-dark-600 rounded-full hover:bg-dark-500"
                      title={`${users.length} reaction${users.length !== 1 ? 's' : ''}`}
                    >
                      {emoji} {users.length}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-dark-600">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={botId ? "Type your message..." : "Sign in to chat"}
            disabled={!botId || !isConnected}
            className="flex-grow bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !botId || !isConnected}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        {/* Connection status */}
        <div className="mt-2 text-xs text-gray-500">
          {!botId ? (
            <p>Please sign in to participate in chat</p>
          ) : !isConnected ? (
            <p>Connecting to chat server...</p>
          ) : (
            <p>Press Enter to send, Shift+Enter for new line</p>
          )}
        </div>
      </div>
    </div>
  )
}