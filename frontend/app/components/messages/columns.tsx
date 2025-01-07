"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Message } from "@/app/types/table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Input } from "@/components/ui/input"

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "channel_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Channel ID" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "content",
    header: "Message",
  },
  {
    accessorKey: "timestamp",
    header: "Time",
  },
]

