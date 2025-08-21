'use client'

import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Check, Copy, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    cell: ({ row }) => <div className="font-medium text-zinc-100">{row.getValue('title')}</div>,
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
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        const baseUrl = window.location.origin;
        const shareLink = `${baseUrl}/t/${row.original.id}`;
        navigator.clipboard.writeText(shareLink).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
          console.error("Failed to copy text: ", err);
        });
      };

      return (
        <div className="flex justify-end">
          <Button variant='ghost' onClick={handleCopy} className=" text-zinc-500">
            {copied ? <Check size={16} className="text-teal-400"/> : <Copy size={16}/>}
          </Button>
          <Link href={`/t/${row.original.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant='secondary'>
              Start <ArrowRight size={14} />
            </Button>
          </Link>
          <Button variant='ghost' className="text-zinc-400"><MoreHorizontal size={18}/></Button>
        </div>
      )
    },
  }
];