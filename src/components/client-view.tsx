'use client'

import { formatTime } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card';

export default function ClientView({startTime}: {startTime: number}) {
  const [mockupTime, setMockupTime] = useState(startTime);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setMockupTime(prevTime => (prevTime <= 0 ? startTime : prevTime - 1));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);
  
  return (
    <div className="lg:w-1/2 w-full">
      <Card className="relative mx-auto bg-zinc-800 h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px] p-1">
        <div className="rounded-xl overflow-hidden h-full bg-zinc-900">
          <div className="h-full w-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs md:text-sm text-gray-400">Team Presentations</p>
            <p className="font-mono text-4xl md:text-7xl font-bold text-teal-300 my-2">{formatTime(mockupTime)}</p>
            <div className="w-full bg-zinc-700 h-2 rounded-full mt-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{width: `${(mockupTime/startTime)*100}%`}}></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}