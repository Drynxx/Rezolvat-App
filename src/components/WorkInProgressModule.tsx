import React from 'react';
import {
  Scale,
  FileText,
  Landmark,
  Car,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AppTab } from '../types';
import { useTheme } from '../context/ThemeContext';

interface WorkInProgressModuleProps {
  activeTab: AppTab;
  onGoToAutoDox: () => void;
  onOpenDisclaimer?: () => void;
}

interface ModuleInfo {
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  plannedFeatures: {
    title: string;
    desc: string;
  }[];
  targetRelease: string;
}

export const WorkInProgressModule: React.FC<WorkInProgressModuleProps> = ({
  activeTab,
  onGoToAutoDox,
  onOpenDisclaimer,
}) => {
  const { isDark } = useTheme();

  const getModuleInfo = (): ModuleInfo => {
    switch (activeTab) {
      case 'amendaguard':
        return {
          name: 'AmendaGuard • Contestații Amenzi Rutiere',
          badge: 'În Lucru • Modul Secundar',
          tagline: 'Auditare automată vicii de formă O.G. 2/2001 & Plângeri contravenționale',
          description:
            'Modulul de analiză procese-verbale rutiere și redactare plângeri la judecătorie este temporar dezactivat pentru calibrare juridică și actualizare conform jurisprudenței 2026.',
          icon: <Scale className="w-8 h-8 text-amber-400" />,
          plannedFeatures: [
            {
              title: 'Scanare AI Proces-Verbal',
              desc: 'Extragere automată a datelor agentului, seriei, faptei și temeiului legal.',
            },
            {
              title: 'Detectare Vicii de Formă (Art. 16/17)',
              desc: 'Verificare automată pentru lipsa numelui agentului, a faptei sau a semnăturii.',
            },
            {
              title: 'Redactare Plângere Judecătorie',
              desc: 'Generare automată a cererii de chemare în judecată cu solicitare judecare în lipsă.',
            },
          ],
          targetRelease: 'Următoarea versiune ZIRO',
        };

      case 'anpc':
        return {
          name: 'ANPC Express • Sesizări Consumatori',
          badge: 'În Lucru • Modul Secundar',
          tagline: 'Generare dosare digitale pentru litigii comerciale și drepturile consumatorilor',
          description:
            'Modulul de redactare sesizări și reclamații pentru Protecția Consumatorului este în curs de integrare cu noile formulare electronice județene.',
          icon: <FileText className="w-8 h-8 text-cyan-400" />,
          plannedFeatures: [
            {
              title: 'Șabloane Juridice O.G. 21/1992',
              desc: 'Structură argumentată conform legislației privind garanțiile și retururile.',
            },
            {
              title: 'Atașare Bonuri & Facturi',
              desc: 'Procesare automată dovezi de plată și corespondență cu comerciantul.',
            },
            {
              title: 'Ghid de Depunere Online',
              desc: 'Instrucțiuni pas cu pas pentru transmiterea pe portalul regional competent.',
            },
          ],
          targetRelease: 'Următoarea versiune ZIRO',
        };

      case 'ghiseu':
      default:
        return {
          name: 'Ghișeu Navigator • Ghidare Birocratică',
          badge: 'În Lucru • Modul Secundar',
          tagline: 'Navigare proceduri administrative, calcul taxe locale și programări',
          description:
            'Modulul de asistență birocratică pentru primării, DITL și DGPCI se află în optimizare de fluxuri și actualizare de adrese instituționale.',
          icon: <Landmark className="w-8 h-8 text-indigo-400" />,
          plannedFeatures: [
            {
              title: 'Ghidare DITL & DGPCI Pas cu Pas',
              desc: 'Harta completă a pașilor pentru înmatriculări, radieri și vize fiscale.',
            },
            {
              title: 'Generare Cereri Tipizate',
              desc: 'Formulare automate pentru certificat fiscal și eliberare carte de identitate.',
            },
            {
              title: 'Calculator Taxe Oficiale',
              desc: 'Calcul precis pentru taxa de talon (49 lei), plăcuțe și impozite auto.',
            },
          ],
          targetRelease: 'Următoarea versiune ZIRO',
        };
    }
  };

  const moduleInfo = getModuleInfo();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-4">
      {/* 1. Hero Notice Card */}
      <div className="app-panel p-6 md:p-10 relative overflow-hidden text-center flex flex-col items-center">
        {/* Subtle decorative glow */}
        {isDark && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-amber-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 bg-amber-500/10 border border-amber-500/25 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{moduleInfo.badge}</span>
        </div>

        {/* Module Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isDark
              ? 'bg-[#161B26] border border-white/[0.08]'
              : 'bg-white border border-gray-200 shadow-sm'
            }`}
        >
          {moduleInfo.icon}
        </div>

        {/* Title & Tagline */}
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-[var(--text-main)] mb-2">
          {moduleInfo.name}
        </h2>
        <p className="text-xs md:text-sm font-medium text-[var(--text-muted)] max-w-xl mb-6">
          {moduleInfo.tagline}
        </p>

        {/* Focus Banner */}
        <div
          className={`w-full max-w-2xl p-4 md:p-5 rounded-2xl border text-left mb-8 transition-colors ${isDark
              ? 'bg-[#0E131F]/80 border-[#0058FF]/30 shadow-[0_0_25px_rgba(0,88,255,0.08)]'
              : 'bg-blue-50/70 border-blue-200'
            }`}
        >
          <div className="flex items-start gap-3">
            <div>
              <h4 className="text-xs md:text-sm font-bold text-[var(--text-main)] mb-1 flex items-center gap-2">
                <span>Focus ZIRO: Modulul AutoDox este 100% Activ</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0058FF] text-white">
                  ACTIV
                </span>
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Pentru a asigura o acuratețe juridică absolută și o experiență fără erori, platforma <strong>ZIRO</strong> se concentrează în acest moment pe automatizarea completă a <strong>contractelor de vânzare-cumpărare auto (Model 2026 ITL 054 în 5 exemplare)</strong>. Secțiunea curentă este dezactivată temporar.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button -> Go to AutoDox */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center max-w-md">
          <button
            onClick={onGoToAutoDox}
            className="w-full bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all cursor-pointer text-sm shadow-md active:scale-98"
          >
            <Car className="w-4 h-4" />
            <span>Mergi la AutoDox (Contracte Auto 5x)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenDisclaimer && (
            <button
              onClick={onOpenDisclaimer}
              className={`w-full sm:w-auto py-3.5 px-5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer text-xs font-semibold border ${isDark
                  ? 'bg-[#131620] border-white/[0.08] text-[var(--text-muted)] hover:text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Aviz Legal</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Planned Features Bento Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-muted)]" />
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Ce va include acest modul la lansare
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-amber-500">
            {moduleInfo.targetRelease}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {moduleInfo.plannedFeatures.map((feat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col gap-1.5 transition-colors ${isDark
                  ? 'bg-[#131620]/60 border-white/[0.04]'
                  : 'bg-white border-gray-100 shadow-sm'
                }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  {feat.title}
                </h4>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pl-5.5">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
