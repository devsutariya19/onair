import React from 'react'
import { TimerView } from '@/app/t/[id]/timer';
import { Metadata } from 'next';
import { Cue, Devices } from '@/lib/model';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "Timer | OnAir Timer",
  description: "OnAir Timer - A simple timer application"
};

export default async function TimerPage({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const sessionId = id;

  const supabase = await createClient();
  const {data} = await supabase
    .from('cues')
    .select('*')
    .eq('session_id', sessionId)
    .order('order', { ascending: true })
    .overrideTypes<Cue[]>();

  const cues: Cue[] = data!;

  const {data: devices_data} = await supabase
    .from('devices')
    .select('*')
    .eq('session_id', sessionId)
    .overrideTypes<Devices[]>();

  let devices: Devices[] = devices_data!;

  return (
    <div className="text-zinc-200 min-h-screen flex flex-col lg:flex-row py-2 sm:py-4 lg:py-6 gap-6">
      <TimerView cues={cues} sessionId={sessionId} devices={devices} />
    </div>
  )
}