'use client';

import CopyLink from "@/components/copy-link";
import LocalTime from "@/components/local-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cue, Devices } from "@/lib/model";
import { formatMinutes, formatTime } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, ChartNoAxesGantt, Circle, Users, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function TimerView ({ cues, sessionId: sessionId, devices }: { cues: Cue[], sessionId: string, devices: Devices[] }) {
  const active: Cue = cues.find(c => c.status === 'active') || cues[0];
  const [activeCue, setActiveCue] = useState<Cue>(active);
  
  const [currentTime, setCurrentTime] = useState(activeCue.remaining_time);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  const [hostMessage, setHostMessage] = useState('');
  
  const supabase = createClient();
  const channel = supabase.channel(`session-${sessionId}`);

  useEffect(() => {
    channel.on('broadcast', { event: 'update' }, (data) => {
      const active = cues.find(cue => cue.id === data.payload.cueId)!;
      setCurrentTime(data.payload.remainingTime);
      setIsPlaying(data.payload.isPlaying);
      setActiveCue(active);

      const elapsedTime = cues.filter(cue => cue.order < active.order).reduce((acc, cue) => acc + cue.duration, 0);
      const progress = ((elapsedTime + (active.duration - data.payload.remainingTime)) / totalDuration) * 100;

      setElapsedTime(elapsedTime);
      setProgressPercentage(Math.min(progress, 100));

      if (data.payload.message !== '') {
        setHostMessage(data.payload.message);
      } else {
        setHostMessage('');
      }
    }).subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      channel.unsubscribe();
    }
  }, []);

  const totalDuration = cues.reduce((acc: number, item: Cue) => acc + item.duration, 0);
  const segmentPositions = cues.reduce((acc: any[], segment: any, index: number) => {
    const cumulativeDuration = acc.length > 0 ? acc[acc.length - 1].cumulativeDuration + segment.duration : segment.duration;
    
    acc.push({
      id: segment.id,
      name: segment.title,
      cumulativeDuration,
      position: (cumulativeDuration / totalDuration) * 100,
      completed: segment.status === 'completed',
      duration: segment.duration,
    });

    return acc;
  }, []);

  return (
    <>
      <div className="flex-grow lg:w-2/3 flex flex-col gap-6">
        <div className="flex justify-between items-center py-2 sm:py-0">
          <div className="text-xl sm:text-2xl font-bold text-teal-400 flex items-center gap-2">
            <ChartNoAxesGantt className="bg-teal-500 text-white rounded-full p-1" />
            OnAir Timer
          </div>
          <div className="flex items-center gap-4">
            <LocalTime />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm ${isConnected ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'}`}
              title={isConnected ? 'Connected to host' : 'Connection lost'}>
              {isConnected ? <Wifi size={16} className="animate-pulse" /> : <WifiOff size={16} />}
              <span className="animate-pulse">{isConnected ? 'Live' : 'Offline'}</span>
            </div>
            <CopyLink sessionId={sessionId} icon={false}/>
          </div>
        </div>

        <Card className="flex flex-col items-center justify-center flex-grow p-8 transition-all duration-500 ease-in-out bg-zinc-950 border-teal-600">
          <div className="flex flex-col items-center justify-center gap-4 text-center w-full">
            <h2 className="transition-all duration-500 text-xl sm:text-2xl text-zinc-400">
              {activeCue?.title || 'Timer Finished'}
            </h2>
            <div className="font-mono font-bold tracking-tighter text-white transition-all duration-500 text-7xl sm:text-8xl md:text-9xl md:my-10">
              {formatTime(currentTime)}
            </div>
            <div className={`px-5 py-2 mt-2 rounded-full font-semibold transition-all duration-500 ${isPlaying ? 'bg-teal-500/10 text-teal-300' : 'bg-amber-500/10 text-amber-300'} ${hostMessage ? 'text-sm' : 'text-md'}`}>
              {isPlaying ? 'IN PROGRESS' : 'PAUSED'}
            </div>
            <div className={`transition-all duration-500 ease-in-out w-full ${hostMessage ? 'mt-8 pt-10 border-t border-zinc-700' : 'mt-0 pt-0 border-t border-transparent'}`}>
              <div className="flex flex-col gap-4 items-center text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-teal-300 flash-invert">{hostMessage ? `Message from Host` : ''}</h3>
                <p className="text-4xl sm:text-5xl text-zinc-200 max-w-full flash-invert">{hostMessage}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="py-2">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3 text-sm text-zinc-400">
              <span>Overall Progress</span>
              <span className="font-mono">{formatTime(elapsedTime + (activeCue.duration - currentTime))} / {formatTime(totalDuration)}</span>
            </div>
            <div className="relative h-3 w-full flex items-center">
              <Progress value={progressPercentage} max={100} color="bg-teal-500" />
              {segmentPositions.map((segment) => (
                <Circle
                  key={`segment-${segment.id}`}
                  strokeWidth={2}
                  className={`absolute transition-colors z-10 h-4 w-4 ${segment.completed ? 'fill-zinc-200 stroke-zinc-200' : 'fill-zinc-900 stroke-zinc-600'}`}
                  style={{
                    left: `${segment.position}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:w-1/3 flex flex-col gap-6">
        <Card className="flex flex-col flex-grow">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            <div className="space-y-3">
              {cues.map((item: any) => (
                <div key={item.id} className={`p-4 rounded-lg transition-all ${item.id === activeCue.id ? 'bg-teal-500/10 border-l-4 border-teal-500' : 'bg-zinc-700/50'} ${item.completed ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div className='max-w-7/12'>
                      <p className={`font-semibold ${item.id === activeCue.id ? 'text-teal-300' : 'text-zinc-200'}`}>{item.title}</p>
                      <p className="text-sm text-zinc-400">
                        {item.status === 'completed' ? 'Completed' : (item.id === activeCue.id ? 'In Progress' : `Queued`)}
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
              <p className="text-3xl text-zinc-300">{cues.find(c => c.order === activeCue.order + 1) ? cues.find(c => c.order === activeCue.order + 1)?.title : 'End of Event'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:text-sm">
                <Users size={18}/> Connected Devices ({devices.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-400 space-y-2 max-h-28 overflow-y-auto">
              {devices.map(d => (
                <div key={d.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                  <p className="truncate">{d.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
