'use client'

import CopyLink from "@/components/copy-link";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, MoreHorizontal } from "lucide-react";

export type Session = {
  id: string;
  title: string;
  totalDuration: string;
  lastModified: string;
};

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
    accessorKey: 'segments',
    header: 'Segments',
    cell: ({ row }) => <div className="text-zinc-400">{row.getValue('segments')}</div>,
  },
  {
    accessorKey: 'totalDuration',
    header: 'Duration',
    cell: ({ row }) => <div className="text-zinc-400">{row.getValue('totalDuration')}</div>,
  },
  {
    accessorKey: 'lastModified',
    header: () => <div className="hidden sm:table-cell">Last Modified</div>,
    cell: ({ row }) => <div className="hidden sm:table-cell text-zinc-400">{timeAgo(row.getValue('lastModified'))}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {

      return (
        <div className="flex justify-end">
          <CopyLink timerId={row.original.id} />
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