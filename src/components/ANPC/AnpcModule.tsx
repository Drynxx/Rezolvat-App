import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Wrench, 
  Plane, 
  Tag, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AnpcModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('retur');

  const categories = [
    {
      id: 'retur',
      icon: ShoppingBag,
      title: 'Retur în 14 Zile Online',
      law: 'O.U.G. 34/2014',
      badge: 'Rambursare 14 zile',
      desc: 'Comerciantul refuză restituirea banilor în termenul legal pentru achiziții la distanță.'
    },
    {
      id: 'service',
      icon: Wrench,
      title: 'Garanție & Service Defect',
      law: 'O.G. 21/1992',
      badge: 'Max 15 zile calendaristice',
      desc: 'Produsul nu a fost reparat sau înlocuit în termenul legal de maxim 15 zile.'
    },
    {
      id: 'zbor',
      icon: Plane,
      title: 'Zbor Întârziat / Anulat',
      law: 'Reg. CE 261/2004',
      badge: 'Despăgubire 250€ – 600€',
      desc: 'Zbor cu întârziere > 3 ore sau anulat fără notificare prealabilă de 14 zile.'
    },
    {
      id: 'pret',
      icon: Tag,
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
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Header Card & CTA (Desktop 5 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-5">
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div>
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20">
                PROTECȚIA CONSUMATORULUI
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                19 RON / sesizare oficială
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[22px] md:text-[26px] font-extrabold text-white tracking-tight mb-3">
              Rezolvat ANPC
            </h2>

            {/* Subtext */}
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Redactează automat plângerea oficială conform legislației UE și românești, gata de depus online direct pe portalul oficial <em>reclamatii.anpc.ro</em>.
            </p>

            {/* Feature points */}
            <div className="flex flex-col gap-2.5 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Format legal validat de juriști români</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Articole de lege și sancțiuni invocate exact</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Notificare prealabilă (punere în întârziere) inclusă</span>
              </div>
            </div>
          </div>

          {/* Button: Formulează Reclamație Oficială */}
          <button
            onClick={handleGenerateComplaint}
            className="w-full btn-primary-action py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Formulează Reclamație Oficială (19 RON)</span>
          </button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: 2x2 Bento Action Tiles (Desktop 7 Cols) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-7">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/70 border-cyan-400/40 shadow-[0_15px_35px_rgba(6,182,212,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] ring-1 ring-cyan-400/30'
                  : 'bg-slate-900/40 border-white/[0.08] hover:border-white/[0.15] hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                    isSelected 
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30' 
                      : 'bg-white/[0.04] text-slate-300 border-white/[0.08]'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                    {cat.law}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mb-1 tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {cat.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <span className="text-[11px] font-bold text-emerald-400">
                  {cat.badge}
                </span>
                <span className={`text-[10px] font-mono uppercase transition-colors ${
                  isSelected ? 'text-cyan-300 font-bold' : 'text-slate-500'
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
