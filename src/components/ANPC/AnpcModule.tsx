import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export const AnpcModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('retur');

  const categories = [
    {
      id: 'retur',
      icon: 'shopping_bag',
      title: 'Retur în 14 Zile Online',
      law: 'O.U.G. 34/2014',
      badge: 'Rambursare 14 zile',
      desc: 'Comerciantul refuză restituirea banilor în termenul legal pentru achiziții la distanță.'
    },
    {
      id: 'service',
      icon: 'build',
      title: 'Garanție & Service Defect',
      law: 'O.G. 21/1992',
      badge: 'Max 15 zile calendaristice',
      desc: 'Produsul nu a fost reparat sau înlocuit în termenul legal de maxim 15 zile.'
    },
    {
      id: 'zbor',
      icon: 'flight',
      title: 'Zbor Întârziat / Anulat',
      law: 'Reg. CE 261/2004',
      badge: 'Despăgubire 250€ – 600€',
      desc: 'Zbor cu întârziere > 3 ore sau anulat fără notificare prealabilă de 14 zile.'
    },
    {
      id: 'pret',
      icon: 'sell',
      title: 'Preț Înșelător Raft vs Casă',
      law: 'Legea 363/2007',
      badge: 'Practică comercială incorectă',
      desc: 'Diferență între prețul afișat la raft și suma percepută la casa de marcat.'
    }
  ];

  const handleGenerateComplaint = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    alert('Reclamația oficială Rezolvat ANPC a fost formulată și pregătită pentru depunere online pe portalul oficial ANPC!');
  };

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Header Card & CTA (Desktop 5 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-5">
        <div className="glass-panel rounded-[28px] bg-surface-container-high/60 p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden border-t border-white/10 shadow-xl">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div>
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/20">
                PROTECȚIA CONSUMATORULUI
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold text-tertiary bg-tertiary/10 border border-tertiary/20">
                19 RON / sesizare
              </span>
            </div>

            {/* Title */}
            <h2 className="font-headline-md text-[24px] md:text-[28px] font-bold text-white tracking-tight mb-3">
              Rezolvat ANPC
            </h2>

            {/* Subtext */}
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Redactează automat plângerea oficială conform legislației UE și românești, gata de depus online direct pe portalul oficial <em>reclamatii.anpc.ro</em>.
            </p>

            {/* Feature points */}
            <div className="flex flex-col gap-2.5 mb-6">
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-tertiary flex-shrink-0">check_circle</span>
                <span>Format legal validat de juriști români</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-tertiary flex-shrink-0">check_circle</span>
                <span>Articole de lege și sancțiuni invocate exact</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-tertiary flex-shrink-0">check_circle</span>
                <span>Notificare prealabilă (punere în întârziere) inclusă</span>
              </div>
            </div>
          </div>

          {/* Button: Formulează Reclamație Oficială */}
          <button
            onClick={handleGenerateComplaint}
            className="w-full btn-primary-action py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Formulează Reclamație Oficială (19 RON)</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: 2x2 Bento Action Tiles (Desktop 7 Cols) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-7">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-6 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-surface-container-high/90 border-secondary/40 shadow-[0_12px_30px_rgba(123,208,255,0.15)] ring-1 ring-secondary/30'
                  : 'bg-surface-container/60 border-white/10 hover:border-white/20 hover:bg-surface-container-high/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                    isSelected 
                      ? 'bg-secondary/20 text-secondary border-secondary/30' 
                      : 'bg-white/[0.04] text-on-surface border-white/10'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-on-surface-variant border border-white/10">
                    {cat.law}
                  </span>
                </div>

                <h3 className="font-headline-md text-base text-white mb-1 tracking-tight font-semibold">
                  {cat.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {cat.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[11px] font-bold text-tertiary">
                  {cat.badge}
                </span>
                <span className={`text-[10px] font-mono uppercase transition-colors ${
                  isSelected ? 'text-secondary font-bold' : 'text-on-surface-variant'
                }`}>
                  {isSelected ? 'Selectat ✓' : 'Alege'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
