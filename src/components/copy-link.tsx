'use client'

import { Check, Copy, Link } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';

export default function CopyLink({ timerId, icon = true }: { timerId: string, icon?: boolean }) {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/t/${timerId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div>
      <Button variant={icon ? 'ghost' : 'secondary'} onClick={handleCopy} className=" text-zinc-500">
        {icon ? (
          copied ? <Check size={16} className="text-teal-400"/> : <Copy size={16}/>
        ) : (
          <>
            {copied ? <Check size={16} className="text-teal-300"/> : <Link size={16} className="text-zinc-300"/>}
            <span className="text-zinc-300 hidden sm:block">Share Link</span>
          </>
        )}
      </Button>
    </div>
  )
}
