import { Button } from '@/components/ui/button'
import { ChartNoAxesGantt, Home } from 'lucide-react'
import { DataTable } from '@/app/dashboard/data-table'
import {columns } from '@/app/dashboard/columns'
import React from 'react'
import Link from 'next/link'
import CreateSession from '@/app/dashboard/create-session'

export default function Dashboard() {
  const initialSessions = [
    { id: 'xyz-123', title: 'Weekly Team Sync', segments: '10', totalDuration: '45m', lastModified: '2025-08-17T10:30:00Z' },
    { id: 'abc-789', title: 'Client Presentation Rehearsal', segments: '5', totalDuration: '1h 15m', lastModified: '2025-08-14T14:00:00Z' },
    { id: 'def-456', title: 'Q3 All-Hands Meeting', segments: '8', totalDuration: '2h 30m', lastModified: '2025-08-12T09:00:00Z' },
    { id: 'ghi-012', title: 'Workshop on New Features', segments: '3', totalDuration: '30m', lastModified: '2025-08-05T11:45:00Z' },
  ];

  return (
    <div>
      <div className='flex justify-between items-center border py-4 mb-8 bg-transparent rounded-none border-transparent border-b-zinc-800'>
        <Link href="/" className="text-2xl font-bold text-teal-400 flex items-center gap-2">
          <ChartNoAxesGantt className="bg-teal-500 text-white rounded-full p-1" />
          OnAir Timer
        </Link>
        <Link href="/">
          <Button className='bg-teal-700 hover:bg-teal-800 text-zinc-100 rounded-full'>
            <Home/>
            Home
          </Button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mx-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">My Sessions</h1>
          <p className="text-zinc-400 mt-1">Manage and create your remote timers.</p>
        </div>
        <CreateSession/>
      </div>

      <div className='sm:mx-8'>
        <DataTable columns={columns} data={initialSessions} />
      </div>
    </div>
  )
}