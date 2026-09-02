import React from 'react';
import { HelpCircle, Camera } from 'lucide-react';
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
    <header className="fixed top-0 inset-x-0 z-50 glass-panel pt-safe">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => setActiveTab('amendaguard')}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-2xl bg-surface-container border border-secondary/30 flex items-center justify-center text-secondary shadow-[0_0_16px_rgba(123,208,255,0.25)]">
              <span className="material-symbols-outlined text-[22px] text-secondary">verified_user</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-[18px] md:text-[20px] font-bold tracking-tight text-white leading-none">
                Rezolvat
              </span>
              <span className="bg-tertiary/15 text-tertiary border border-tertiary/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                AI RO
              </span>
            </div>
            <span className="font-data-mono text-[11px] text-on-surface-variant tracking-normal mt-0.5 leading-none">
              Birocrație. Rezolvată.
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Pill Switcher */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-surface-container/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => setActiveTab('amendaguard')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'amendaguard'
                ? 'bg-primary text-on-primary shadow-[0_0_14px_rgba(196,198,210,0.25)] font-bold'
                : 'text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Rezolvat Amenzi</span>
          </button>

          <button
            onClick={() => setActiveTab('autodox')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'autodox'
                ? 'bg-primary text-on-primary shadow-[0_0_14px_rgba(196,198,210,0.25)] font-bold'
                : 'text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            <span>Rezolvat Auto (5x)</span>
          </button>

          <button
            onClick={() => setActiveTab('anpc')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'anpc'
                ? 'bg-primary text-on-primary shadow-[0_0_14px_rgba(196,198,210,0.25)] font-bold'
                : 'text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            <span>Rezolvat ANPC</span>
          </button>

          <button
            onClick={() => setActiveTab('ghiseu')}
            className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'ghiseu' || activeTab === 'pricing'
                ? 'bg-primary text-on-primary shadow-[0_0_14px_rgba(196,198,210,0.25)] font-bold'
                : 'text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            <span>Rezolvat Ghișeu</span>
          </button>
        </nav>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Quick Scan AI Button (Desktop) */}
          <button
            onClick={onQuickScan}
            className="hidden lg:flex items-center gap-2 py-2 px-4 rounded-full btn-primary-action text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Scanează cu AI</span>
          </button>

          {/* Legal Compliance Disclaimer */}
          <button
            onClick={onOpenDisclaimer}
            title="Cadrul Legal & Conformitate Statutară"
            aria-label="Informații legale"
            className="w-10 h-10 rounded-full bg-surface-container/60 hover:bg-white/10 border border-white/10 text-on-surface-variant hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
          </button>

          {/* Notifications Bell with Tertiary Dot */}
          <button 
            title="Notificări" 
            aria-label="Notificări dosar"
            className="w-10 h-10 rounded-full bg-surface-container/60 hover:bg-white/10 border border-white/10 text-on-surface-variant hover:text-white flex items-center justify-center relative transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-secondary relative flex-shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx-EJFsPlAoU3W1KvWcVUyGs42uQuv6oFjsfJOCUunRB974oUKHaEfmu6ChoZWtZE25_Fq5UzFKg1pkedgA930AuyPuOWHQ6oHqOSGpoqLi7gKHCNAgs4XvSGut1Hfp61M6wPOBBai8s41S2H4vcedxPUwmjcarV7o9c7WzojYD60xtGtI0xlfKrEBBSeGl1z6_QZvdYcKUMBPzLPznEbkfXtnMvZFn-6fGTJRmy_l8pQp22_TEYtE6A" 
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

      </div>
    </header>
  );
};
