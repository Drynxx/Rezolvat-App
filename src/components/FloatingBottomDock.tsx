import React from 'react';
import { Scale, Car, Plus, FileText, Landmark } from 'lucide-react';
import { AppTab } from '../types';

interface FloatingBottomDockProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onQuickScan: () => void;
}

export const FloatingBottomDock: React.FC<FloatingBottomDockProps> = ({
  activeTab,
  setActiveTab,
  onQuickScan,
}) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none md:hidden">
      <nav className="pointer-events-auto flex items-center justify-between gap-1 p-2 rounded-full bg-[#080B11]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] max-w-sm w-full">
        
        {/* 1. Amenzi */}
        <button
          onClick={() => setActiveTab('amendaguard')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
            activeTab === 'amendaguard'
              ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Amenzi</span>
        </button>

        {/* 2. AutoDox */}
        <button
          onClick={() => setActiveTab('autodox')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
            activeTab === 'autodox'
              ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">AutoDox</span>
        </button>

        {/* 3. Center Elevated Glowing Cyan Scan Button */}
        <button
          onClick={onQuickScan}
          title="Scanează Document cu AI"
          aria-label="Scanează"
          className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 border border-cyan-300/40 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(6,182,212,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] active:scale-95 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 4. ANPC */}
        <button
          onClick={() => setActiveTab('anpc')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
            activeTab === 'anpc'
              ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">ANPC</span>
        </button>

        {/* 5. Ghișeu */}
        <button
          onClick={() => setActiveTab('ghiseu')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all cursor-pointer ${
            activeTab === 'ghiseu' || activeTab === 'pricing'
              ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Ghișeu</span>
        </button>

      </nav>
    </div>
  );
};
