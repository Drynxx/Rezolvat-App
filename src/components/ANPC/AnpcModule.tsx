import React, { useState } from 'react';
import { ShoppingBag, Wrench, Plane, Tag, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

export const AnpcModule: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('retur');

  const categories = [
    {
      id: 'retur',
      icon: ShoppingBag,
      iconColor: isDark ? 'text-[#38BDF8] bg-[#0058FF]/20 border-[#38BDF8]/30' : 'text-[#0058FF] bg-[#0058FF]/10 border-transparent',
      title: 'Retur în 14 Zile Online',
      law: 'O.U.G. nr. 34/2014',
      desc: 'Termen obligatoriu rambursare'
    },
    {
      id: 'service',
      icon: Wrench,
      iconColor: isDark ? 'text-[#34D399] bg-[#10B981]/20 border-[#34D399]/30' : 'text-[#059669] bg-[#ECFDF5] border-transparent',
      title: 'Garanție & Service Defect',
      law: 'O.G. nr. 21/1992',
      desc: 'Depășire 15 zile reparație'
    },
    {
      id: 'zbor',
      icon: Plane,
      iconColor: isDark ? 'text-[#38BDF8] bg-[#0058FF]/20 border-[#38BDF8]/30' : 'text-[#0058FF] bg-[#0058FF]/10 border-transparent',
      title: 'Zbor Anulat / Întârziat >3h',
      law: 'Reg. CE 261/2004',
      desc: 'Despăgubire 250€ – 600€'
    },
    {
      id: 'pret',
      icon: Tag,
      iconColor: isDark ? 'text-[#FBBF24] bg-[#F59E0B]/20 border-[#FBBF24]/30' : 'text-[#D97706] bg-[#FEF3C7] border-transparent',
      title: 'Preț Înșelător Raft vs Casă',
      law: 'Legea nr. 363/2007',
      desc: 'Practică comercială incorectă'
    }
  ];

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6">
      
      {/* LEFT COLUMN: Header & CTA (Desktop 5 Cols) */}
      <div className="flex flex-col gap-6 md:col-span-5">
        <div className="app-panel p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden">
          {isDark && (
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0058FF]/10 rounded-bl-full blur-3xl pointer-events-none" />
          )}

          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                isDark 
                  ? 'text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20' 
                  : 'text-[#0058FF] bg-[#0058FF]/10'
              }`}>
                PROTECȚIA CONSUMATORULUI
              </span>
              <span className={`text-xs font-bold ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`}>
                19 RON / sesizare
              </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
              Protecția Consumatorului ANPC
            </h3>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
              Redactează automat plângerea oficială conform OUG 34/2014 și Legii 363/2007, gata de depus online pe portalul oficial <em>reclamatii.anpc.ro</em>.
            </p>
          </div>

          <button
            onClick={() => {
              confetti({ particleCount: 50, spread: 50 });
              toast.success('Sesizarea oficială ANPC Express a fost generată!');
            }}
            className={`w-full bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer text-sm active:scale-98 shadow-sm ${
              isDark ? 'btn-primary-action' : ''
            }`}
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Formulează o Reclamație ANPC (19 RON)</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: 2x2 Category Grid (Desktop 7 Cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-7">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`app-panel p-5 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isDark
                    ? 'border-[#38BDF8]/60 bg-[#1C1F2B] shadow-[0_0_16px_rgba(56,189,248,0.15)]'
                    : 'border-[#0058FF] bg-[#0058FF]/5'
                  : isDark
                    ? 'hover:border-white/[0.15]'
                    : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center border ${cat.iconColor}`}>
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                {isSelected && <CheckCircle2 className={`w-5 h-5 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />}
              </div>

              <div>
                <div className="text-sm font-bold text-[var(--text-main)] leading-snug">
                  {cat.title}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1.5 leading-tight">
                  <span className={`${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} font-medium`}>{cat.law}</span> · {cat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
