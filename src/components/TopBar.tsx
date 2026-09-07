import React from 'react';
import { Bell, HelpCircle, Scale, Car, FileText, Landmark, Camera, Shield, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 w-full z-40 bg-[var(--nav-bg)] backdrop-blur-2xl border-b border-[var(--nav-border)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors duration-200">
      <div className="flex justify-between items-center px-4 md:px-6 h-16 w-full max-w-6xl mx-auto">

        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('autodox')}
          className="flex items-center gap-2.5 cursor-pointer select-none group btn-press"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActiveTab('autodox')}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#0058FF]/30 to-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] shadow-[0_0_14px_rgba(0,88,255,0.3)]'
              : 'bg-[#0058FF]/10 text-[#0058FF] border border-[#0058FF]/15'
          }`}>
            <Shield className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-lg font-black tracking-display text-[var(--text-main)]">
                ZIRO
              </span>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-full uppercase ${
                isDark
                  ? 'text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/25 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                  : 'text-[#0058FF] bg-[#0058FF]/10 border border-[#0058FF]/15'
              }`}>
                RO
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Fluid Framer Motion Indicator) */}
        <nav className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-colors ${
          isDark
            ? 'bg-[#121622]/90 border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]'
            : 'bg-[#F2F3F5]/90 border-black/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]'
        }`}>
          {/* Primary: AutoDox */}
          <button
            onClick={() => setActiveTab('autodox')}
            className={`relative flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-semibold cursor-pointer z-10 btn-press ${
              activeTab === 'autodox'
                ? 'text-white font-bold'
                : isDark
                  ? 'text-[#A0A0A0] hover:text-white'
                  : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {activeTab === 'autodox' && (
              <motion.div
                layoutId="topbar-active-pill"
                className="absolute inset-0 rounded-full bg-[#0058FF] shadow-[0_2px_12px_rgba(0,88,255,0.45)] -z-10"
                transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
              />
            )}
            <Car className="w-4 h-4 stroke-[2]" />
            <span>Auto</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              activeTab === 'autodox' ? 'bg-white/20 text-white' : 'bg-[#0058FF]/15 text-[#38BDF8]'
            }`}>
              Activ
            </span>
          </button>

          {/* In Progress: Amenzi */}
          <button
            onClick={() => setActiveTab('amendaguard')}
            className={`relative flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer z-10 btn-press ${
              activeTab === 'amendaguard'
                ? isDark ? 'text-amber-300 font-bold' : 'text-amber-800 font-bold'
                : 'opacity-70 hover:opacity-100 text-[var(--text-muted)]'
            }`}
            title="Modul în dezvoltare (În lucru)"
          >
            {activeTab === 'amendaguard' && (
              <motion.div
                layoutId="topbar-active-pill"
                className={`absolute inset-0 rounded-full -z-10 ${
                  isDark ? 'bg-amber-500/20 border border-amber-500/35' : 'bg-amber-100 border border-amber-200'
                }`}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
              />
            )}
            <Scale className="w-3.5 h-3.5" />
            <span>Amenzi</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Curând
            </span>
          </button>

          {/* In Progress: ANPC */}
          <button
            onClick={() => setActiveTab('anpc')}
            className={`relative flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer z-10 btn-press ${
              activeTab === 'anpc'
                ? isDark ? 'text-cyan-300 font-bold' : 'text-cyan-800 font-bold'
                : 'opacity-70 hover:opacity-100 text-[var(--text-muted)]'
            }`}
            title="Modul în dezvoltare (În lucru)"
          >
            {activeTab === 'anpc' && (
              <motion.div
                layoutId="topbar-active-pill"
                className={`absolute inset-0 rounded-full -z-10 ${
                  isDark ? 'bg-cyan-500/20 border border-cyan-500/35' : 'bg-cyan-100 border border-cyan-200'
                }`}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
              />
            )}
            <FileText className="w-3.5 h-3.5" />
            <span>ANPC</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              Curând
            </span>
          </button>

          {/* In Progress: Ghișeu */}
          <button
            onClick={() => setActiveTab('ghiseu')}
            className={`relative flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium cursor-pointer z-10 btn-press ${
              activeTab === 'ghiseu' || activeTab === 'pricing'
                ? isDark ? 'text-indigo-300 font-bold' : 'text-indigo-800 font-bold'
                : 'opacity-70 hover:opacity-100 text-[var(--text-muted)]'
            }`}
            title="Modul în dezvoltare (În lucru)"
          >
            {(activeTab === 'ghiseu' || activeTab === 'pricing') && (
              <motion.div
                layoutId="topbar-active-pill"
                className={`absolute inset-0 rounded-full -z-10 ${
                  isDark ? 'bg-indigo-500/20 border border-indigo-500/35' : 'bg-indigo-100 border border-indigo-200'
                }`}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
              />
            )}
            <Landmark className="w-3.5 h-3.5" />
            <span>Ghișeu</span>
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              Curând
            </span>
          </button>
        </nav>

        {/* Right: Actions, Theme Switcher & Notifications */}
        <div className="flex items-center gap-2">

          {/* Quick Scan Button (Desktop) */}
          <button
            onClick={onQuickScan}
            className="hidden lg:flex items-center gap-2 py-2 px-4 rounded-full bg-[#0058FF] hover:bg-[#0047D4] text-white text-xs font-semibold shadow-[0_2px_10px_rgba(0,88,255,0.3)] transition-all cursor-pointer btn-press"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
            <span>Scanare AI</span>
          </button>

          {/* Theme Toggle Button (Light ☀️ / Dark 🌙) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full cursor-pointer btn-press ${
              isDark
                ? 'text-[#FBBF24] hover:bg-white/[0.08]'
                : 'text-[#4B5563] hover:bg-black/[0.05]'
            }`}
            title={`Comută pe tema ${isDark ? 'luminoasă (Light)' : 'întunecată (Dark-Depth)'}`}
            aria-label="Comută tema"
          >
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ scale: 0.8, rotate: isDark ? -30 : 30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              {isDark ? (
                <Sun className="w-5 h-5 stroke-[1.8]" />
              ) : (
                <Moon className="w-5 h-5 stroke-[1.8]" />
              )}
            </motion.div>
          </button>

          {/* Legal Disclaimer */}
          <button
            onClick={onOpenDisclaimer}
            className={`p-2 rounded-full cursor-pointer btn-press ${
              isDark ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.06]' : 'text-[#6B7280] hover:text-[#111827] hover:bg-black/[0.05]'
            }`}
            title="Aviz Legal & Conformitate"
          >
            <HelpCircle className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Notifications */}
          <button className={`relative p-2 rounded-full cursor-pointer btn-press ${
            isDark ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.06]' : 'text-[#111827] hover:bg-black/[0.05]'
          }`}>
            <Bell className="w-5 h-5 stroke-[1.5]" />
            {unreadCount > 0 && (
              <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                isDark ? 'bg-[#FFB7B2] shadow-[0_0_8px_#FFB7B2]' : 'bg-[#E11D48]'
              } ring-2 ${isDark ? 'ring-[#0A0E17]' : 'ring-white'}`} />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
