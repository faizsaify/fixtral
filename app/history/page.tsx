'use client';

import { Navigation } from '@/components/navigation';
import { Download, Eye, Trash2, Filter } from 'lucide-react';
import { useState } from 'react';

const historyItems = [
  { id: 1, title: 'WATERMARK REMOVAL', user: 'u/photographer123', date: '2025-01-15', status: 'COMPLETED', type: 'WATERMARK' },
  { id: 2, title: 'QUALITY ENHANCEMENT', user: 'u/designer456', date: '2025-01-15', status: 'COMPLETED', type: 'ENHANCE' },
  { id: 3, title: 'COLOR CORRECTION', user: 'u/artist789', date: '2025-01-14', status: 'COMPLETED', type: 'COLOR' },
  { id: 4, title: 'OBJECT REMOVAL', user: 'u/editor101', date: '2025-01-14', status: 'FAILED', type: 'REMOVAL' },
  { id: 5, title: 'IMAGE UPSCALING', user: 'u/creator202', date: '2025-01-13', status: 'COMPLETED', type: 'UPSCALE' },
  { id: 6, title: 'NOISE REDUCTION', user: 'u/photo303', date: '2025-01-13', status: 'COMPLETED', type: 'DENOISE' },
];

export default function History() {
  const [filter, setFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const filteredItems = filter === 'ALL' 
    ? historyItems 
    : historyItems.filter(item => item.status === filter);

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="brutalist-subheading">
            PROCESSING <span className="text-accent">HISTORY</span>
          </h1>
          
          <div className="flex gap-4">
            <button className="brutalist-button flex items-center gap-3">
              <Filter className="w-5 h-5" />
              FILTER
            </button>
            {selectedItems.length > 0 && (
              <button className="brutalist-button flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                DELETE ({selectedItems.length})
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="brutalist-panel text-center">
            <div className="text-3xl font-bold mb-2">1,247</div>
            <div className="font-bold uppercase text-xs tracking-wide">TOTAL PROCESSED</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-3xl font-bold mb-2 text-accent">1,198</div>
            <div className="font-bold uppercase text-xs tracking-wide">SUCCESSFUL</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-3xl font-bold mb-2 text-red-500">49</div>
            <div className="font-bold uppercase text-xs tracking-wide">FAILED</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-3xl font-bold mb-2">96.1%</div>
            <div className="font-bold uppercase text-xs tracking-wide">SUCCESS RATE</div>
          </div>
          <div className="brutalist-panel text-center">
            <div className="text-3xl font-bold mb-2">2.1s</div>
            <div className="font-bold uppercase text-xs tracking-wide">AVG TIME</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-0 mb-8">
          {['ALL', 'COMPLETED', 'FAILED'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-3 border-2 border-border font-bold uppercase tracking-wide transition-all duration-100 ${
                filter === filterType
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* History Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="brutalist-panel">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className={`w-6 h-6 border-2 border-border cursor-pointer ${
                    selectedItems.includes(item.id) ? 'bg-foreground' : 'bg-background'
                  }`}
                  onClick={() => toggleSelection(item.id)}
                ></div>
                <div className={`px-3 py-1 border-2 border-border font-bold text-xs ${
                  item.status === 'COMPLETED' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-red-500 text-background'
                }`}>
                  {item.status}
                </div>
              </div>
              
              <div className="aspect-square bg-gray-200 border-2 border-border mb-4 flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400">IMG</div>
              </div>
              
              <h3 className="font-bold uppercase text-sm mb-2">{item.title}</h3>
              <p className="font-bold uppercase text-xs tracking-wide text-gray-600 mb-2">
                {item.user}
              </p>
              <p className="font-bold uppercase text-xs tracking-wide text-gray-600 mb-4">
                {item.date} • {item.type}
              </p>
              
              <div className="flex gap-2">
                <button className="brutalist-button text-xs px-3 py-2 flex-1 flex items-center justify-center gap-2">
                  <Eye className="w-3 h-3" />
                  VIEW
                </button>
                <button className="brutalist-button text-xs px-3 py-2 flex-1 flex items-center justify-center gap-2">
                  <Download className="w-3 h-3" />
                  SAVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="brutalist-button-accent">
            LOAD MORE RESULTS
          </button>
        </div>
      </div>
    </div>
  );
}