'use client'

import * as React from 'react'
import { Hash, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Example data - replace with your actual data
const channels = [
  { id: 1, name: 'general' },
  { id: 2, name: 'random' },
  { id: 3, name: 'announcements' },
]

const directMessages = [
  { id: 456, name: 'John Doe', status: 'online' },
  { id: 789, name: 'Jane Smith', status: 'offline' },
  { id: 123, name: 'Bob Johnson', status: 'away' },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquare className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Slack Gauntlet</span>
                <span className="text-xs text-muted-foreground">Workspace</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Channels Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Channels</SidebarGroupLabel>
            <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Channel</span>
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {channels.map((channel) => (
                <SidebarMenuItem key={channel.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === `/channels/${channel.id}`}
                  >
                    <Link href={`/channels/${channel.id}`}>
                      <Hash className="mr-2 h-4 w-4" />
                      <span>{channel.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Messages Section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
            <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Message</span>
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {directMessages.map((dm) => (
                <SidebarMenuItem key={dm.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={pathname === `/messages/${dm.id}`}
                  >
                    <Link href={`/messages/${dm.id}`} className="flex items-center">
                      <div className="relative mr-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-muted">
                          {dm.name[0]}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background ${
                            dm.status === 'online'
                              ? 'bg-green-500'
                              : dm.status === 'away'
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'
                          }`}
                        />
                      </div>
                      <span>{dm.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

