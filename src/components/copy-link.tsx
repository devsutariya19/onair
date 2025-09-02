'use client'

import { Check, Copy, Link } from 'lucide-react';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';

export default function CopyLink({ sessionId, icon = true }: { sessionId: string, icon?: boolean }) {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/t/${sessionId}`;
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
          copied ? <Check className="text-teal-400"/> : <Copy/>
        ) : (
          <>
            {copied ? <Check className="text-teal-300"/> : <Link className="text-zinc-300"/>}
            <span className="text-zinc-300 hidden sm:block">Share Link</span>
          </>
        )}
      </Button>
    </div>
  )
}
