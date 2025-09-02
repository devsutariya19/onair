import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-8xl font-black tracking-tighter text-zinc-300 sm:text-9xl">
          404
        </h1>
        <h2 className="text-2xl font-bold sm:text-3xl">Page Not Found</h2>
        <p className="max-w-md text-zinc-400 my-4">
          Sorry, we couldn't find the page you were looking for. It might have been
          moved, deleted, or the link might be broken.
        </p>
        <Link href="/">
          <Button variant='outline' className="px-6 py-3 text-md text-zinc-100">
            Return to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
