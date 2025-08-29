'use client'

import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatTotalTime } from '@/lib/utils';
import { Clock, GripVertical, Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react'

export default function CreateSession() {
  const [queue, setQueue] = useState([{ id: 1, name: 'Opening Remarks', duration: '05:00' }]);
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

  const handleAddItem = () => setQueue([...queue, { id: Date.now(), name: 'New Segment', duration: '05:00' }]);
  const handleRemoveItem = (id: any) => setQueue(queue.filter(item => item.id !== id));
  const handleQueueChange = (id: any, field: any, value: any) => setQueue(queue.map(item => (item.id === id ? { ...item, [field]: value } : item)));

  const resetQueue = () => {
    setQueue([{ id: 1, name: 'Opening Remarks', duration: '05:00' }]);
    setDraggedItemIndex(null);
    setDragOverIndex(null);
  };

  const totalDurationSeconds = queue.reduce((acc, item) => {
    const parts = item.duration.split(':').map(Number);
    return acc + (parts.length === 2 ? parts[0] * 60 + parts[1] : 0);
  }, 0);

  return (
    <Dialog onOpenChange={() => resetQueue()}>
      <form>
        <DialogTrigger asChild>
          <Button>
            <Plus/>
            Create New Session
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className='text-2xl'>Create a New Session</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1" className='text-md'>Session Title</Label>
              <Input id="name-1" name="name" defaultValue="Presentation" />
            </div>
            <div className="grid gap-3">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-md font-semibold text-zinc-100">Session Timeline</Label>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm"><Clock size={14} /><span>Total: {formatTotalTime(totalDurationSeconds)}</span></div>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2 border-t border-b border-zinc-700 py-2" onDragLeave={handleDragLeave} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                  {queue.map((item, index) => {
                    const isDraggingOver = dragOverIndex === index;
                    const isDragged = draggedItemIndex === index;
                    return (
                      <div key={item.id} className={`relative transition-all duration-200 ${isDraggingOver ? 'pt-10' : 'pt-0'}`}
                        onDragOver={(e) => handleDragOver(e, index)}
                      >
                        {isDraggingOver && <div className="absolute top-2 left-0 w-full h-1 bg-teal-500 rounded-full"></div>}
                        <div className={`flex items-center gap-3 bg-zinc-700/50 p-2 rounded-md transition-opacity ${isDragged ? 'opacity-50' : 'opacity-100'}`}
                          draggable onDragStart={(e) => handleDragStart(e, index)}
                        >
                          <div className="text-zinc-500 cursor-grab flex-shrink-0">
                            <GripVertical />
                          </div>
                          <input type="text" value={item.name} onChange={(e) => handleQueueChange(item.id, 'name', e.target.value)} className="flex-grow bg-transparent focus:outline-none text-zinc-100" placeholder="Segment Name" />
                          <input type="text" value={item.duration} onChange={(e) => handleQueueChange(item.id, 'duration', e.target.value)} className="w-20 bg-zinc-600 text-center rounded p-1 font-mono text-zinc-100" placeholder="mm:ss" />
                          {queue.length >= 2 && (
                            <Button variant="ghost" onClick={() => handleRemoveItem(item.id)} className="text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></Button>
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
            <Button type="submit">
              Create Session and Get Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}