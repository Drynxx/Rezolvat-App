import React, { useState } from 'react';
import { 
  Building, 
  ExternalLink, 
  CreditCard, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { PasaportAgeGroup } from '../../../types/ghiseu';
import { PASAPORT_FEES } from '../../../lib/data/ghiseu-directory';
import { PasaportChecklist } from './PasaportChecklist';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';

export const PasaportCalculator: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedGroup, setSelectedGroup] = useState<PasaportAgeGroup>('peste_18');

  const feeData = PASAPORT_FEES[selectedGroup];

  const handleOpenBooking = () => {
    confetti({ particleCount: 50, spread: 60 });
    window.open('https://hub.mai.gov.ro/epasapoarte', '_blank');
  };

  const handleOpenGhiseul = () => {
    window.open('https://www.ghiseul.ro/ghiseul/public/taxe', '_blank');
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Hero Card */}
      <div className="app-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {isDark && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0058FF]/10 rounded-bl-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col gap-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              Direcția Generală de Pașapoarte (DGP)
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Programare 100% Gratuită
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
            Programare Pașaport Online & Calculator Taxe
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            Află taxa consulară exactă, evită intermediarii care taxează ilegal programările și rezervă intervalul orar dorit direct pe platforma oficială a statului român.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto z-10 flex-shrink-0">
          <button
            onClick={handleOpenBooking}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 bg-[#0058FF] hover:bg-[#0047D4]"
          >
            <Calendar className="w-4 h-4" />
            <span>Rezervă Interval pe epasapoarte.ro</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>

          <button
            onClick={handleOpenGhiseul}
            className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all border cursor-pointer ${
              isDark 
                ? 'bg-[#131620] border-white/[0.1] text-white hover:border-[#38BDF8]/40' 
                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
            <span>Plătește Taxa ({feeData.feeRon} RON) pe Ghișeul.ro</span>
          </button>
        </div>
      </div>

      {/* CALCULATOR & GROUP SELECTOR */}
      <div className="app-panel p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-inherit pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0058FF]" />
            Calculator Automat Taxă & Valabilitate
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Tarife stabilite prin lege
          </span>
        </div>

        {/* Group Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['peste_18', '12_18', 'sub_12', 'temporar'] as PasaportAgeGroup[]).map((group) => {
            const data = PASAPORT_FEES[group];
            const isSelected = selectedGroup === group;

            return (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`p-4 rounded-[16px] text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? isDark 
                      ? 'bg-[#0058FF]/20 border-[#38BDF8] shadow-sm' 
                      : 'bg-[#0058FF]/10 border-[#0058FF] shadow-sm'
                    : isDark
                      ? 'bg-[#131620] border-white/[0.05] hover:border-white/[0.15]'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <span className={`text-xs font-bold block ${
                    isSelected ? (isDark ? 'text-[#38BDF8]' : 'text-[#0058FF]') : 'text-[var(--text-main)]'
                  }`}>
                    {data.title}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                    Valabilitate: {data.validityYears} {data.validityYears === 1 ? 'an' : 'ani'}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="text-2xl font-extrabold text-[var(--text-main)]">
                    {data.feeRon} RON
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">taxă legală</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Calculation Details Banner */}
        <div className={`p-4 rounded-[14px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-[#131620] border-white/[0.06]' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[var(--text-main)]">
              {feeData.title} • {feeData.feeRon} RON
            </span>
            <span className="text-[var(--text-muted)]">
              {feeData.description}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-[#0058FF] dark:text-[#38BDF8] flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {feeData.legalNotice}
          </span>
        </div>
      </div>

      {/* CHECKLIST */}
      <div className="app-panel p-6">
        <PasaportChecklist selectedGroup={selectedGroup} />
      </div>

      {/* ADVICE BENTO GRID: Broker Trap & Any County Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Anti-Scam Alert */}
        <div className={`p-6 rounded-[20px] border flex flex-col gap-3 ${
          isDark ? 'bg-rose-500/10 border-rose-500/25 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center gap-2.5 font-bold text-sm text-rose-500">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>Atenție la Site-urile Capcană de Intermediere!</span>
          </div>

          <p className="text-xs leading-relaxed font-normal opacity-90">
            Există site-uri neoficiale care pretind comisioane de <strong>200–500 RON</strong> pentru a rezerva un interval de programare. Programarea pe portalul oficial <strong>epasapoarte.ro / hub.mai.gov.ro</strong> este <strong>100% GRATUITĂ</strong>.
          </p>

          <p className="text-xs leading-relaxed font-normal opacity-90">
            Singurul cost obligatoriu este taxa legală consulară de <strong>{feeData.feeRon} RON</strong>, care se achită direct la bugetul statului prin <strong>Ghișeul.ro</strong>.
          </p>
        </div>

        {/* Any County Pro Tip */}
        <div className={`p-6 rounded-[20px] border flex flex-col gap-3 ${
          isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-white' : 'bg-sky-50 border-sky-200 text-sky-950'
        }`}>
          <div className="flex items-center gap-2.5 font-bold text-sm text-[#0058FF] dark:text-[#38BDF8]">
            <MapPin className="w-5 h-5 flex-shrink-0" />
            <span>Pont Util: Poți Merge în ORICE Județ din Țară!</span>
          </div>

          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            Conform Legii nr. 248/2005, cererile pentru eliberarea pașaportului simplu electronic pot fi depuse la <strong>orice serviciu public comunitar de pașapoarte din România</strong>, indiferent de domiciliul din buletin.
          </p>

          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            Dacă în orașul tău nu găsești locuri libere în următoarele zile, poți alege un ghișeu din județele învecinate unde există disponibilitate imediată.
          </p>
        </div>

      </div>

    </div>
  );
};
