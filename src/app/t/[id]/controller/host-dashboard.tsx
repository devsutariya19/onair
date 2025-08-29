'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime, formatTotalTime } from '@/lib/utils';
import { SkipBack, Play, Pause, SkipForward, Users } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Rundown from '@/app/t/[id]/controller/rundown';
import { Label } from '@/components/ui/label';

export default function HostDashboard({ initialRundown, initialMessages, timerId, mockDevices }: { initialRundown: any, initialMessages: any, timerId: string, mockDevices: any[] }) {
  const [rundown, setRundown] = useState<any[]>(initialRundown);
  const [presetMessages, setPresetMessages] = useState<any[]>(initialMessages);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [hostMessage, setHostMessage] = useState<string>('');
  const [screenState, setScreenState] = useState<'normal' | 'flashing' | 'blackout'>('normal');

  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeItem = rundown.find(c => c.status === 'active');

  const handleNextCue = useCallback(() => {
    const currentIndex = rundown.findIndex(c => c.status === 'active');
    if (currentIndex > -1 && currentIndex < rundown.length - 1) {
      setRundown(current => current.map((cue, index) => {
        if (index === currentIndex) return { ...cue, status: 'finished' };
        if (index === currentIndex + 1) return { ...cue, status: 'active' };
        return cue;
      }));
    } else {
      setIsPaused(true);
    }
  }, [rundown]);

  useEffect(() => {
    setCurrentTime(activeItem ? activeItem.duration : 0);
    setIsPaused(true);
  }, [activeItem?.id]);

  useEffect(() => {
    if (isPaused || currentTime <= 0) {
        if(currentTime <= 0 && !isPaused) handleNextCue();
        return;
    };
    const interval = setInterval(() => setCurrentTime(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused, currentTime, handleNextCue]);
  
  const handlePreviousCue = () => {
    const currentIndex = rundown.findIndex(c => c.status === 'active');
    if (currentIndex > 0) {
      setRundown(rundown.map((cue, index) => {
        if (index === currentIndex) return { ...cue, status: 'upcoming' };
        if (index === currentIndex - 1) return { ...cue, status: 'active' };
        return cue;
      }));
    }
  };

  const handleFlash = () => {
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    setScreenState('flashing');
    flashTimeoutRef.current = setTimeout(() => setScreenState('normal'), 4000);
  };

  const totalDuration = activeItem ? activeItem.duration : 0;
  const progress = totalDuration > 0 ? ((totalDuration - currentTime) / totalDuration) * 100 : 0;

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 py-6 overflow-y-auto">
      <div className="lg:col-span-3 flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`flex flex-col items-center justify-center p-4 transition-all duration-500 ease-in-out flex-shrink-0 border-teal-600 ${screenState === 'blackout' ? 'bg-black' : 'bg-zinc-950'} ${screenState === 'flashing' ? 'animate-flash' : ''}`}>
            <div className={`flex flex-col items-center justify-center gap-2 text-center transition-all duration-500 ease-in-out w-full h-full ${screenState === 'blackout' ? 'opacity-0' : 'opacity-100'}`}>
              <div className={`flex flex-col items-center justify-center gap-2 text-center transition-all duration-500 ease-in-out ${hostMessage ? 'opacity-70' : 'opacity-100'}`}>
                <h2 className={`transition-all duration-500 flash-invert ${hostMessage ? 'text-md' : 'text-lg'} text-zinc-400`}>{activeItem?.title || 'Timer Finished'}</h2>
                <div className={`font-mono font-bold tracking-tighter transition-all duration-500 flash-invert text-4xl ${hostMessage ? 'sm:text-3xl' : 'sm:text-4xl'} text-white`}>{formatTime(currentTime)}</div>
                <div className={`px-3 py-1 mt-2 rounded-full font-semibold transition-all duration-500 ${isPaused ? 'bg-yellow-500/10 text-yellow-300' : 'bg-teal-500/10 text-teal-300'} ${hostMessage ? 'text-xs' : 'text-sm'}`}>{isPaused ? 'PAUSED' : 'RUNNING'}</div>
              </div>
              <div className={`transition-all duration-500 ease-in-out overflow-hidden w-full ${hostMessage ? 'max-h-[30rem] mt-4 pt-4 border-t border-zinc-700' : 'max-h-0 mt-0 pt-0 border-t border-transparent'}`}>
                <div className="flex flex-col gap-2 items-center text-center">
                  <h3 className="text-lg font-bold text-teal-300 flash-invert">{hostMessage ? 'Message from Host' : ''}</h3>
                  <p className="text-xl text-zinc-200 max-w-full flash-invert">{hostMessage}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2 p-2 border-zinc-700 text-white flex-shrink-0">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex-grow justify-center text-center md:text-left">
                <p className="text-zinc-400 text-sm">CURRENTLY LIVE</p>
                <p className="text-lg sm:text-xl font-bold truncate">{activeItem?.title || 'Timer Paused'}</p>
                <p className="text-4xl sm:text-6xl font-black text-teal-400 my-1">{formatTime(currentTime)}</p>
                <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s linear' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-4 mt-5">
                <Button variant="ghost" size="sm" onClick={() => setCurrentTime(p => Math.max(0, p - 60))}><span className='text-xs'>-1m</span></Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentTime(p => Math.max(0, p - 30))}><span className='text-xs'>-30s</span></Button>
                <Button variant="ghost" size="sm" onClick={handlePreviousCue}><SkipBack /></Button>
                <Button size="lg" className={`w-10 h-10 text-2xl text-white ${isPaused ? 'bg-teal-500 hover:bg-teal-600' : 'bg-yellow-500 hover:bg-yellow-600'}`} onClick={() => setIsPaused(p => !p)}>
                  {isPaused ? <Play /> : <Pause />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleNextCue}><SkipForward /></Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentTime(p => p + 30)}><span className='text-xs'>+30s</span></Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentTime(p => p + 60)}><span className='text-xs'>+1m</span></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/70 border-zinc-700 text-white flex-grow flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rundown</CardTitle>
            <Label className="text-xs text-zinc-400">{rundown.length} items | {formatTotalTime(rundown.reduce((acc, item) => acc + item.duration, 0))}</Label>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <div className="space-y-1">
              <Rundown initialRundown={rundown} />
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
              {/* <NewMessageDialog onSave={handleAddNewMessage} /> */}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto">
            {presetMessages.map(msg => (
              <Button key={msg.id} variant="secondary" className="w-full justify-start text-white" onClick={() => setHostMessage(msg.text)}>{msg.text}</Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 sm:text-sm">
              <Users size={18}/> Connected Devices ({mockDevices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-400 space-y-2 max-h-28 overflow-y-auto">
            {mockDevices.map(d => (
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