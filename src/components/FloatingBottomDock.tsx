import React from 'react';
import { Gavel, Car, PlusSquare, FileText, Landmark } from 'lucide-react';
import { AppTab } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark } = useTheme();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center px-4 py-2.5 max-w-md mx-auto md:hidden backdrop-blur-xl transition-colors duration-200 ${
      isDark
        ? 'bg-[#0A0E17]/95 border-t border-white/[0.08] shadow-[0px_-4px_24px_rgba(0,0,0,0.5)]'
        : 'bg-white/95 border-t border-[#E5E7EB] shadow-[0px_-4px_20px_rgba(0,0,0,0.03)]'
    }`}>
      
      {/* 1. Auto (Primary Active Focus) */}
      <button
        onClick={() => setActiveTab('autodox')}
        className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
          activeTab === 'autodox'
            ? isDark
              ? 'text-white bg-[#0058FF] shadow-[0_0_14px_rgba(0,88,255,0.5)] border border-[#38BDF8]/40 rounded-full px-5 py-1.5 font-bold'
              : 'text-[#0058FF] bg-[#0058FF]/10 rounded-full px-5 py-1.5 font-bold'
            : isDark
              ? 'text-[#A0A0A0] hover:text-white px-4 py-1.5'
              : 'text-[#9CA3AF] hover:text-[#111827] px-4 py-1.5'
        }`}
      >
        <Car className="w-5 h-5 mb-0.5 stroke-[1.8]" />
        <span className="text-[10px] font-bold">AutoDox</span>
      </button>

      {/* 2. Scan (Documente Auto) */}
      <button
        onClick={onQuickScan}
        className={`flex flex-col items-center justify-center px-4 py-1.5 transition-colors cursor-pointer ${
          isDark ? 'text-[#38BDF8] hover:text-white' : 'text-[#9CA3AF] hover:text-[#0058FF]'
        }`}
        title="Scanează Buletin / Talon Auto"
      >
        <PlusSquare className="w-5 h-5 mb-0.5 stroke-[1.8]" />
        <span className="text-[10px] font-bold">Scan AI</span>
      </button>

      {/* 3. Amenzi (In Progress) */}
      <button
        onClick={() => setActiveTab('amendaguard')}
        className={`flex flex-col items-center justify-center transition-all cursor-pointer relative ${
          activeTab === 'amendaguard'
            ? isDark
              ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 font-bold'
              : 'text-amber-700 bg-amber-100 rounded-full px-4 py-1.5 font-bold'
            : 'opacity-60 text-[var(--text-muted)] hover:opacity-100 px-3 py-1.5'
        }`}
        title="Modul în dezvoltare (În lucru)"
      >
        <div className="relative">
          <Gavel className="w-4 h-4 mb-0.5 stroke-[1.8]" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
        <span className="text-[9px] font-medium">Amenzi</span>
      </button>

      {/* 4. ANPC (In Progress) */}
      <button
        onClick={() => setActiveTab('anpc')}
        className={`flex flex-col items-center justify-center transition-all cursor-pointer relative ${
          activeTab === 'anpc'
            ? isDark
              ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 font-bold'
              : 'text-amber-700 bg-amber-100 rounded-full px-4 py-1.5 font-bold'
            : 'opacity-60 text-[var(--text-muted)] hover:opacity-100 px-3 py-1.5'
        }`}
        title="Modul în dezvoltare (În lucru)"
      >
        <div className="relative">
          <FileText className="w-4 h-4 mb-0.5 stroke-[1.8]" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
        <span className="text-[9px] font-medium">ANPC</span>
      </button>

      {/* 5. Ghișeu (In Progress) */}
      <button
        onClick={() => setActiveTab('ghiseu')}
        className={`flex flex-col items-center justify-center transition-all cursor-pointer relative ${
          activeTab === 'ghiseu' || activeTab === 'pricing'
            ? isDark
              ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 font-bold'
              : 'text-amber-700 bg-amber-100 rounded-full px-4 py-1.5 font-bold'
            : 'opacity-60 text-[var(--text-muted)] hover:opacity-100 px-3 py-1.5'
        }`}
        title="Modul în dezvoltare (În lucru)"
      >
        <div className="relative">
          <Landmark className="w-4 h-4 mb-0.5 stroke-[1.8]" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
        <span className="text-[9px] font-medium">Ghișeu</span>
      </button>

    </nav>
  );
};
