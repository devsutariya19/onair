'use client'

import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSession } from '@/app/dashboard/actions';
import { convertToSeconds, formatStringTime, formatTimeInterval, formatTotalTimeDisplay } from '@/lib/utils';
import { Clock, GripVertical, Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { NewCue } from '@/lib/model';

export default function CreateSession() {
  const [queue, setQueue] = useState<NewCue[]>([{ title: 'Opening Remarks', speaker: 'John Doe', duration: '00:30:00', order: 1 }] );
  const [sessionTitle, setSessionTitle] = useState('Presentation');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e: any, index: any) => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      e.preventDefault();
      return;
    }

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

    items.forEach((item, idx) => {
      item.order = idx + 1;
    });
    
    setQueue(items);
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleAddItem = () => setQueue([...queue, { title: 'New Segment', speaker: 'John Doe', duration: '00:30:00', order: queue.length + 1 }]);
  const handleRemoveItem = (order: any) => setQueue(queue.filter(item => item.order !== order));
  const handleQueueChange = (order: any, field: any, value: any) => {
    setQueue(queue.map(item => (item.order === order ? { ...item, [field]: value } : item)));
  };

  const handleTimeChange = (order: any, field: any, value: any) => {
    const formattedTime = formatStringTime(value);

    setQueue(queue.map(item => (item.order === order ? { ...item, [field]: formattedTime } : item)));
  };

  const resetQueue = () => {
    setQueue([{ title: 'New Segment', speaker: 'John Doe', duration: '00:30:00', order: 1 }]);
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const handleCreateSession = async () => {
    toast.promise(createSession(sessionTitle, queue, formatTimeInterval(totalDurationSeconds)), {
      loading: "Creating session...",
      success: "Session created successfully!",
      error: (err) => `Failed to create session: ${err.message}`,
    });
  };

  const totalDurationSeconds = queue.reduce((acc, item) => {
    return acc + (convertToSeconds(item.duration) || 0);
  }, 0);

  return (
    <Dialog onOpenChange={() => resetQueue()}>
        <DialogTrigger asChild>
          <Button variant="default"><Plus/> Create New Session</Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className='text-2xl'>Create a New Session</DialogTitle>
            <DialogDescription className='text-sm text-zinc-400'>Add a title and segments for this session</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1" className='text-md'>Session Title</Label>
              <Input id="name-1" name="name" onChange={(e) => setSessionTitle(e.target.value)} defaultValue="Presentation" />
            </div>
            <div className="grid gap-3">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-md font-semibold text-zinc-100">Session Timeline</Label>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm"><Clock size={14} /><span>Total: {formatTotalTimeDisplay(totalDurationSeconds)}</span></div>
                </div>
                <div className="space-y-1 max-h-100 overflow-y-auto pr-2 border-t border-b border-zinc-700 py-2" onDragLeave={handleDragLeave} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                  {queue.map((item, index) => {
                    const isDraggingOver = dragOverIndex === index;
                    const isDragged = draggedItemIndex === index;
                    return (
                      <div key={item.order} className={`relative transition-all duration-200 ${isDraggingOver ? 'pt-10' : 'pt-0'}`} onDragOver={(e) => handleDragOver(e, index)}>
                        {isDraggingOver && <div className="absolute top-2 left-0 w-full h-1 bg-teal-500 rounded-full"></div>}
                        <div className={`flex items-center gap-3 bg-zinc-700/50 p-3 rounded-md transition-opacity ${isDragged ? 'opacity-50' : 'opacity-100'}`} draggable onDragStart={(e) => handleDragStart(e, index)}>
                          <div className="text-zinc-500 cursor-grab flex-shrink-0">
                            <GripVertical />
                          </div>

                          <div className='grid flex-grow max-w-sm items-center'>
                            <Label htmlFor={`title-${item.order}`} className='text-xs text-zinc-300 font-extralight my-0.5'>Segment Title</Label>
                            <Input type="text" id={`title-${item.order}`} value={item.title} onChange={(e) => handleQueueChange(item.order, 'title', e.target.value)} 
                              className="flex-grow h-10 bg-transparent focus:outline-none border-none text-zinc-100 text-sm sm:text-md" placeholder="Segment Title"
                            />
                          </div>
                          
                          <div className='grid flex-grow max-w-sm items-center'>
                            <Label htmlFor={`speaker-${item.order}`} className='text-xs text-zinc-300 font-extralight my-0.5'>Speaker</Label>
                            <Input type="text" id={`speaker-${item.order}`} value={item.speaker} onChange={(e) => handleQueueChange(item.order, 'speaker', e.target.value)} 
                              className="flex-grow h-10 bg-transparent focus:outline-none border-none text-zinc-100 text-sm sm:text-md" placeholder="Speaker"
                            />
                          </div>

                          <div className='grid items-center'>
                            <Label htmlFor={`duration-${item.order}`} className='text-xs text-zinc-300 font-extralight my-0.5'>Duration</Label>
                            <Input type="text" id={`duration-${item.order}`} value={item.duration} inputMode="numeric" maxLength={8} 
                              onChange={(e) => handleQueueChange(item.order, 'duration', e.target.value)}
                              onBlur={(e) => handleTimeChange(item.order, 'duration', e.target.value)}
                              className="w-20 h-10 bg-zinc-600 text-center p-1 focus:outline-none border-none text-zinc-100 text-sm sm:text-md" placeholder="hh:mm:ss"
                            />
                          </div>

                          {queue.length >= 2 && (
                            <Button variant="ghost" onClick={() => handleRemoveItem(item.order)} className="text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={handleAddItem} className="w-full mt-3 bg-zinc-700/80 hover:bg-zinc-700 border border-dashed border-zinc-600 text-zinc-400 rounded-md p-2 flex items-center justify-center gap-2 transition-colors"><Plus size={16} /> Add Segment</button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleCreateSession}>
                Create Session and Get Link
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}