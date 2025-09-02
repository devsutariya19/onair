'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import React from 'react'
import { addMessage } from '@/app/t/[id]/controller/actions'
import { toast } from 'sonner'

export default function NewMessage({sessionId}: {sessionId: string}) {
  const [message, setMessage] = React.useState('');

  const handleAddMessage = () => {
    toast.promise(addMessage(sessionId, message), {
      loading: "Adding Message...",
      success: "Message added successfully!",
      error: (err) => `Failed to add message: ${err.message}`,
    });
  }

  return (
    <Dialog onOpenChange={() => setMessage('')}>
      <DialogTrigger asChild>
        <Button variant="default" size='sm'><Plus/>New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Create a new message for the clients</DialogDescription>
        </DialogHeader>
          <Textarea placeholder="Type your message here." value={message} onChange={(e) => setMessage(e.target.value)}/>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="default" onClick={handleAddMessage}>Add</Button>
            </DialogClose>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
