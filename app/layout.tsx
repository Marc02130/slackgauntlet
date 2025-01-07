import type { Metadata } from 'next'
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google'

import { AppSidebar } from '@/app/components/sidebar/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Slack Gauntlet',
  description: 'Message analysis dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-background">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  )
}



import './globals.css'