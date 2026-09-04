import React from 'react';
import { Landmark, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const GhiseuHeader: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <section className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              Navigare Administrativă & Fără Cozi
            </span>
            <span className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
              Conformitate Legislație 2026
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            GhișeuNavigator
          </h1>
          <p className="text-sm md:text-base text-[var(--text-muted)] font-medium max-w-2xl mt-1 leading-relaxed">
            Ghidul tău anti-birocrație pentru actele de zi cu zi. Află exact ce acte originale și copii îți trebuie, generează cererile oficiale pre-completate în PDF și nu te mai întoarce niciodată refuzat de la ghișeu.
          </p>
        </div>

        {/* Quick badge stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`p-2.5 px-3 rounded-[14px] border flex items-center gap-2 text-xs font-semibold ${
            isDark ? 'bg-[#131620] border-white/[0.06] text-[#D1D5DB]' : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <Clock className="w-4 h-4 text-[#38BDF8]" />
            <span>Timp mediu: 5-10 min</span>
          </div>

          <div className={`p-2.5 px-3 rounded-[14px] border flex items-center gap-2 text-xs font-semibold ${
            isDark ? 'bg-[#131620] border-white/[0.06] text-[#D1D5DB]' : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <FileCheck className="w-4 h-4 text-[#34D399]" />
            <span>Formulare Oficiale PDF</span>
          </div>
        </div>
      </div>
    </section>
  );
};
