import React, { useState } from 'react';
import { 
  BadgeCheck, 
  Home, 
  Users, 
  CreditCard, 
  FileDown, 
  ExternalLink, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Building,
  KeyRound,
  FileText
} from 'lucide-react';
import { BuletinDecisionState, BuletinMotive, HousingSituation, MaritalStatus } from '../../../types/ghiseu';
import { getBuletinChecklist } from '../../../lib/data/ghiseu-directory';
import { BuletinChecklist } from './BuletinChecklist';
import { BuletinFormModal } from './BuletinFormModal';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';

export const BuletinWizard: React.FC = () => {
  const { isDark } = useTheme();

  const [decisionState, setDecisionState] = useState<BuletinDecisionState>({
    motive: 'expirare',
    housing: 'proprietar',
    maritalStatus: 'necasatorit',
    hasMinorChildren: false,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const checklistItems = getBuletinChecklist(decisionState);

  const motiveOptions: { id: BuletinMotive; label: string; sub: string }[] = [
    { id: 'expirare', label: 'Buletin Expirat (sau expiră în curând)', sub: 'Poți depune cu 180 zile înainte' },
    { id: 'schimbare_domiciliu', label: 'Schimbare de Domiciliu (Adresă Nouă)', sub: 'Mutare în alt imobil / oraș' },
    { id: 'pierdut_furt_deteriorat', label: 'Pierdut, Furat sau Deteriorat', sub: 'Necesită declarație / dovadă poliție' },
    { id: 'schimbare_nume', label: 'Schimbare de Nume (Căsătorie / Divorț)', sub: 'Termen 15 zile de la eveniment' },
    { id: 'varsta_14', label: 'Prima C.I. la 14 ani', sub: 'Însoțit de un părinte' },
  ];

  const housingOptions: { id: HousingSituation; label: string; sub: string; icon: any }[] = [
    { id: 'proprietar', label: 'Sunt Proprietar / Coproprietar', sub: 'Contract vânzare, donație, moștenire', icon: KeyRound },
    { id: 'chirias_anaf', label: 'Chiriaș cu Contract Vizat ANAF', sub: 'Nu e nevoie de prezența proprietarului', icon: FileText },
    { id: 'gazda_parinti', label: 'Locuiesc la Părinți / Rude / Gazdă', sub: 'Proprietarul trebuie să vină fizic la ghișeu', icon: Users },
    { id: 'fara_acte', label: 'Nu dețin acte de proprietate', sub: 'Procedură C.I. provizorie cu anchetă poliție', icon: Building },
  ];

  const maritalOptions: { id: MaritalStatus; label: string }[] = [
    { id: 'necasatorit', label: 'Necăsătorit(ă)' },
    { id: 'casatorit', label: 'Căsătorit(ă)' },
    { id: 'divortat', label: 'Divorțat(ă)' },
    { id: 'vaduv', label: 'Văduv(ă)' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Hero Banner with Actions */}
      <div className="app-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {isDark && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0058FF]/10 rounded-bl-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col gap-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              Evidența Populației • C.I.
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              Taxă 7 RON pe Ghișeul.ro
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
            Configurator Inteligent Buletin & Domiciliu
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            Răspunde la 3 întrebări rapide pentru a afla exact ce originale și copii trebuie să iei în dosar, apoi descarcă cererea oficială pre-completată (Anexa 1 la HG 295/2021).
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto z-10 flex-shrink-0">
          <button
            onClick={() => setIsFormModalOpen(true)}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 bg-[#0058FF] hover:bg-[#0047D4]`}
          >
            <FileDown className="w-4 h-4" />
            <span>Completează Cererea Tip (PDF)</span>
          </button>

          <a
            href="https://www.ghiseul.ro/ghiseul/public/taxe"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => confetti({ particleCount: 35, spread: 50 })}
            className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
              isDark 
                ? 'bg-[#131620] border-white/[0.1] text-white hover:border-[#38BDF8]/40' 
                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
            <span>Plătește Taxa de 7 RON Online</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
          </a>
        </div>
      </div>

      {/* 3-TAP DECISION PANEL */}
      <div className="app-panel p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-inherit pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0058FF]" />
            Configurare Situație Personală (3 Tap-uri)
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            Actualizare live a listei de acte
          </span>
        </div>

        {/* TAP 1: MOTIVUL */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Pasul 1: Care este motivul eliberării buletinului?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {motiveOptions.map((opt) => {
              const isSelected = decisionState.motive === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDecisionState((prev) => ({ ...prev, motive: opt.id }))}
                  className={`p-3 rounded-[14px] text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? isDark 
                        ? 'bg-[#0058FF]/20 border-[#38BDF8] shadow-sm' 
                        : 'bg-[#0058FF]/10 border-[#0058FF] shadow-sm'
                      : isDark
                        ? 'bg-[#131620] border-white/[0.05] hover:border-white/[0.15]'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`text-xs font-bold ${
                    isSelected ? (isDark ? 'text-[#38BDF8]' : 'text-[#0058FF]') : 'text-[var(--text-main)]'
                  }`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAP 2: SPAȚIUL LOCATIV */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Pasul 2: Care este situația spațiului locativ (Noua Adresă)?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {housingOptions.map((opt) => {
              const isSelected = decisionState.housing === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDecisionState((prev) => ({ ...prev, housing: opt.id }))}
                  className={`p-3 rounded-[14px] text-left border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? isDark 
                        ? 'bg-[#0058FF]/20 border-[#38BDF8] shadow-sm' 
                        : 'bg-[#0058FF]/10 border-[#0058FF] shadow-sm'
                      : isDark
                        ? 'bg-[#131620] border-white/[0.05] hover:border-white/[0.15]'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? (isDark ? 'text-[#38BDF8]' : 'text-[#0058FF]') : 'text-[var(--text-muted)]'}`} />
                    <span className={`text-xs font-bold leading-tight ${
                      isSelected ? (isDark ? 'text-[#38BDF8]' : 'text-[#0058FF]') : 'text-[var(--text-main)]'
                    }`}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] leading-tight">
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAP 3: STARE CIVILĂ & COPII */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Pasul 3: Stare civilă & Minori în întreținere
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {maritalOptions.map((opt) => {
              const isSelected = decisionState.maritalStatus === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDecisionState((prev) => ({ ...prev, maritalStatus: opt.id }))}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0058FF] text-white border-[#0058FF]'
                      : isDark
                        ? 'bg-[#131620] border-white/[0.08] text-[var(--text-muted)] hover:text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}

            {/* Minor children toggle */}
            <label className={`ml-auto px-4 py-2 rounded-full text-xs font-semibold border flex items-center gap-2 cursor-pointer transition-all ${
              decisionState.hasMinorChildren
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : isDark
                  ? 'bg-[#131620] border-white/[0.08] text-[var(--text-muted)]'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}>
              <input
                type="checkbox"
                checked={decisionState.hasMinorChildren}
                onChange={(e) => setDecisionState((prev) => ({ ...prev, hasMinorChildren: e.target.checked }))}
                className="w-3.5 h-3.5 rounded accent-[#0058FF]"
              />
              <span>Am copii minori sub 14 ani</span>
            </label>
          </div>
        </div>

      </div>

      {/* DYNAMIC CHECKLIST SECTION */}
      <div className="app-panel p-6">
        <BuletinChecklist items={checklistItems} />
      </div>

      {/* Modal for PDF Generation */}
      <BuletinFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        decisionState={decisionState}
      />

    </div>
  );
};
