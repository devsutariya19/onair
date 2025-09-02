'use client'

import {X, Menu, ChartNoAxesGantt } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-[88px] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 transition-all duration-300 ease-in-out">
        <div className={`flex justify-between items-center transition-all duration-300 ease-in-out border ${isScrolled ? 'py-2 px-6 bg-zinc-900/80 backdrop-blur-lg rounded-full border-zinc-700 shadow-xl' : 'py-6 px-0 bg-transparent rounded-none border-transparent border-b-zinc-800'}`}>
          <Link href="/" className="text-2xl font-bold text-teal-400 flex items-center gap-2">
            <ChartNoAxesGantt className="bg-teal-500 text-white rounded-full p-1" />
            OnAir Timer
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-teal-400 transition-colors">How It Works</a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button className='bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-full transition-colors shadow-lg text-sm'>
                Get Started
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Button variant='ghost' size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 focus:outline-none">
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-zinc-900 rounded-3xl border-1 border-zinc-700">
          <nav className="flex flex-col items-center space-y-4 px-6 py-4">
            <Link href="#features" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-teal-400 transition-colors text-lg">Features</Link>
            <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-teal-400 transition-colors text-lg">How It Works</Link>
            <Link href="#" className="bg-teal-600 hover:bg-teal-500 w-full text-center text-white font-semibold py-3 px-5 rounded-lg transition-colors shadow-lg mt-2">
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}