'use client';

import { Navigation } from '@/components/navigation';
import { RotateCcw, Download, Share2, Maximize2 } from 'lucide-react';
import { useState } from 'react';

export default function Editor() {
  const [showComparison, setShowComparison] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="brutalist-subheading mb-2">
              IMAGE <span className="text-accent">EDITOR</span>
            </h1>
            <p className="font-bold uppercase text-sm tracking-wide">
              CURRENT: WATERMARK REMOVAL - u/photographer123
            </p>
          </div>
          
          <div className="flex gap-4">
            <button className="brutalist-button flex items-center gap-3">
              <RotateCcw className="w-5 h-5" />
              REVERT
            </button>
            <button className="brutalist-button-accent flex items-center gap-3">
              <Download className="w-5 h-5" />
              DOWNLOAD
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Image Display */}
          <div className="lg:col-span-3">
            <div className="brutalist-panel mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold uppercase">COMPARISON VIEW</h2>
                <button 
                  onClick={() => setShowComparison(!showComparison)}
                  className="brutalist-button text-sm px-4 py-2"
                >
                  {showComparison ? 'SINGLE VIEW' : 'COMPARE'}
                </button>
              </div>
              
              {showComparison ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold uppercase text-sm tracking-wide mb-2">ORIGINAL</div>
                    <div className="aspect-square bg-gray-200 border-4 border-border flex items-center justify-center">
                      <div className="text-6xl font-bold text-gray-400">BEFORE</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold uppercase text-sm tracking-wide mb-2">PROCESSED</div>
                    <div className="aspect-square bg-accent/20 border-4 border-border flex items-center justify-center">
                      <div className="text-6xl font-bold text-accent">AFTER</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-bold uppercase text-sm tracking-wide mb-2">PROCESSED IMAGE</div>
                  <div className="aspect-video bg-accent/20 border-4 border-border flex items-center justify-center">
                    <div className="text-8xl font-bold text-accent">RESULT</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <button className="brutalist-button flex items-center justify-center gap-3">
                <Share2 className="w-5 h-5" />
                SHARE
              </button>
              <button className="brutalist-button flex items-center justify-center gap-3">
                <Maximize2 className="w-5 h-5" />
                FULLSCREEN
              </button>
              <button className="brutalist-button-accent">
                APPROVE & SEND
              </button>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Processing Info */}
            <div className="brutalist-panel-dark">
              <h3 className="text-lg font-bold uppercase mb-4">PROCESS INFO</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-bold uppercase text-xs tracking-wide mb-1">STATUS</div>
                  <div className="text-accent font-bold">COMPLETED</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-xs tracking-wide mb-1">TIME TAKEN</div>
                  <div className="font-bold">2.3 SECONDS</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-xs tracking-wide mb-1">AI MODEL</div>
                  <div className="font-bold">WATERMARK-V2</div>
                </div>
                <div>
                  <div className="font-bold uppercase text-xs tracking-wide mb-1">CONFIDENCE</div>
                  <div className="font-bold">97.2%</div>
                </div>
              </div>
            </div>

            {/* Manual Controls */}
            <div className="brutalist-panel">
              <h3 className="text-lg font-bold uppercase mb-4">MANUAL ADJUST</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-bold uppercase text-xs tracking-wide mb-2">INTENSITY</div>
                  <div className="w-full h-6 bg-gray-200 border-2 border-border">
                    <div className="w-3/4 h-full bg-foreground"></div>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-xs tracking-wide mb-2">PRECISION</div>
                  <div className="w-full h-6 bg-gray-200 border-2 border-border">
                    <div className="w-4/5 h-full bg-foreground"></div>
                  </div>
                </div>
                <button className="brutalist-button w-full">
                  REPROCESS
                </button>
              </div>
            </div>

            {/* Queue Navigation */}
            <div className="brutalist-panel">
              <h3 className="text-lg font-bold uppercase mb-4">QUEUE NAV</h3>
              <div className="space-y-3">
                <button className="brutalist-button w-full">
                  ← PREVIOUS
                </button>
                <div className="text-center font-bold">
                  1 OF 24
                </div>
                <button className="brutalist-button-accent w-full">
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}