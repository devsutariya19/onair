'use client'

import CopyLink from "@/components/copy-link";
import { Button } from "@/components/ui/button";
import { Session } from "@/lib/model";
import { formatDate, timeAgo } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <a href={`/t/${row.original.id}/controller`}  target="_blank" rel="noopener noreferrer" className="hover:underline">
        <div className="font-medium text-zinc-100">{row.getValue('title')}</div>
      </a>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div className="text-zinc-400">{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'segments',
    header: 'Segments',
    cell: ({ row }) => <div className="text-zinc-400">{row.getValue('segments')}</div>,
  },
  {
    accessorKey: 'total_duration',
    header: 'Duration',
    cell: ({ row }) => <div className="text-zinc-400">{row.getValue('total_duration')}</div>,
  },
  {
    accessorKey: 'last_modified',
    header: () => <div className="hidden sm:table-cell">Last Modified</div>,
    cell: ({ row }) => (
      <div className="hidden sm:table-cell text-zinc-400 cursor-default">
        <HoverCard>
          <HoverCardTrigger>{timeAgo(row.getValue('last_modified'))}</HoverCardTrigger>
          <HoverCardContent className="p-3 rounded-xl bg-zinc-950" side="top" align="center" sideOffset={5}>
            {formatDate(row.getValue('last_modified'))}
          </HoverCardContent>
        </HoverCard>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {

      return (
        <div className="flex justify-end">
          <CopyLink sessionId={row.original.id} />
          <a href={`/t/${row.original.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant='secondary'>
              Start <ArrowRight size={14} />
            </Button>
          </a>
          <Button variant='ghost' className="text-zinc-400"><MoreHorizontal size={18}/></Button>
        </div>
      )
    },
  }
];