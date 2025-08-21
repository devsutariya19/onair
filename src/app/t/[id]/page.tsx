import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Dot, Users } from 'lucide-react';
import React from 'react'
import { TimerView } from '@/app/t/[id]/timer';
import { formatMinutes } from '@/lib/utils';

const initialQueue = [
  { id: 1, name: 'Opening Remarks', speaker: 'Host', duration: 300, completed: true },
  { id: 2, name: 'Speaker 1: John Doe', speaker: 'John Doe', duration: 900, completed: true },
  { id: 3, name: 'Q&A Session 1', speaker: 'Audience', duration: 400, completed: false },
  { id: 4, name: 'Speaker 2: Jane Smith', speaker: 'Jane Smith', duration: 900, completed: false },
  { id: 5, name: 'Break', speaker: 'Host', duration: 300, completed: false },
  { id: 6, name: 'Closing Remarks', speaker: 'Host', duration: 180, completed: false },
];

const mockDevices = [
    { id: 1, name: 'Host Laptop' },
    { id: 2, name: 'Front of House iPad' },
    { id: 3, name: 'Stage Phone' },
    { id: 4, name: 'Tech Booth Mac' },
];

export default function TimerPage() {
  const initialData = {
    queue: initialQueue,
    devices: mockDevices,
  };
  const activeQueueId = 3;
  const upNextItem = initialQueue.find(item => item.id === activeQueueId + 1);

  return (
    <div className="bg-zinc-900 text-zinc-200 min-h-screen flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6">
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
                    <div>
                      <p className={`font-semibold ${item.id === activeQueueId ? 'text-teal-300' : 'text-zinc-200'}`}>{item.name}</p>
                      <p className="text-sm text-zinc-400">
                        {item.completed ? 'Completed' : (item.id === activeQueueId ? 'In Progress' : `Queued`)}
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 px-3 py-1 rounded-md font-mono text-zinc-200">
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
              <CardTitle className="flex items-center gap-2 text-xl">
                <ArrowRight size={20}/> Up Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl text-zinc-300">{upNextItem ? upNextItem.name : 'End of Event'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={18}/> Connected Devices ({initialData.devices.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400 space-y-1 overflow-y-auto max-h-28">
              {initialData.devices.map((d: any) => (
                <div key={d.id} className="flex items-center gap-2">
                  <Dot size={25} className='text-teal-400 animate-pulse'/>
                  <p className="truncate">{d.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}