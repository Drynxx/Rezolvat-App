import React, { useState } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  Car, 
  Download, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  FileText,
  Building2,
  Receipt
} from 'lucide-react';
import { AutoDoxEditorModal } from './AutoDoxEditorModal';

export const AutoDoxModule: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const steps = [
    { num: '01', title: 'DITL Vânzător', desc: 'Scoatere fiscală & viză fără debite (Cartuș A & B)' },
    { num: '02', title: 'DITL Cumpărător', desc: 'Înregistrare fiscală mijloc de transport (termen 30 zile)' },
    { num: '03', title: 'Taxă Talon 49 lei', desc: 'Achitare pe Ghișeul.ro / Trezorerie pentru certificat înmatriculare' },
    { num: '04', title: 'Ghișeu DGPCI', desc: 'Depunere dosar plăcuțe & eliberare talon nou (max 90 zile)' },
  ];

  const checklistItems = [
    {
      title: 'Contract Model 2026 ITL 054 (5x exemplare originale)',
      subtitle: 'Completat cu toate cartușele A, B, C, D pe hârtie oficială',
      tag: '5 COPII',
    },
    {
      title: 'Cerere Înmatriculare Oficială DGPCI',
      subtitle: 'Pre-completată cu datele vehiculului și cumpărătorului',
      tag: 'DGPCI',
    },
    {
      title: 'Declarație Fiscală Impunere DITL',
      subtitle: 'Gata de încărcat online pe platforma fiscală locală',
      tag: 'DITL',
    },
  ];

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* LEFT HERO CARD: Rezolvat Auto (Desktop 6 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-6">
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div>
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                MODEL ITL 054 (5X COPII ORIGINALE)
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                Oficial 2026
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[22px] md:text-[26px] font-extrabold text-white tracking-tight mb-3">
              Rezolvat Auto — Contract Vânzare-Cumpărare
            </h2>

            {/* Price Hero */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-white">39 RON</span>
              <span className="text-sm text-slate-400">/ dosar complet</span>
            </div>

            {/* Subtext */}
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Completează automat toate actele pentru transferul auto: contractul în 5 exemplare, cererea DGPCI și declarația DITL.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-medium text-xs text-slate-200">100% Acceptat DITL & DGPCI</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="font-medium text-xs text-slate-200">Fără cozi la ghișee</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Button: Generează Dosarul Auto */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className="w-full btn-primary-action py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Generează Dosarul Auto (39 RON)</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: 4-Step Route Bento & Checklist (Desktop 6 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-6">
        
        {/* Right Top: 4-Step Route Bento */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Circuitul Dosarului Auto
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">4 Pași Legali</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {steps.map((step) => (
              <div 
                key={step.num}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-md">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {step.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Bottom: Checklist with Emerald Checkmarks */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Documente Incluse în Pachet
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Gata de Tipar</span>
          </div>

          <div className="flex flex-col gap-3">
            {checklistItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 leading-tight">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-slate-300 px-2 py-0.5 rounded-md bg-white/[0.06] flex-shrink-0">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Editor Modal for Model 2026 ITL 054 */}
      <AutoDoxEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />

    </div>
  );
};
