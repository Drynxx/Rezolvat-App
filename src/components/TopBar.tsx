import React from 'react';
import { ShieldCheck, Bell, HelpCircle, Scale, Car, FileText, Landmark, Camera, Sparkles } from 'lucide-react';
import { AppTab } from '../types';

interface TopBarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenDisclaimer: () => void;
  onQuickScan: () => void;
  unreadCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDisclaimer,
  onQuickScan,
  unreadCount = 1,
}) => {
  return (
    <header className="sticky top-0 w-full z-40 bg-[#080B11]/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-7xl mx-auto">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('amendaguard')}>
          <div className="relative flex items-center justify-center">
            {/* Glowing cyan aura */}
            <div className="absolute inset-0 bg-cyan-500/25 rounded-2xl blur-lg pointer-events-none" />
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] relative z-10">
              <ShieldCheck className="w-5 h-5 stroke-[2.4] text-cyan-400" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-extrabold tracking-tight text-white leading-none">
                Rezolvat
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                AI RO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium tracking-normal mt-1 leading-none">
              Birocrație. Rezolvată.
            </span>
          </div>
        </div>

        {/* Center: Desktop Floating Navigation Pill Switcher */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/50 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <button
            onClick={() => setActiveTab('amendaguard')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'amendaguard'
                ? 'bg-white/[0.12] text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-xl'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rezolvat Amenzi</span>
          </button>

          <button
            onClick={() => setActiveTab('autodox')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'autodox'
                ? 'bg-white/[0.12] text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-xl'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rezolvat Auto (5x)</span>
          </button>

          <button
            onClick={() => setActiveTab('anpc')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'anpc'
                ? 'bg-white/[0.12] text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-xl'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Rezolvat ANPC</span>
          </button>

          <button
            onClick={() => setActiveTab('ghiseu')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'ghiseu' || activeTab === 'pricing'
                ? 'bg-white/[0.12] text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] border border-white/20 backdrop-blur-xl'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rezolvat Ghișeu</span>
          </button>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Quick Scan AI Button (Desktop) */}
          <button
            onClick={onQuickScan}
            className="hidden lg:flex items-center gap-2 py-2.5 px-5 rounded-2xl btn-primary-action text-xs font-bold cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Scanează cu AI</span>
          </button>

          {/* Legal Compliance Disclaimer */}
          <button
            onClick={onOpenDisclaimer}
            title="Cadrul Legal & Conformitate Statutară"
            aria-label="Informații legale"
            className="w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button 
            title="Notificări" 
            aria-label="Notificări dosar"
            className="w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center relative transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
