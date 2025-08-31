import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';
import React from 'react'
import { TimerView } from '@/app/t/[id]/timer';
import { formatMinutes } from '@/lib/utils';
import { Metadata } from 'next';
import { Cue } from '@/lib/model';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "Timer | OnAir Timer",
  description: "OnAir Timer - A simple timer application"
};

const mockDevices = [
  { id: 1, session_id: 'xyz-123', title: 'Host Laptop' },
  { id: 2, session_id: 'xyz-123', title: 'Front of House iPad' },
  { id: 3, session_id: 'xyz-123', title: 'Stage Phone' },
  { id: 4, session_id: 'xyz-123', title: 'Tech Booth Mac' },
];

export default async function TimerPage({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const timerId = id;

  const supabase = await createClient();
  const {data} = await supabase
    .from('cues')
    .select('*')
    .eq('session_id', timerId)
    .overrideTypes<Cue[]>();

  const cues: Cue[] = data!;

  const initialData = {
    queue: cues,
    devices: mockDevices,
  };
  const activeQueueId = 1;
  const upNextItem = cues.find(item => item.id === activeQueueId + 1);

  return (
    <div className="text-zinc-200 min-h-screen flex flex-col lg:flex-row py-2 sm:py-4 lg:py-6 gap-6">
      <div className="flex-grow lg:w-2/3 flex flex-col gap-6">
        <TimerView initialData={initialData} />
      </div>

      <div className="lg:w-1/3 flex flex-col gap-6">
        <Card className="flex flex-col flex-grow">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            <div className="space-y-3">
              {initialData.queue.map((item: any) => (
                <div key={item.id} className={`p-4 rounded-lg transition-all ${item.id === activeQueueId ? 'bg-teal-500/10 border-l-4 border-teal-500' : 'bg-zinc-700/50'} ${item.completed ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div className='max-w-7/12'>
                      <p className={`font-semibold ${item.id === activeQueueId ? 'text-teal-300' : 'text-zinc-200'}`}>{item.title}</p>
                      <p className="text-sm text-zinc-400">
                        {item.status === 'completed' ? 'Completed' : (item.id === activeQueueId ? 'In Progress' : `Queued`)}
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 px-3 py-1 w-20 rounded-md font-mono text-zinc-200">
                      {formatMinutes(item.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-md">
                <ArrowRight size={20}/> Up Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-zinc-300">{upNextItem ? upNextItem.title : 'End of Event'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:text-sm">
                <Users size={18}/> Connected Devices ({initialData.devices.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400 space-y-2 max-h-28 overflow-y-auto">
              {initialData.devices.map(d => (
                <div key={d.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                    <p className="truncate">{d.title}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}