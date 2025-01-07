import { Message, User } from "@/app/types/table"
import { columns } from "./columns"
import { DataTable } from "@/app/components/messages/data-table"
import { notFound } from "next/navigation"

// Mock data - in a real app, this would come from an API
const messages: Message[] = [
  {
    id: "dm_01",
    channel_id: null,
    user_id: 456,
    content: "Hey, can you review my PR?",
    timestamp: "2024-01-07T12:00:00Z",
  },
  {
    id: "dm_02",
    channel_id: null,
    user_id: 789,
    content: "Sure, I'll take a look now",
    timestamp: "2024-01-07T12:01:00Z",
  },
  {
    id: "dm_03",
    channel_id: null,
    user_id: 456,
    content: "Thanks! The PR number is #123",
    timestamp: "2024-01-07T12:02:00Z",
  },
  {
    id: "dm_04",
    channel_id: null,
    user_id: 789,
    content: "Looks good, just left some minor comments",
    timestamp: "2024-01-07T12:05:00Z",
  },
  {
    id: "dm_05",
    channel_id: null,
    user_id: 456,
    content: "Perfect, I'll address those now",
    timestamp: "2024-01-07T12:06:00Z",
  }
]

const users: User[] = [
  { id: 456, name: "John Doe", status: "online" },
  { id: 789, name: "Jane Smith", status: "offline" },
  { id: 123, name: "Bob Johnson", status: "away" },
]

export default function DirectMessagePage({ params }: { params: { id: string } }) {
  const userId = parseInt(params.id)
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    notFound()
  }

  const filteredMessages = messages.filter(
    (message) => message.user_id === userId
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {user.name[0]}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
              user.status === 'online'
                ? 'bg-green-500'
                : user.status === 'away'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
            }`}
          />
        </div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <span className="text-muted-foreground capitalize">• {user.status}</span>
      </div>
      <DataTable columns={columns} data={filteredMessages} />
    </div>
  )
}

