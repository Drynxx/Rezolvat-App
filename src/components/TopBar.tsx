import React from 'react';
import { Bell, HelpCircle, Scale, Car, FileText, Landmark, Camera, Shield, Sun, Moon } from 'lucide-react';
import { AppTab } from '../types';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 w-full z-40 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--nav-border)] transition-colors duration-200">
      <div className="flex justify-between items-center px-4 md:px-6 h-16 w-full max-w-6xl mx-auto">

        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('autodox')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${isDark
            ? 'bg-gradient-to-br from-[#0058FF]/25 to-[#38BDF8]/25 border border-[#38BDF8]/30 text-[#38BDF8]'
            : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-lg font-black tracking-tight text-[var(--text-main)]">
                ZIRO
              </span>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-full uppercase ${isDark
                ? 'text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20'
                : 'text-[#0058FF] bg-[#0058FF]/10'
                }`}>
                RO
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (AutoDox in Focus, others in-progress) */}
        <nav className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-full border transition-colors ${isDark
          ? 'bg-[#1C1F2B] border-white/[0.08] shadow-inner'
          : 'bg-[#F9FAFB] border-[#E5E7EB]'
          }`}>
          {/* Primary: AutoDox */}
          <button
            onClick={() => setActiveTab('autodox')}
            className={`flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'autodox'
              ? 'bg-[#0058FF] text-white shadow-[0_0_12px_rgba(0,88,255,0.4)]'
              : isDark
                ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.04]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
              }`}
          >
            <Car className="w-4 h-4" />
            <span>Auto</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${activeTab === 'autodox' ? 'bg-white/20 text-white' : 'bg-[#0058FF]/15 text-[#38BDF8]'
              }`}>Activ</span>
          </button>

          {/* In Progress: Amenzi */}
          <button
            onClick={() => setActiveTab('amendaguard')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'amendaguard'
              ? isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'opacity-65 hover:opacity-100 text-[var(--text-muted)]'
              }`}
            title="Modul în dezvoltare (În lucru)"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Amenzi</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Curând
            </span>
          </button>

          {/* In Progress: ANPC */}
          <button
            onClick={() => setActiveTab('anpc')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'anpc'
              ? isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'opacity-65 hover:opacity-100 text-[var(--text-muted)]'
              }`}
            title="Modul în dezvoltare (În lucru)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ANPC</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Curând
            </span>
          </button>

          {/* In Progress: Ghișeu */}
          <button
            onClick={() => setActiveTab('ghiseu')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium transition-all cursor-pointer ${activeTab === 'ghiseu' || activeTab === 'pricing'
              ? isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'opacity-65 hover:opacity-100 text-[var(--text-muted)]'
              }`}
            title="Modul în dezvoltare (În lucru)"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Ghișeu</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Curând
            </span>
          </button>
        </nav>

        {/* Right: Actions, Theme Switcher & Notifications */}
        <div className="flex items-center gap-2">

          {/* Quick Scan Button (Desktop) */}
          <button
            onClick={onQuickScan}
            className="hidden lg:flex items-center gap-2 py-2 px-4 rounded-full bg-[#0058FF] hover:bg-[#0047D4] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
            <span>Scanare AI</span>
          </button>

          {/* Theme Toggle Button (Light ☀️ / Dark 🌙) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all cursor-pointer ${isDark
              ? 'text-[#38BDF8] hover:bg-white/[0.08] hover:text-white'
              : 'text-[#6B7280] hover:bg-gray-100 hover:text-[#111827]'
              }`}
            title={`Comută pe tema ${isDark ? 'luminoasă (White)' : 'întunecată (Dark-Depth)'}`}
            aria-label="Comută tema"
          >
            {isDark ? (
              <Sun className="w-5 h-5 stroke-[1.8] text-[#FBBF24]" />
            ) : (
              <Moon className="w-5 h-5 stroke-[1.8] text-[#4B5563]" />
            )}
          </button>

          {/* Legal Disclaimer */}
          <button
            onClick={onOpenDisclaimer}
            className={`p-2 rounded-full transition-colors cursor-pointer ${isDark ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.06]' : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
            title="Aviz Legal & Conformitate"
          >
            <HelpCircle className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Notifications */}
          <button className={`relative p-2 rounded-full transition-colors cursor-pointer ${isDark ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.06]' : 'text-[#111827] hover:opacity-80'
            }`}>
            <Bell className="w-5 h-5 stroke-[1.5]" />
            {unreadCount > 0 && (
              <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isDark ? 'bg-[#FFB7B2] shadow-[0_0_8px_#FFB7B2]' : 'bg-[#E11D48]'
                } ring-2 ${isDark ? 'ring-[#0A0E17]' : 'ring-white'}`} />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
