import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, CreditCard, AlertTriangle } from 'lucide-react';
import { LegalAnalysisResult, ProcesVerbalExtractedData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface RadarHeroCardProps {
  analysis: LegalAnalysisResult;
  ticketData: ProcesVerbalExtractedData;
}

export const RadarHeroCard: React.FC<RadarHeroCardProps> = ({ analysis, ticketData }) => {
  const { isDark } = useTheme();
  const score = analysis.successScore;

  // SVG Gauge calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header Section */}
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-[28px] md:text-[32px] leading-tight font-bold text-[var(--text-main)] tracking-tight">
          Simulator Caz
        </h1>
        <p className="text-[15px] md:text-[16px] text-[var(--text-muted)] font-medium">
          Analiză preliminară Radar AmendaGuard
        </p>
      </div>

      {/* Core Visualization: Illuminated Probability Ring */}
      <div className="flex flex-col items-center justify-center pt-3 pb-2 relative">
        {/* Subtle Ambient Background Light (Dark Mode only) */}
        {isDark && (
          <div className="absolute w-44 h-44 rounded-full bg-[#0058FF]/15 blur-3xl pointer-events-none" />
        )}
        
        <div className={`relative w-40 h-40 flex items-center justify-center ${isDark ? 'ring-glow' : ''}`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="illuminatedRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#0058FF" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Background Base Ring Track */}
            <circle
              className={isDark ? "text-[#1C1F2B]" : "text-gray-100"}
              cx="50"
              cy="50"
              fill="none"
              r={radius}
              stroke="currentColor"
              strokeWidth="6.5"
            />
            
            {/* Active Stroke */}
            <motion.circle
              cx="50"
              cy="50"
              fill="none"
              r={radius}
              stroke={isDark ? "url(#illuminatedRingGrad)" : "#0058FF"}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              strokeWidth="6.5"
            />
          </svg>

          {/* Center Typography */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span 
              key={score}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-extrabold text-[var(--text-main)] tracking-tight"
            >
              {score}%
            </motion.span>
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
              Șanse succes
            </span>
          </div>
        </div>
      </div>

      {/* Case Details Area: Panel */}
      <div className="app-panel p-6 flex flex-col items-center text-center relative overflow-hidden">
        {isDark && (
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none" />
        )}
        <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
          Radar AmendaGuard
        </h3>
        <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed max-w-md">
          {analysis.verdictTitle}. Temei legal puternic pentru anulare conform O.G. nr. 2/2001.
        </p>
      </div>

      {/* Data Grid: Panels */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Metric 1: Nr. Proces-Verbal */}
        <div className="app-panel p-4 flex flex-col gap-3">
          <Receipt className={`${isDark ? "text-[#38BDF8]" : "text-[#9CA3AF]"} w-6 h-6 stroke-[1.5]`} />
          <div>
            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Nr. Proces-Verbal
            </p>
            <p className="text-base font-bold text-[var(--text-main)] tracking-wide">
              {ticketData.pv_series} {ticketData.pv_number}
            </p>
          </div>
        </div>

        {/* Metric 2: Valoare Amendă */}
        <div className="app-panel p-4 flex flex-col gap-3">
          <CreditCard className={`${isDark ? "text-[#FFB7B2]" : "text-[#9CA3AF]"} w-6 h-6 stroke-[1.5]`} />
          <div>
            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Valoare Amendă
            </p>
            <p className="text-base font-bold fine-value-coral tracking-wide">
              {ticketData.fine_amount_ron} RON
            </p>
          </div>
        </div>

        {/* Metric 3: Puncte Penalizare */}
        <div className="app-panel p-4 flex flex-col gap-3 col-span-2">
          <AlertTriangle className={`${isDark ? "text-[#38BDF8]" : "text-[#9CA3AF]"} w-6 h-6 stroke-[1.5]`} />
          <div>
            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Puncte Penalizare
            </p>
            <p className="text-base font-bold text-[var(--text-main)]">
              {ticketData.penalty_points || 0} Puncte
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
