import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, Scale, ShieldAlert, Sparkles } from 'lucide-react';
import { LegalAnalysisResult } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProceduralFlawsCardProps {
  analysis: LegalAnalysisResult;
  isLoading?: boolean;
}

export const ProceduralFlawsCard: React.FC<ProceduralFlawsCardProps> = ({ analysis, isLoading = false }) => {
  const { isDark } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const allGrounds = [
    ...analysis.absoluteNullities,
    ...analysis.relativeNullities,
    ...analysis.meritDefenses
  ];

  return (
    <div className="app-panel p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className={`w-5 h-5 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} stroke-[1.8]`} />
          <h3 className="font-bold text-base text-[var(--text-main)] tracking-tight">
            Vicii Procedurale Detectate
          </h3>
        </div>
        <span className="text-xs font-semibold text-[var(--text-muted)]">
          {allGrounds.length} motive legale
        </span>
      </div>

      {isLoading ? (
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <Sparkles className={`w-6 h-6 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} animate-spin mb-2`} />
          <p className="text-xs text-[var(--text-muted)]">Motorul juridic verifică O.G. nr. 2/2001...</p>
        </div>
      ) : allGrounds.length === 0 ? (
        <div className={`py-6 px-4 rounded-[16px] border border-dashed text-center ${
          isDark ? 'bg-[#131620] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
        }`}>
          <ShieldAlert className={`w-8 h-8 ${isDark ? "text-[#A0A0A0]" : "text-[#9CA3AF]"} mx-auto mb-2`} />
          <p className="text-xs font-medium text-[var(--text-main)]">Niciun viciu detectat încă</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[240px] mx-auto">
            Scanează un proces-verbal pentru a detecta viciile de procedură în 5 secunde.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allGrounds.map((ground, idx) => {
            const isExpanded = expandedIndex === idx;
            const isAbsolute = ground.category === 'NULITATE_ABSOLUTA';
            const isRelative = ground.category === 'NULITATE_RELATIVA';

            const badgeStyle = isAbsolute
              ? isDark 
                ? 'text-[#FFB7B2] bg-[#FFB7B2]/10 border-[#FFB7B2]/30 shadow-[0_0_8px_rgba(255,183,178,0.2)]'
                : 'text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20'
              : isRelative
                ? isDark
                  ? 'text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30'
                  : 'text-[#D97706] bg-[#FEF3C7] border-[#D97706]/20'
                : isDark
                  ? 'text-[#34D399] bg-[#34D399]/10 border-[#34D399]/30'
                  : 'text-[#059669] bg-[#ECFDF5] border-[#059669]/20';

            return (
              <div 
                key={idx}
                className={`overflow-hidden rounded-[14px] border transition-colors ${
                  isDark
                    ? 'bg-[#131620] hover:bg-[#181C28] border-white/[0.06]'
                    : 'bg-[#F9FAFB] hover:bg-gray-100/70 border-gray-100'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-start justify-between gap-3 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {isAbsolute ? (
                        <AlertCircle className={`w-4 h-4 ${isDark ? "text-[#FFB7B2]" : "text-[#E11D48]"}`} />
                      ) : isRelative ? (
                        <AlertCircle className={`w-4 h-4 ${isDark ? "text-[#FBBF24]" : "text-[#D97706]"}`} />
                      ) : (
                        <CheckCircle2 className={`w-4 h-4 ${isDark ? "text-[#34D399]" : "text-[#059669]"}`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border ${badgeStyle}`}>
                          {ground.article}
                        </span>
                        <span className="text-[11px] font-medium text-[var(--text-muted)]">
                          {ground.law}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--text-main)] mt-1.5 leading-snug">
                        {ground.summary}
                      </h4>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-[var(--text-muted)] mt-0.5"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`px-4 pb-4 pt-1 text-xs text-[var(--text-muted)] leading-relaxed border-t ${
                        isDark ? 'border-white/[0.06]' : 'border-gray-200'
                      }`}
                    >
                      <p className={`p-3 rounded-[10px] border text-xs ${
                        isDark ? 'bg-[#0A0E17] border-white/[0.06] text-[#D1D5DB]' : 'bg-white border-gray-200 text-[#111827]'
                      }`}>
                        {ground.legalArgument}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
                        <span>Forță juridică: <strong className="text-[var(--text-main)]">+{ground.weightScore} pct</strong></span>
                        <span className={`${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} font-semibold`}>Formulare inclusă în dosar ✓</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
