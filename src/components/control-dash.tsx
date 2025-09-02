'use client'

import { formatTime } from '@/lib/utils'
import { Play, SkipBack, SkipForward, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card';

export default function ControlDash({startTime}: {startTime: number}) {
  const [mockupTime, setMockupTime] = useState(startTime);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setMockupTime(prevTime => (prevTime <= 0 ? startTime : prevTime - 1));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div className="lg:w-1/2 w-full">
      <Card className="bg-zinc-800/50 p-2 sm:p-4 shadow-2xl">
        <div className="flex items-center gap-2 px-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-grow w-full bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <h4 className="font-semibold text-3xl mb-5 sm:mb-10 text-gray-300">Queue</h4>
            <ul className="text-sm sm:text-lg w-5/6 space-y-2 text-gray-400">
              <li className="truncate p-1 rounded-lg bg-teal-900/50 text-teal-300">Team Showcase : 25m</li>
              <li className="truncate">Keynote Speech : 5m</li>
              <li className="truncate">Q&A Session : 10m</li>
              <li className="truncate">Closing Remarks : 2m</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-56">
            <div className="flex-1 text-center bg-zinc-800/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Current: Team Showcase</p>
              <p className="font-mono text-2xl font-bold text-teal-300 my-2">{formatTime(mockupTime)}</p>
              <div className="w-full bg-zinc-700 h-1 rounded-full my-3">
                <div className="bg-teal-500 h-1 rounded-full" style={{width: `${(mockupTime/startTime)*100}%`}}></div>
              </div>
              <div className="flex justify-center gap-3">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center"><SkipBack size={10} /></div>
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center"><Play size={10} /></div>
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center"><SkipForward size={10} /></div>
              </div>
            </div>
            <div className="flex-1 bg-zinc-800/50 rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2 text-gray-300 flex items-center gap-1"><Users size={14}/> Devices</h4>
              <ul className="text-xs space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Conference iPad</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> John's iPhone</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Sarah's Pixel</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
