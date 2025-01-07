import { Message } from "@/app/types/table"
import { columns } from "./columns"
import { DataTable } from "@/app/components/messages/data-table"

// Mock data - in a real app, this would come from an API
const messages: Message[] = [
  {
    id: "msg_01",
    channel_id: 1,
    user_id: 456,
    content: "Has anyone tested the new deployment?",
    timestamp: "2024-01-07T12:00:00Z",
  },
  {
    id: "msg_02",
    channel_id: 1,
    user_id: 789,
    content: "Yes, it's working fine on my end",
    timestamp: "2024-01-07T12:01:00Z",
  },
  {
    id: "msg_03",
    channel_id: 2,
    user_id: 456,
    content: "What's everyone working on today?",
    timestamp: "2024-01-07T12:02:00Z",
  },
  {
    id: "msg_04",
    channel_id: 1,
    user_id: 123,
    content: "I found a bug in the login flow",
    timestamp: "2024-01-07T12:03:00Z",
  },
  {
    id: "msg_05",
    channel_id: 2,
    user_id: 789,
    content: "Working on the new feature",
    timestamp: "2024-01-07T12:04:00Z",
  }
]

const channels: { [key: number]: string } = {
  1: "general",
  2: "random",
  3: "announcements"
}

export default function ChannelPage({ params }: { params: { id: string } }) {
  const channelId = parseInt(params.id)
  const channelName = channels[channelId]
  const filteredMessages = messages.filter(
    (message) => message.channel_id === channelId
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">#{channelName}</h1>
      <DataTable columns={columns} data={filteredMessages} />
    </div>
  )
}

