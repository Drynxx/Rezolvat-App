import React, { useState } from 'react';
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
      subtitle: 'Completat cu toate cartușele A, B, C, D pe format AcroForm oficial',
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
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* ========================================================================= */}
      {/* LEFT HERO CARD: Rezolvat Auto (Desktop 6 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-6">
        <div className="glass-panel rounded-[28px] bg-surface-container-high/60 p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden shadow-xl border-t border-white/10">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div>
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/20">
                MODEL ITL 054 (5X COPII ORIGINALE)
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold text-tertiary bg-tertiary/10 border border-tertiary/20">
                Oficial 2026
              </span>
            </div>

            {/* Title */}
            <h2 className="font-headline-md text-[24px] md:text-[28px] font-bold text-white tracking-tight mb-3">
              Rezolvat Auto — Contract Vânzare-Cumpărare
            </h2>

            {/* Price Hero */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display-lg-mobile text-4xl font-extrabold text-white">39 RON</span>
              <span className="text-sm text-on-surface-variant">/ dosar complet</span>
            </div>

            {/* Subtext */}
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Completează automat toate actele pentru transferul auto: contractul în 5 exemplare, cererea DGPCI și declarația DITL.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-white/10 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-tertiary flex-shrink-0">verified</span>
                <span className="font-medium text-xs text-on-surface">100% Acceptat DITL & DGPCI</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-white/10 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-secondary flex-shrink-0">schedule</span>
                <span className="font-medium text-xs text-on-surface">Fără cozi la ghișee</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Button: Generează Dosarul Auto */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className="w-full btn-primary-action py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Generează Dosarul Auto (39 RON)</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: 4-Step Route Bento & Checklist (Desktop 6 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-6">
        
        {/* Right Top: 4-Step Route Bento */}
        <div className="glass-panel rounded-[28px] bg-surface-container/70 p-6 flex flex-col gap-4 border-t border-white/10 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">directions_car</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Circuitul Dosarului Auto
              </h3>
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">4 Pași Legali</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {steps.map((step) => (
              <div 
                key={step.num}
                className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-white/10 hover:border-white/20 transition-colors flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold text-secondary bg-secondary/15 px-2 py-0.5 rounded-md">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {step.title}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Bottom: Checklist with Emerald Checkmarks */}
        <div className="glass-panel rounded-[28px] bg-surface-container/70 p-6 flex flex-col gap-4 border-t border-white/10 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Documente Incluse în Pachet
              </h3>
            </div>
            <span className="text-[10px] font-mono text-tertiary font-bold">100% Gata de Tipar</span>
          </div>

          <div className="flex flex-col gap-3">
            {checklistItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-surface-container-high/60 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-tertiary/20 border border-tertiary/30 flex items-center justify-center text-tertiary flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">done</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white tracking-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-on-surface-variant leading-tight">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-white px-2.5 py-1 rounded-md bg-white/10 flex-shrink-0">
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
