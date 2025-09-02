import CopyLink from '@/components/copy-link';
import LocalTime from '@/components/local-time';
import { ChartNoAxesGantt } from 'lucide-react';
import { Metadata } from 'next';
import React from 'react'
import HostDashboard from '@/app/t/[id]/controller/host-dashboard';
import Link from 'next/link';
import { Cue, Devices, Messages, Session } from '@/lib/model';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "Controller | OnAir Timer",
  description: "OnAir Timer - A simple timer application"
};

export default async function Controller({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const sessionId = id;

  const supabase = await createClient();

  const {data: session_data} = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  const session: Session = session_data!;

  const {data: cue_data} = await supabase
    .from('cues')
    .select('*')
    .eq('session_id', sessionId)
    .order('order', { ascending: true })
    .overrideTypes<Cue[]>();

  let cues: Cue[] = cue_data!;

  const hasActiveCue = cues.some(cue => cue.status === 'active');
  if (!hasActiveCue && cues.length > 0) {
    const firstCue = cues.find(cue => cue.order === 1);

    await supabase
    .from('cues')
    .update({ status: 'active'})
    .eq('id', firstCue?.id)
    .then(async () => {
      const {data} = await supabase
        .from('cues')
        .select('*')
        .eq('session_id', sessionId)
        .order('order', { ascending: true })
        .overrideTypes<Cue[]>();
      cues = data!;
    })
  }

  const {data: devices_data} = await supabase
    .from('devices')
    .select('*')
    .eq('session_id', sessionId)
    .overrideTypes<Devices[]>();

  let devices: Devices[] = devices_data!;

  const {data: messages_data} = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .overrideTypes<Messages[]>();

  let messages: Messages[] = messages_data!;

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
            <h1 className="text-lg font-bold text-white">{session.title}</h1>
            <p className="text-xs text-zinc-400">Timer ID: <span className="font-mono">{sessionId}</span></p>
          </div>
        </div>
          <div className="flex items-center gap-4">
          <LocalTime/>
          <CopyLink sessionId={sessionId} icon={false}/>
        </div>
      </div>
      
      <HostDashboard
        cues={cues}
        messages={messages}
        devices={devices}
        sessionId={sessionId}
      />
    </div>
  );
}