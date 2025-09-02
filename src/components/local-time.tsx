'use client'

import { Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function LocalTime() {
  const [currentLocalTime, setCurrentLocalTime] = useState('');
  
  useEffect(() => {
    setCurrentLocalTime(new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }));
    
    const clockInterval = setInterval(() => {
      setCurrentLocalTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
    
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div>
      {currentLocalTime && (
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock size={18} />
          <span className="font-mono text-sm sm:text-lg">{currentLocalTime}</span>
        </div>
      )}
    </div>
  )
}
