import CopyLink from '@/components/copy-link';
import LocalTime from '@/components/local-time';
import { ChartNoAxesGantt } from 'lucide-react';
import { Metadata } from 'next';
import React from 'react'
import HostDashboard from '@/app/t/[id]/controller/host-dashboard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Controller | OnAir Timer",
  description: "OnAir Timer - A simple timer application"
};

export default async function Controller({ params }: { params: Promise<{ id: string }>} ) {
  const { id } = await params;
  const timerId = id;

  const initialRundown: any[] = [
    { id: 1, title: 'Welcome & Introduction', speaker: 'Host', duration: 300, status: 'active' },
    { id: 2, title: 'Keynote Speech', speaker: 'Jane Doe', duration: 2700, status: 'upcoming' },
    { id: 3, title: 'Q&A Session', speaker: 'Panel', duration: 900, status: 'upcoming' },
    { id: 4, title: 'Closing Remarks', speaker: 'Host', duration: 180, status: 'upcoming' },
    { id: 5, title: 'Networking', speaker: 'All', duration: 1800, status: 'upcoming' },
  ];

  const initialMessages: any[] = [
    { id: 1, text: 'Please wrap up' },
    { id: 2, text: '5 minutes remaining' },
    { id: 3, text: 'Next section starting soon' },
  ];

  const mockDevices = [
    { id: 1, name: 'Host Laptop' },
    { id: 2, name: 'Front of House iPad' },
    { id: 3, name: 'Stage Phone' },
    { id: 4, name: 'Tech Booth Mac' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-zinc-700 py-5 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href='/dashboard'>
            <div className="text-2xl font-bold text-teal-400 flex items-center gap-2">
              <ChartNoAxesGantt className="bg-teal-500 text-white rounded-full p-1" />
            </div>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Host Dashboard</h1>
            <p className="text-xs text-zinc-400">Timer ID: <span className="font-mono">{timerId}</span></p>
          </div>
        </div>
          <div className="flex items-center gap-4">
          <LocalTime/>
          <CopyLink timerId={timerId} icon={false}/>
        </div>
      </div>
      
      <HostDashboard
        initialRundown={initialRundown}
        initialMessages={initialMessages}
        mockDevices={mockDevices}
        timerId={timerId}
      />
    </div>
  );
}