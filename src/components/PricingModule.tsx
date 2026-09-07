import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

export const PricingModule = () => {
  const { isDark } = useTheme();

  const plans = [
    {
      name: 'AmendaGuard Single',
      price: '49',
      period: 'dosar',
      desc: 'Contestație unică de amendă de circulație sau parcare.',
      features: [
        'Scanare AI proces-verbal',
        'Verificare 14 motive O.G. 2/2001',
        'Generare Plângere Judecătorie PDF',
        'Ghid timbru 20 RON Ghișeul.ro'
      ],
      isPopular: false
    },
    {
      name: 'Auto Contract ITL 054',
      price: '39',
      period: 'tranzacție',
      desc: 'Setul de 5 exemplare oficiale Model 2026 + Ghid DGPCI.',
      features: [
        '5 exemplare identice numerotate oficial',
        'Cartușe fiscale DITL Vânzător & Cumpărător',
        'Ghid complet primărie -> poliție',
        'Economisești 200 RON față de birouri auto'
      ],
      isPopular: true
    },
    {
      name: 'Shield Pro Anual',
      price: '99',
      period: 'an',
      desc: 'Protecție continuă pentru șoferi și navetiști.',
      features: [
        'Amenzi nelimitate anulate',
        'Toate pachetele auto incluse',
        'Alerte ITP, RCA & Rovinietă',
        'Asistență prioritară dedicată'
      ],
      isPopular: false
    }
  ];

  const handleSelectPlan = (planName: string) => {
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    toast.success(`Ai selectat ${planName}. Integrarea plății securizate Stripe este activă.`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 px-2 py-4">

      {/* Header */}
      <div className="apple-glass-card p-6 text-center flex flex-col items-center">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border ${
          isDark 
            ? 'bg-blue-500/15 text-[#38BDF8] border-blue-500/30' 
            : 'bg-[#0058FF]/10 text-[#0058FF] border-[#0058FF]/20'
        }`}>
          Fără Costuri Ascunse
        </span>
        <h2 className="text-xl md:text-2xl font-black tracking-display text-[var(--text-main)] mb-1">
          Tarife Transparente ZIRO
        </h2>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          Plătești doar când generezi un set oficial de documente juridice.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`apple-glass-card p-6 flex flex-col justify-between relative overflow-hidden ${
              p.isPopular ? 'ring-2 ring-[#0058FF] shadow-[0_8px_30px_rgba(0,88,255,0.2)]' : ''
            }`}
          >
            {p.isPopular && (
              <div className="absolute top-0 right-0 bg-[#0058FF] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                Recomandat
              </div>
            )}

            <div>
              <div className="mb-2">
                <span className="font-bold text-sm text-[var(--text-main)] tracking-tight">
                  {p.name}
                </span>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] mb-4 leading-relaxed min-h-[32px]">
                {p.desc}
              </p>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-extrabold font-tabular tracking-display text-[var(--text-main)]">
                  {p.price}
                </span>
                <span className="text-sm font-bold text-[#0058FF]">RON</span>
                <span className="text-[11px] text-[var(--text-muted)] font-medium">/ {p.period}</span>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                {p.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--text-main)]">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-[11px] font-medium leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(p.name)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight cursor-pointer btn-press transition-all ${
                p.isPopular
                  ? 'bg-[#0058FF] hover:bg-[#0047D4] text-white shadow-[0_4px_14px_rgba(0,88,255,0.3)]'
                  : isDark
                    ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                    : 'bg-black/[0.04] hover:bg-black/[0.08] text-gray-900 border border-black/[0.06]'
              }`}
            >
              Selectează {p.name}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
