import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SampleTicket } from '../types';
import { SAMPLE_TICKETS } from '../lib/data/sample-tickets';
import { useTheme } from '../context/ThemeContext';

interface CaseCarouselProps {
  selectedTicketId: string;
  onSelectCase: (sample: SampleTicket) => void;
}

export const CaseCarousel: React.FC<CaseCarouselProps> = ({ selectedTicketId, onSelectCase }) => {
  const { isDark } = useTheme();

  return (
    <div className="app-panel p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
            Alege Scenariu de Test
          </span>
        </div>
        <span className={`text-[11px] font-semibold ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`}>
          Simulare instantanee
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
        {SAMPLE_TICKETS.map((sample) => {
          const isSelected = selectedTicketId === sample.id;
          return (
            <motion.button
              key={sample.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectCase(sample)}
              className={`flex-shrink-0 flex items-center gap-2 py-2 px-4 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-[#0058FF]/25 border-[#38BDF8]/60 text-white shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'bg-[#0058FF]/10 border-[#0058FF]/30 text-[#0058FF] shadow-sm'
                  : isDark
                    ? 'bg-[#131620] hover:bg-[#242838] border-white/[0.08] text-[#A0A0A0] hover:text-white'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-[#4B5563]'
              }`}
            >
              <span className="text-sm">
                {sample.id === 'radar-no-serial' ? '🚨' : sample.id === 'parking-no-witness' ? '🅿️' : '⚖️'}
              </span>
              <span>{sample.title.split('(')[0].trim()}</span>
              {isSelected && (
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" : "bg-[#0058FF]"}`} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
