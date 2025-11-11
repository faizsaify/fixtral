'use client';

import { Navigation } from '@/components/navigation';
import { Play, Pause, SkipForward, AlertCircle } from 'lucide-react';

import PhotoshopRequestQueue from '@/components/PhotoshopRequestQueue';
import { useState, useEffect } from 'react';


// Live Reddit queue stats
function useRedditQueueStats() {
  const [stats, setStats] = useState({ total: 0, processing: 0, waiting: 0, completed: 0 });
  const [redditApiStatus, setRedditApiStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  useEffect(() => {
    fetch('/api/photoshop-request')
      .then((res) => {
        if (res.status === 200) {
          setRedditApiStatus('CONNECTED');
          return res.json();
        } else {
          setRedditApiStatus('DISCONNECTED');
          return [];
        }
      })
      .then((data) => {
        const total = data.length;
        setStats({
          total,
          processing: total > 0 ? 1 : 0,
          waiting: total > 1 ? total - 1 : 0,
          completed: 156
        });
      })
      .catch(() => setRedditApiStatus('DISCONNECTED'));
  }, []);
  return { stats, redditApiStatus };
}

export default function Queue() {
  const [isProcessing, setIsProcessing] = useState(true);
  const { stats, redditApiStatus } = useRedditQueueStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="brutalist-subheading">
            PROCESSING <span className="text-accent">QUEUE</span>
          </h1>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsProcessing(!isProcessing)}
              className={`brutalist-button flex items-center gap-3 ${
                isProcessing ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {isProcessing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isProcessing ? 'PAUSE' : 'START'}
            </button>
            <button className="brutalist-button flex items-center gap-3">
              <SkipForward className="w-5 h-5" />
              SKIP
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="brutalist-panel text-center">
            <div className="text-4xl font-bold mb-2">{stats.total}</div>
            <div className="font-bold uppercase text-sm tracking-wide">TOTAL QUEUE</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-4xl font-bold mb-2 text-accent">{stats.processing}</div>
            <div className="font-bold uppercase text-sm tracking-wide">PROCESSING</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-4xl font-bold mb-2">{stats.waiting}</div>
            <div className="font-bold uppercase text-sm tracking-wide">WAITING</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-4xl font-bold mb-2">{stats.completed}</div>
            <div className="font-bold uppercase text-sm tracking-wide">COMPLETED TODAY</div>
          </div>
        </div>

  {/* Reddit PhotoshopRequest Live Queue */}
  <h2 className="text-2xl font-bold uppercase my-8">Live Reddit Queue: r/PhotoshopRequest</h2>
  <PhotoshopRequestQueue />

        {/* System Status */}
        <div className="mt-12 brutalist-panel-dark">
          <h2 className="text-2xl font-bold uppercase mb-6">SYSTEM STATUS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-bold uppercase text-sm tracking-wide mb-2">AI MODEL</div>
              <div className="text-accent font-bold">ONLINE</div>
            </div>
            <div>
              <div className="font-bold uppercase text-sm tracking-wide mb-2">REDDIT API</div>
              <div className={redditApiStatus === 'CONNECTED' ? 'text-accent font-bold' : 'text-red-600 font-bold'}>
                {redditApiStatus}
              </div>
            </div>
            <div>
              <div className="font-bold uppercase text-sm tracking-wide mb-2">PROCESSING SPEED</div>
              <div className="text-accent font-bold">2.3 IMG/MIN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}