export type Message = {
  id: string
  channel_id: number | null
  user_id: number
  content: string
  timestamp: string
}

export type Channel = {
  id: number
  name: string
}

export type User = {
  id: number
  name: string
  status: 'online' | 'offline' | 'away'
}

