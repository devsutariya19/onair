import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import ControlDash from '@/components/control-dash';
import ClientView from '@/components/client-view';

export default function Home() {
  return (
    <>
      <Navbar/>
      <main>
        <section className="py-20 md:py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-zinc-800/50 [mask-image:radial-gradient(ellipse_at_center,white_5%,transparent_70%)]"></div>
          <div className="container mx-auto px-6 relative">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 mb-6">
              Keep Everyone Perfectly in Sync.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
              The remote timer for live events, broadcasts, and workshops. Host a timer, share a link, and keep every presenter and viewer on the same page, in real-time.
            </p>
            <Link href="/dashboard">
              <Button className='bg-teal-600 hover:bg-teal-500 text-white font-semibold py-6 px-8 rounded-full transition-colors shadow-lg text-xl'>
                Start Your First Timer
              </Button>
            </Link>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100">A Flawless Flow, Every Time</h2>
              <p className="text-gray-400 mt-3 max-w-2xl mx-auto">From setup to broadcast in three intuitive steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-white">Build</h3>
                  <span className="text-5xl font-bold text-teal-400/20">01</span>
                </div>
                <p className="text-gray-400 mt-2 mb-6">Use the simple queue builder to lay out your event. Assign names and durations for each segment.</p>
                <div className="mt-auto">
                  <div className="bg-zinc-800 rounded-lg p-4 text-left text-sm">
                    <p className="font-semibold text-gray-300 mb-2">Event Queue</p>
                    <div className="p-2 rounded bg-teal-900/50 text-teal-300">Opening Remarks</div>
                    <div className="p-2 mt-2 rounded bg-zinc-700">Presentations</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-white">Share</h3>
                  <span className="text-5xl font-bold text-teal-400/20">02</span>
                </div>
                <p className="text-gray-400 mt-2 mb-6">Once you start the timer, a unique, secure link is generated. Share it with presenters, crew, or your audience.</p>
                <div className="mt-auto">
                  <div className="bg-zinc-800 rounded-lg p-4 text-left text-sm">
                    <p className="font-semibold text-gray-300 mb-2">Share Link</p>
                    <div className="p-3 rounded bg-zinc-700 font-mono text-gray-400 truncate">onairtimer.app/s/...</div>
                    <Button className="mt-3 w-full bg-teal-600 text-white py-2 rounded-md text-xs font-semibold">Copy Link</Button>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-white">Go Live</h3>
                  <span className="text-5xl font-bold text-teal-400/20">03</span>
                </div>
                <p className="text-gray-400 mt-2 mb-6">Anyone with the link sees your timer live. Pauses and skips are reflected instantly on every screen.</p>
                <div className="mt-auto">
                  <div className="bg-zinc-800 rounded-lg p-4 flex items-center justify-center h-full min-h-[95px]">
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <rect x="55" y="5" width="40" height="25" rx="2" className="text-zinc-500" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <path d="M70 30 L 80 30 L 75 35 Z" className="text-zinc-500" fill="currentColor" />
                          <text x="75" y="19" fontFamily="monospace" fontSize="8" className="text-teal-400" fill="currentColor" textAnchor="middle">HOST</text>
                        </g>
                        <path d="M75 35 Q 75 50 45 60" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 2" className="text-teal-500/50">
                          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                        </path>
                        <path d="M75 35 Q 75 50 75 70" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 2" className="text-teal-500/50">
                          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                        </path>
                        <path d="M75 35 Q 75 50 105 60" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 2" className="text-teal-500/50">
                          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                        </path>
                        <g transform="translate(25, 60)">
                          <rect x="0" y="0" width="25" height="35" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-zinc-500" />
                          <text x="12.5" y="21" fontFamily="monospace" fontSize="6" fill="currentColor" textAnchor="middle" className="text-teal-400">LIVE</text>
                        </g>
                        <g transform="translate(66, 70)">
                          <rect x="0" y="0" width="18" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-zinc-500" />
                          <text x="9" y="18" fontFamily="monospace" fontSize="5" fill="currentColor" textAnchor="middle" className="text-teal-400">LIVE</text>
                        </g>
                        <g transform="translate(100, 60)">
                          <rect x="0" y="0" width="25" height="35" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-zinc-500" />
                          <text x="12.5" y="21" fontFamily="monospace" fontSize="6" fill="currentColor" textAnchor="middle" className="text-teal-400">LIVE</text>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 bg-zinc-900 overflow-hidden">
          <div className="container mx-auto px-6 space-y-24">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Your Control Room, Simplified.</h2>
                <p className="text-lg text-gray-400">Manage your entire event from one powerful dashboard. Play, pause, adjust time on the fly, and see who's connected at a glance. It’s mission control for your timeline.</p>
              </div>
              <ControlDash startTime={1455} />
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">A Universal View for Everyone.</h2>
                <p className="text-lg text-gray-400">Whether your viewers are on a laptop, tablet, or phone, the timer is always clear, responsive, and perfectly in sync. No apps, no downloads, just a simple link.</p>
              </div>
              <ClientView startTime={1455} />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-2xl p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Run a Smoother Event?</h2>
              <p className="text-teal-200 max-w-2xl mx-auto mb-8">
                Stop juggling clocks and start focusing on your content. Try OnAir Timer today and experience perfectly synchronized events.
              </p>
              <Link href="/dashboard">
                <Button className='bg-white text-teal-700 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg'>
                  Start Your First Timer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 mt-10">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} OnAir Timer. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
