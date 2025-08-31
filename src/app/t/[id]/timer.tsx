'use client';

import LocalTime from "@/components/local-time";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatTime } from "@/lib/utils";
import { ChartNoAxesGantt, Circle, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function TimerView ({ initialData }: { initialData: any }) {
  const { queue } = initialData;

  const [currentTime, setCurrentTime] = useState(initialData.queue[0].duration);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [activeQueueId, setActiveQueueId] = useState(1);
  const [hostMessage, setHostMessage] = useState('');

  useEffect(() => {
    let timerInterval: any;
    if (isPlaying && isConnected) {
      timerInterval = setInterval(() => {
        setCurrentTime((prev: number) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isPlaying, isConnected]);

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      setHostMessage("We'll be starting the Q&A session in 2 minutes.");
    }, 5000);

    return () => clearTimeout(messageTimer);
  }, []);

  useEffect(() => {
    if (hostMessage) {
      const clearMessageTimer = setTimeout(() => {
        setHostMessage('');
      }, 10000);
      return () => clearTimeout(clearMessageTimer);
    }
  }, [hostMessage]);
  
  const totalDuration = queue.reduce((acc: number, item: any) => acc + item.duration, 0);
  const completedDuration = queue.filter((q: any) => q.id < activeQueueId).reduce((acc: number, item: any) => acc + item.duration, 0);
  const activeItem = queue.find((q: any) => q.id === activeQueueId);
  const activeItemElapsedTime = activeItem ? activeItem.duration - currentTime : 0;
  const totalElapsedTime = completedDuration + activeItemElapsedTime;
  const progressPercentage = totalDuration > 0 ? (totalElapsedTime / totalDuration) * 100 : 0;

  const segmentPositions = queue.slice(0, -1).reduce((acc: any, segment: any) => {
    const lastPosition = acc.length > 0 ? acc[acc.length - 1].cumulativeDuration : 0;
    const cumulative = lastPosition + segment.duration;
    if (totalDuration > 0) {
      acc.push({
        id: segment.id,
        name: segment.name,
        cumulativeDuration: cumulative,
        position: (cumulative / totalDuration) * 100,
        completed: segment.completed,
      });
    }
    return acc;
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-teal-400 flex items-center gap-2">
          <ChartNoAxesGantt className="bg-teal-500 text-white rounded-full p-1" />
          OnAir Timer
        </div>
        <div className="flex items-center gap-4">
          <LocalTime/>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isConnected ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'}`}
            title={isConnected ? 'Connected to host' : 'Connection lost'}
          >
            {isConnected ? <Wifi size={16} className="animate-pulse"/> : <WifiOff size={16} />}
            <span className="animate-pulse">{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <Card className="flex flex-col items-center justify-center flex-grow p-8 transition-all duration-500 ease-in-out bg-zinc-950 border-teal-600">
        <div className={`flex flex-col items-center justify-center gap-4 text-center transition-all duration-500 ease-in-out ${hostMessage ? 'opacity-70' : 'opacity-100'}`}>
            <h2 className={`transition-all duration-500 ${hostMessage ? 'text-lg' : 'text-xl sm:text-2xl'} text-zinc-400`}>
              {activeItem?.name || 'Timer Finished'}
            </h2>
            <div className={`font-mono font-bold tracking-tighter text-white transition-all duration-500 ${hostMessage ? 'text-7xl' : 'text-7xl sm:text-8xl md:text-9xl md:my-10'}`}>
              {formatTime(currentTime)}
            </div>
            <div className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-500 ${isPlaying ? 'bg-teal-500/10 text-teal-300' : 'bg-yellow-500/10 text-yellow-300'} ${hostMessage ? 'text-sm' : 'text-lg'}`}>
              {isPlaying ? activeItem?.speaker : 'PAUSED'}
            </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden w-full ${hostMessage ? 'max-h-96 mt-10 pt-12 border-t border-zinc-700' : 'max-h-0 mt-0 pt-0 border-t border-transparent'}`}>
          <div className="flex flex-col gap-4 items-center text-center">
            <h3 className="text-2xl font-bold text-teal-300 mb-1">Message from Host</h3>
            <p className="text-5xl text-zinc-200 max-w-full">{hostMessage}</p>
          </div>
        </div>
      </Card>

      <Card className="py-2">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3 text-sm text-zinc-400">
            <span>Overall Progress</span>
            <span className="font-mono">{formatTime(totalElapsedTime)} / {formatTime(totalDuration)}</span>
          </div>
          <div className="relative h-3 w-full flex items-center">
            <Progress value={progressPercentage} color="bg-teal-500"/>
            {segmentPositions.map((segment: any) => (
              <Circle
                key={`segment-${segment.id}`}
                className={`absolute transition-colors z-10 h-4 w-4 ${
                  segment.completed ? 'fill-zinc-200 stroke-zinc-200' : 'fill-zinc-900 stroke-zinc-600'
                }`}
                strokeWidth={2}
                style={{
                  left: `${segment.position}%`,
                  transform: 'translateX(-50%)',
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
