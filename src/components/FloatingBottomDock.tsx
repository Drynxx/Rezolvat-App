import React from 'react';
import { Gavel, Car, PlusSquare, FileText, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-50 md:hidden pointer-events-none">
      <nav className={`pointer-events-auto w-full flex justify-around items-center px-2 py-1.5 rounded-full backdrop-blur-2xl transition-colors duration-200 ${
        isDark
          ? 'bg-[#0A0E17]/88 border border-white/[0.12] shadow-[0_12px_36px_-6px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.12)]'
          : 'bg-white/88 border border-black/[0.08] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)]'
      }`}>
        
        {/* 1. Auto (Primary Active Focus) */}
        <button
          onClick={() => setActiveTab('autodox')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full cursor-pointer z-10 btn-press transition-colors ${
            activeTab === 'autodox'
              ? 'text-white'
              : isDark ? 'text-[#98989D] hover:text-white' : 'text-[#6E6E73] hover:text-[#111827]'
          }`}
        >
          {activeTab === 'autodox' && (
            <motion.div
              layoutId="dock-active-pill"
              className="absolute inset-0 rounded-full bg-[#0058FF] shadow-[0_2px_12px_rgba(0,88,255,0.5)] -z-10"
              transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
            />
          )}
          <Car className="w-5 h-5 mb-0.5 stroke-[1.9]" />
          <span className="text-[10px] font-bold tracking-tight">AutoDox</span>
        </button>

        {/* 2. Scan AI (Quick Action) */}
        <button
          onClick={onQuickScan}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full cursor-pointer btn-press transition-colors ${
            isDark ? 'text-[#38BDF8] hover:text-white' : 'text-[#0058FF] hover:text-[#0047D4]'
          }`}
          title="Scanează Buletin / Talon Auto"
        >
          <div className="relative">
            <PlusSquare className="w-5 h-5 mb-0.5 stroke-[2]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0058FF] animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Scan AI</span>
        </button>

        {/* 3. Amenzi (In Progress) */}
        <button
          onClick={() => setActiveTab('amendaguard')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full cursor-pointer z-10 btn-press transition-colors ${
            activeTab === 'amendaguard'
              ? isDark ? 'text-amber-300 font-bold' : 'text-amber-800 font-bold'
              : 'opacity-65 hover:opacity-100 text-[var(--text-muted)]'
          }`}
          title="Modul în dezvoltare (În lucru)"
        >
          {activeTab === 'amendaguard' && (
            <motion.div
              layoutId="dock-active-pill"
              className={`absolute inset-0 rounded-full -z-10 ${
                isDark ? 'bg-amber-500/20 border border-amber-500/35' : 'bg-amber-100 border border-amber-200'
              }`}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
            />
          )}
          <div className="relative">
            <Gavel className="w-4 h-4 mb-0.5 stroke-[1.8]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <span className="text-[9px] font-medium">Amenzi</span>
        </button>

        {/* 4. ANPC (In Progress) */}
        <button
          onClick={() => setActiveTab('anpc')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full cursor-pointer z-10 btn-press transition-colors ${
            activeTab === 'anpc'
              ? isDark ? 'text-cyan-300 font-bold' : 'text-cyan-800 font-bold'
              : 'opacity-65 hover:opacity-100 text-[var(--text-muted)]'
          }`}
          title="Modul în dezvoltare (În lucru)"
        >
          {activeTab === 'anpc' && (
            <motion.div
              layoutId="dock-active-pill"
              className={`absolute inset-0 rounded-full -z-10 ${
                isDark ? 'bg-cyan-500/20 border border-cyan-500/35' : 'bg-cyan-100 border border-cyan-200'
              }`}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
            />
          )}
          <div className="relative">
            <FileText className="w-4 h-4 mb-0.5 stroke-[1.8]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          <span className="text-[9px] font-medium">ANPC</span>
        </button>

        {/* 5. Ghișeu (In Progress) */}
        <button
          onClick={() => setActiveTab('ghiseu')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full cursor-pointer z-10 btn-press transition-colors ${
            activeTab === 'ghiseu' || activeTab === 'pricing'
              ? isDark ? 'text-indigo-300 font-bold' : 'text-indigo-800 font-bold'
              : 'opacity-65 hover:opacity-100 text-[var(--text-muted)]'
          }`}
          title="Modul în dezvoltare (În lucru)"
        >
          {(activeTab === 'ghiseu' || activeTab === 'pricing') && (
            <motion.div
              layoutId="dock-active-pill"
              className={`absolute inset-0 rounded-full -z-10 ${
                isDark ? 'bg-indigo-500/20 border border-indigo-500/35' : 'bg-indigo-100 border border-indigo-200'
              }`}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
            />
          )}
          <div className="relative">
            <Landmark className="w-4 h-4 mb-0.5 stroke-[1.8]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </div>
          <span className="text-[9px] font-medium">Ghișeu</span>
        </button>

      </nav>
    </div>
  );
};
