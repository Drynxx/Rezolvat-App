import React from 'react';
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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 px-2 glass-panel rounded-full pb-0 pointer-events-auto md:hidden">
      <div className="flex justify-between items-center h-16">
        
        {/* 1. Home / Amenzi */}
        <button
          onClick={() => setActiveTab('amendaguard')}
          title="Rezolvat Amenzi"
          aria-label="Amenzi"
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === 'amendaguard'
              ? 'bg-primary text-on-primary shadow-[0_-4px_12px_rgba(255,255,255,0.2)] scale-110'
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
        </button>

        {/* 2. Auto (ITL 054) */}
        <button
          onClick={() => setActiveTab('autodox')}
          title="Rezolvat Auto"
          aria-label="Auto"
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === 'autodox'
              ? 'bg-primary text-on-primary shadow-[0_-4px_12px_rgba(255,255,255,0.2)] scale-110'
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">directions_car</span>
        </button>

        {/* 3. Center Elevated Quick Scan Bolt */}
        <button
          onClick={onQuickScan}
          title="Scanează Document cu AI"
          aria-label="Scanează"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-[0_0_20px_rgba(123,208,255,0.4)] transition-all duration-300 -translate-y-2 active:scale-95 cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[26px]">bolt</span>
        </button>

        {/* 4. ANPC / Reclamații */}
        <button
          onClick={() => setActiveTab('anpc')}
          title="Rezolvat ANPC"
          aria-label="ANPC"
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === 'anpc'
              ? 'bg-primary text-on-primary shadow-[0_-4px_12px_rgba(255,255,255,0.2)] scale-110'
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">folder_open</span>
        </button>

        {/* 5. Ghișeu Navigator */}
        <button
          onClick={() => setActiveTab('ghiseu')}
          title="Rezolvat Ghișeu"
          aria-label="Ghișeu"
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
            activeTab === 'ghiseu' || activeTab === 'pricing'
              ? 'bg-primary text-on-primary shadow-[0_-4px_12px_rgba(255,255,255,0.2)] scale-110'
              : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">smart_toy</span>
        </button>

      </div>
    </nav>
  );
};
