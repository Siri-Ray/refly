import type { ServerMessage } from "@/types"

export interface Feed {
  id: string
  userId: string
  title: string
  lastMessage: string
  messageCount: number
  origin: string
  originPageUrl: string
  originPageTitle: string
  createdAt: string
  updatedAt: string

  messages?: ServerMessage[]
}
