'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime, formatTotalTimeDisplay } from '@/lib/utils';
import { SkipBack, Play, Pause, SkipForward, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Timeline from '@/app/t/[id]/controller/timeline';
import { Label } from '@/components/ui/label';
import { Cue, Devices, Messages } from '@/lib/model';
import { createClient } from '@/utils/supabase/client';
import { Progress } from '@/components/ui/progress';
import NewMessage from './new-message';

export default function HostDashboard({ cues, messages, sessionId, devices }: { cues: Cue[], messages: Messages[], sessionId: string, devices: Devices[] }) {
  const [timeline, setTimeline] = useState<Cue[]>(cues);

  const [hostMessage, setHostMessage] = useState<string>('');
  const [screenState, setScreenState] = useState<'normal' | 'flashing' | 'blackout'>('normal');
  
  const active: Cue = timeline.find(c => c.status === 'active') || timeline[0];
  const [activeCue, setActiveCue] = useState<Cue>(active);
  const [isPlaying, setIsPlaying] = useState<boolean>(active.is_playing || false);
  const [currentTime, setCurrentTime] = useState<number>(active.remaining_time || 0);

  const supabase = createClient();
  const channel = supabase.channel(`session-${sessionId}`);

  useEffect(() => {
    if (!isPlaying || !activeCue) return;

    channel.subscribe();

    const interval = setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = Math.max(0, prevTime - 1);
        if (newTime <= 0) {
          handleNextCue();
        }
          
        channel.send({
          type: 'broadcast',
          event: 'update',
          payload: {
            cueId: activeCue.id,
            remainingTime: newTime,
            isPlaying: isPlaying,
            message: hostMessage,
          }
        });

        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, [isPlaying, activeCue, hostMessage]);

  const togglePlayPause = async () => {
    if (!activeCue) return;
    await supabase
      .from('cues')
      .update({ is_playing: !isPlaying, remaining_time: currentTime })
      .eq('id', activeCue.id);

    setIsPlaying(!isPlaying);
    setActiveCue({ ...activeCue, is_playing: !isPlaying });

    channel.send({
      type: 'broadcast',
      event: 'update',
      payload: {
        cueId: activeCue.id,
        remainingTime: currentTime,
        isPlaying: !isPlaying
      }
    });
  };

  const handlePlay = async (id: string) => {
    const nextCue = timeline.find(c => c.id === id)!;
    await supabase
      .from('cues')
      .update({ is_playing: true, status: 'active' })
      .eq('id', id);

    await supabase
      .from('cues')
      .update({ is_playing: false, status: 'queued', remaining_time: activeCue.duration })
      .eq('id', activeCue.id);

    setIsPlaying(true);
    setCurrentTime(nextCue.duration);
    setActiveCue({ ...nextCue, is_playing: true, status: 'active' });
  }

  const handleNextCue = async () => {
    const nextCue = timeline.find(c => c.order === activeCue.order + 1);

    if (nextCue) {
      await supabase.from('cues').upsert([
        { ...activeCue, status: 'finished', remaining_time: activeCue.duration, is_playing: false },
        { ...nextCue, status: 'active', is_playing: true }
      ]);

      setActiveCue({ ...nextCue, is_playing: true, status: 'active' });
      setCurrentTime(nextCue.remaining_time);
    }
  };

  const handlePreviousCue = async () => {
    const prevCue = timeline.find(c => c.order === activeCue.order - 1);

    if (prevCue) {
      await supabase.from('cues').upsert([
        { ...activeCue, status: 'queued', remaining_time: activeCue.duration, is_playing: false },
        { ...prevCue, status: 'active', is_playing: true }
      ]);

      setActiveCue({ ...prevCue, is_playing: true, status: 'active' });
      setCurrentTime(prevCue.remaining_time);
    }
  };

  const adjustTime = async (seconds: number) => {
    if (!activeCue) return;
    const newTime = Math.max(0, Math.min(currentTime + seconds, activeCue.duration));
    await supabase
      .from('cues')
      .update({ remaining_time: newTime })
      .eq('id', activeCue.id);

    setCurrentTime(newTime);
  };

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 py-6 overflow-y-auto">
      <div className="lg:col-span-3 flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`flex flex-col items-center justify-center p-4 transition-all duration-500 ease-in-out flex-shrink-0 border-teal-600 ${screenState === 'blackout' ? 'bg-black' : 'bg-zinc-950'} ${screenState === 'flashing' ? 'animate-flash' : ''}`}>
            <div className={`flex flex-col items-center justify-center gap-2 text-center transition-all duration-500 ease-in-out w-full h-full ${screenState === 'blackout' ? 'opacity-0' : 'opacity-100'}`}>
              <div className={`flex flex-col items-center justify-center gap-2 text-center transition-all duration-500 ease-in-out ${hostMessage ? 'opacity-70' : 'opacity-100'}`}>
                <h2 className={`transition-all duration-500 flash-invert ${hostMessage ? 'text-md' : 'text-lg'} text-zinc-400`}>{activeCue?.title || 'Timer Finished'}</h2>
                <div className={`font-mono font-bold tracking-tighter transition-all duration-500 flash-invert text-4xl ${hostMessage ? 'sm:text-3xl' : 'sm:text-4xl'} text-white`}>{formatTime(currentTime)}</div>
                <div className={`px-3 py-1 mt-2 rounded-full font-semibold transition-all duration-500 ${isPlaying ? 'bg-teal-500/10 text-teal-300' : 'bg-amber-500/10 text-amber-300'} ${hostMessage ? 'text-xs' : 'text-sm'}`}>
                  {isPlaying ? 'IN PROGRESS' : 'PAUSED'}
                </div>
              </div>
              <div className={`transition-all duration-500 ease-in-out overflow-hidden w-full ${hostMessage ? 'max-h-[30rem] mt-4 pt-4 border-t border-zinc-700' : 'max-h-0 mt-0 pt-0 border-t border-transparent'}`}>
                <div className="flex flex-col gap-2 items-center text-center">
                  <h3 className="sm:text-lg font-bold text-teal-300 flash-invert">{hostMessage ? 'Message from Host' : ''}</h3>
                  <p className="sm:text-xl text-zinc-200 max-w-full flash-invert">{hostMessage}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2 p-2 border-zinc-700 text-white flex-shrink-0">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex-grow justify-center text-center md:text-left">
                <p className="text-zinc-400 text-sm">CURRENTLY LIVE</p>
                <p className="text-lg sm:text-xl font-bold truncate">{activeCue?.title || 'Timer Paused'}</p>
                <p className="text-4xl sm:text-6xl font-black text-teal-400 my-1">{formatTime(currentTime)}</p>
                <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                  <Progress value={Math.min(((activeCue.duration - currentTime) / activeCue.duration) * 100, 100)} max={100} color="bg-teal-500" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-4 mt-5">
                <Button variant="ghost" size="sm" onClick={() => adjustTime(-60)}><span className='text-xs'>-1m</span></Button>
                <Button variant="ghost" size="sm" onClick={() => adjustTime(-30)}><span className='text-xs'>-30s</span></Button>
                <Button variant="ghost" size="sm" onClick={handlePreviousCue}><SkipBack /></Button>
                <Button size="lg" className={`w-10 h-10 text-2xl text-white ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-500 hover:bg-teal-600'}`} onClick={() => togglePlayPause()}>
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNextCue}><SkipForward /></Button>
                <Button variant="ghost" size="sm" onClick={() => adjustTime(30)}><span className='text-xs'>+30s</span></Button>
                <Button variant="ghost" size="sm" onClick={() => adjustTime(60)}><span className='text-xs'>+1m</span></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/70 border-zinc-700 text-white flex-grow flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Timeline</CardTitle>
            <Label className="text-xs text-zinc-400">{timeline.length} items | {formatTotalTimeDisplay(timeline.reduce((acc, item) => acc + item.duration, 0))}</Label>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <div className="space-y-1">
              <Timeline timeline={timeline} activeCue={activeCue} onPlay={handlePlay}/>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-zinc-900/70 border-zinc-700 text-white flex-grow flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <div className="flex items-center gap-2">
              {hostMessage && <Button variant="secondary" size="sm" onClick={() => setHostMessage('')}>Clear</Button>}
              <NewMessage sessionId={sessionId}/>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto">
            {messages.map(msg => (
              <Button key={msg.id} variant="secondary" className="w-full justify-start text-white" onClick={() => setHostMessage(msg.message)}>{msg.message}</Button>
            ))}
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
  );
}