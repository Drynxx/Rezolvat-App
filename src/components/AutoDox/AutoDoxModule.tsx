import React, { useState } from 'react';
import { FileCheck, CheckCircle2, Car, Download, Edit3, ShieldCheck, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { AutoDoxEditorModal } from './AutoDoxEditorModal';
import { useTheme } from '../../context/ThemeContext';

export const AutoDoxModule: React.FC = () => {
  const { isDark } = useTheme();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const steps = [
    { num: '01', title: 'Viză DITL Vânzător (Cartuș A & B)', desc: 'Scoatere din evidență fiscală primărie fără datorii' },
    { num: '02', title: 'Viză DITL Cumpărător (Cartuș C & D)', desc: 'Înregistrare fiscală în termen legal de 30 de zile' },
    { num: '03', title: 'Taxă Talon (49 RON)', desc: 'Achitare pe Ghișeul.ro / DGPCI' },
    { num: '04', title: 'Ghișeu DGPCI Înmatriculări', desc: 'Depunere dosar plăcuțe & talon nou (max 90 zile)' },
  ];

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6">
      
      {/* LEFT COLUMN: Hero Price & Value Card (Desktop 6 Cols) */}
      <div className="flex flex-col gap-6 md:col-span-6">
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
                PACHET COMPLET CONTRACT AUTO
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                isDark ? 'text-[#34D399] bg-[#10B981]/15 border border-[#10B981]/30' : 'text-[#059669] bg-emerald-50'
              }`}>
                Model 2026 ITL 054
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-[var(--text-main)]">39 RON</span>
              <span className="text-sm text-[var(--text-muted)] font-medium">/ dosar complet (5x exemplare)</span>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
              Generează instantaneu cele <strong>5 exemplare oficiale</strong> ale contractului de înstrăinare-dobândire <strong>Model 2026 ITL 054</strong>, cu toate cartușele fiscale <strong>A, B, C, D</strong> completate conform <em>Legii nr. 207/2015 privind Codul de procedură fiscală</em>.
            </p>

            {/* Quick Feature Pills */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <div className={`p-2.5 rounded-[12px] border flex items-center gap-2 text-xs ${
                isDark ? 'bg-[#131620] border-white/[0.04] text-[#D1D5DB]' : 'bg-[#F9FAFB] border-gray-100 text-[#374151]'
              }`}>
                <ShieldCheck className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span className="font-medium text-[11px]">100% Acceptat DITL & DGPCI</span>
              </div>

              <div className={`p-2.5 rounded-[12px] border flex items-center gap-2 text-xs ${
                isDark ? 'bg-[#131620] border-white/[0.04] text-[#D1D5DB]' : 'bg-[#F9FAFB] border-gray-100 text-[#374151]'
              }`}>
                <Clock className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span className="font-medium text-[11px]">Salvare 3 ore la cozi</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setIsEditorOpen(true)}
              className={`w-full bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer text-sm active:scale-98 shadow-sm ${
                isDark ? 'btn-primary-action' : ''
              }`}
            >
              <Edit3 className="w-4 h-4 text-white" />
              <span>Completează / Editează Model 2026 ITL 054</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 4-Step Timeline & Checklist (Desktop 6 Cols) */}
      <div className="flex flex-col gap-6 md:col-span-6">
        
        {/* Interactive 4-Step Process Grid */}
        <div className="app-panel p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className={`w-5 h-5 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} stroke-[1.8]`} />
              <h3 className="font-bold text-base text-[var(--text-main)] tracking-tight">
                Procedură Vânzare-Cumpărare Auto Pas cu Pas
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">4 Pași</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {steps.map((step) => (
              <div key={step.num} className={`flex items-center gap-3 p-3 rounded-[14px] border ${
                isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
              }`}>
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
                }`}>
                  {step.num}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-main)] leading-tight">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Checklist Bento Card */}
        <div className="app-panel p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#34D399] stroke-[1.8]" />
              <h3 className="font-bold text-base text-[var(--text-main)] tracking-tight">
                Cele 5 Exemplare Generate
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#34D399]">Model 2026 ITL 054</span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className={`flex items-center justify-between p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span className="text-[var(--text-main)] font-semibold">Exemplar 1 (Original)</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Rămâne la Cumpărător</span>
            </div>

            <div className={`flex items-center justify-between p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span className="text-[var(--text-main)] font-semibold">Exemplar 2 (Copie)</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Organ Fiscal Vânzător (DITL)</span>
            </div>

            <div className={`flex items-center justify-between p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span className="text-[var(--text-main)] font-semibold">Exemplar 3 (Copie)</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Organ Fiscal Cumpărător (DITL)</span>
            </div>

            <div className={`flex items-center justify-between p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span className="text-[var(--text-main)] font-semibold">Exemplar 4 (Copie)</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Serviciul Înmatriculări (DGPCI)</span>
            </div>

            <div className={`flex items-center justify-between p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0" />
                <span className="text-[var(--text-main)] font-semibold">Exemplar 5 (Copie)</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">Persoana care înstrăinează (Vânzător)</span>
            </div>
          </div>
        </div>

      </div>

      {/* AutoDox Model 2026 ITL 054 Editor Modal */}
      <AutoDoxEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />

    </div>
  );
};
