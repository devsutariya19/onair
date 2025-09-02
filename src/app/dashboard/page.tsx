import { Button } from '@/components/ui/button'
import { ChartNoAxesGantt, Home } from 'lucide-react'
import { DataTable } from '@/app/dashboard/data-table'
import {columns } from '@/app/dashboard/columns'
import React from 'react'
import Link from 'next/link'
import CreateSession from '@/app/dashboard/create-session'
import { Metadata } from 'next'
import { Session } from '@/lib/model'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: "Dashboard | OnAir Timer",
  description: "OnAir Timer - A simple timer application"
};

export default async function Dashboard() {
  const supabase = await createClient();
  const {data} = await supabase
    .from('sessions')
    .select('*')
    .order('last_modified', { ascending: false })
    .overrideTypes<Session[]>();

  const sessions: Session[] = data!;
  
  return (
    <div>
      <div className='flex justify-between items-center border py-5 mb-9 bg-transparent rounded-none border-transparent border-b-zinc-800'>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mx-0 sm:mx-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">My Sessions</h1>
          <p className="text-zinc-400 mt-1">Manage and create your remote timers.</p>
        </div>
        <CreateSession/>
      </div>

      <div className='sm:mx-8'>
        <DataTable columns={columns} data={sessions} />
      </div>
    </div>
  )
}