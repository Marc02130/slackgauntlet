"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Message } from "@/app/types/table"

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "content",
    header: "Message",
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue("timestamp"))
      return timestamp.toLocaleTimeString()
    },
  },
]

