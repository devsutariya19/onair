'use client'

import { Button } from '@/components/ui/button';
import { EllipsisVertical, GripVertical, Play } from 'lucide-react';
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { formatTime } from '@/lib/utils';
import { Cue } from '@/lib/model';

export default function Rundown({ rundown, activeCue }: { rundown: Cue[], activeCue: Cue }) {
  const [queue, setQueue] = useState<any[]>(rundown);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e: any, index: any) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: any, index: any) => {
    e.preventDefault();
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };
  
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = () => {
    if (draggedItemIndex === null || dragOverIndex === null || draggedItemIndex === dragOverIndex) {
      setDraggedItemIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    const items = [...queue];
    const draggedItem = items.splice(draggedItemIndex, 1)[0];
    items.splice(dragOverIndex, 0, draggedItem);
    
    setQueue(items);
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-1 overflow-y-auto p-2 border-t border-b border-zinc-700" onDragLeave={handleDragLeave} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {queue.map((item: Cue, index: any) => {
        const isDraggingOver = dragOverIndex === index;
        const isDragged = draggedItemIndex === index;
        return (
          <div key={item.id} className={`relative transition-all duration-200 ${isDraggingOver ? 'pt-10' : 'pt-0'} ${item.id === activeCue.id ? 'bg-teal-500/10 border-l-4 border-teal-500' : 'bg-zinc-700/50'} ${item.status === 'completed' ? 'opacity-50' : ''} rounded-md mb-1`}
            onDragOver={(e) => handleDragOver(e, index)}
          >
            {isDraggingOver && <div className="absolute top-2 left-0 w-full h-1 bg-teal-500 rounded-full"></div>}
            <div className={`flex items-center bg-zinc-700/50 p-2 sm:p-3 rounded-md transition-opacity ${isDragged ? 'opacity-50' : 'opacity-100'}`} draggable onDragStart={(e) => handleDragStart(e, index)}>
              <div className="text-zinc-500 cursor-grab flex-shrink-0">
                <GripVertical />
              </div>
              <Label className="w-15 mx-3 sm:mx-5">{formatTime(item.duration)}</Label>
              <Label className="flex flex-grow justify-start sm:justify-evenly text-sm sm:text-md mx-2 overflow-hidden"><p className='truncate'>{item.title}</p></Label>
              <Button variant="ghost" className="text-zinc-500 hover:text-teal-400 transition-colors"><Play size={16} /></Button>
              <Button variant="ghost" className="text-zinc-500 hover:text-teal-400 transition-colors"><EllipsisVertical size={16} /></Button>
            </div>
          </div>
        );
      })}
    </div>
  )
}
