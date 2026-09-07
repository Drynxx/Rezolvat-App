import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AutoDoxEditorModal } from './AutoDoxEditorModal';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, FileText, CheckCircle2, ChevronRight, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface AutoDoxModuleProps {
  openEditorTrigger?: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Viză DITL Vânzător', sub: 'Cartuș A & B — Scoatere din evidența fiscală locală' },
  { num: '02', title: 'Viză DITL Cumpărător', sub: 'Cartuș C & D — Înregistrare impunere (termen 30 zile)' },
  { num: '03', title: 'Taxă Talon (49 RON)', sub: 'Achitare online pe Ghișeul.ro sau Trezorerie / DGPCI' },
  { num: '04', title: 'Ghișeu DGPCI Înmatriculări', sub: 'Depunere dosar plăcuțe & eliberare talon nou (90 zile)' },
];

const EXEMPLARE = [
  { label: 'Exemplar 1 — Original', dest: 'Cumpărător (rămâne la dosar vehicul)' },
  { label: 'Exemplar 2', dest: 'DITL Vânzător (scădere rol fiscal)' },
  { label: 'Exemplar 3', dest: 'DITL Cumpărător (impunere rol fiscal)' },
  { label: 'Exemplar 4', dest: 'DGPCI Înmatriculări (dosar talon nou)' },
  { label: 'Exemplar 5', dest: 'Vânzător (arhivă proprie sigură)' },
];

// Stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export const AutoDoxModule: React.FC<AutoDoxModuleProps> = ({ openEditorTrigger }) => {
  const { isDark } = useTheme();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (openEditorTrigger && openEditorTrigger > 0) {
      setIsEditorOpen(true);
    }
  }, [openEditorTrigger]);

  return (
    <motion.div 
      className="w-full flex flex-col gap-4 max-w-4xl mx-auto pb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* ── ROW 1: Hero Card + Procedural Steps ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Hero Pricing & AI Card ─────────────────────────────────── */}
        <motion.div 
          variants={itemVariants}
          className="apple-glass-card p-6 flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Subtle Ambient Radial Backlight */}
          {isDark ? (
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#0058FF]/20 rounded-full blur-3xl pointer-events-none" />
          ) : (
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#0058FF]/8 rounded-full blur-3xl pointer-events-none" />
          )}

          <div>
            {/* Top Badge & Code */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-muted)]">
                  Contract Auto
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0058FF]" />
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                isDark 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                <span>Model ITL 054 · 2026</span>
              </span>
            </div>

            {/* Price Display */}
            <div className="mb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl md:text-6xl font-black font-tabular tracking-display text-[var(--text-main)]">
                  39
                </span>
                <span className="text-xl font-bold text-[#0058FF] tracking-tight">
                  RON
                </span>
              </div>
            </div>
            
            <p className="text-xs text-[var(--text-muted)] font-medium mb-6 leading-relaxed">
              Dosar complet 5 exemplare · Sincronizare DITL & DGPCI
            </p>

            {/* Feature List */}
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                '5 exemplare identice numerotate oficial',
                'Cartușe fiscale conforme O.M.D.R.A.P. 2026',
                'Scanare optică AI Talon Auto & Buletine (CI)',
                '100% confidențial — procesare securizată în browser',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-xs text-[var(--text-main)]">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--glass-border)]">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="w-full py-3.5 px-5 rounded-xl bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,88,255,0.35)] cursor-pointer btn-press"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span>Scanează Documente cu AI</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-tight flex items-center justify-center gap-2 border transition-colors cursor-pointer btn-press ${
                isDark 
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-main)] border-white/[0.08]' 
                  : 'bg-black/[0.03] hover:bg-black/[0.06] text-[var(--text-main)] border-black/[0.06]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Completează manual formularul</span>
            </button>
          </div>
        </motion.div>

        {/* ── 4-Step Timeline ────────────────────────────────────────── */}
        <motion.div 
          variants={itemVariants}
          className="apple-glass-card p-6 flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold tracking-tight-title text-[var(--text-main)]">
                Procedură Legală Pas cu Pas
              </h3>
              <span className="text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--panel-bg-nested)] px-2.5 py-0.5 rounded-full border border-[var(--panel-border-nested)]">
                4 Etape
              </span>
            </div>

            {/* Vertical Flow Steps */}
            <div className="flex flex-col">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="flex items-start gap-3.5 relative pb-4 last:pb-0">
                  {/* Step Milestone Dot + Connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-tabular border ${
                      idx === 0
                        ? 'bg-[#0058FF] text-white border-[#0058FF] shadow-[0_0_10px_rgba(0,88,255,0.4)]'
                        : isDark
                          ? 'bg-white/[0.06] text-[#38BDF8] border-white/[0.1]'
                          : 'bg-[#0058FF]/10 text-[#0058FF] border-[#0058FF]/15'
                    }`}>
                      {step.num}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="w-[2px] h-9 bg-gradient-to-b from-[#0058FF]/30 to-transparent my-1" />
                    )}
                  </div>

                  {/* Step Text Info */}
                  <div className="pt-0.5 flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text-main)] tracking-tight">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                      {step.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Helpful Note */}
          <div className={`mt-5 p-3 rounded-xl text-[11px] flex items-center gap-2 border ${
            isDark ? 'bg-blue-950/25 text-blue-300 border-blue-800/30' : 'bg-blue-50 text-blue-900 border-blue-200/60'
          }`}>
            <span className="font-bold">Info:</span>
            <span>Nu mai este necesară legalizarea notarială a contractului de vânzare auto.</span>
          </div>
        </motion.div>

      </div>

      {/* ── ROW 2: The 5 Official Exemplare (Apple Table List) ──────── */}
      <motion.div 
        variants={itemVariants}
        className="apple-glass-card overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight-title text-[var(--text-main)]">
              Destinația celor 5 Exemplare Oficiale
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] font-medium">
              (generate automat într-un singur PDF)
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
            isDark 
              ? 'bg-blue-500/15 text-[#38BDF8] border-blue-500/30' 
              : 'bg-[#0058FF]/10 text-[#0058FF] border-[#0058FF]/20'
          }`}>
            Set complet ITL 054
          </span>
        </div>

        {/* List Rows */}
        <div className="divide-y divide-[var(--glass-border)]">
          {EXEMPLARE.map((ex, idx) => (
            <div
              key={ex.label}
              className="flex items-center justify-between px-5 py-3 transition-colors duration-150 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-tabular shrink-0 ${
                  idx === 0 
                    ? 'bg-[#0058FF] text-white shadow-sm' 
                    : isDark ? 'bg-white/[0.08] text-[var(--text-muted)]' : 'bg-black/[0.05] text-[var(--text-muted)]'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-[var(--text-main)] tracking-tight">
                  {ex.label}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  {ex.dest}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── AutoDox Editor Modal ────────────────────────────────────── */}
      <AutoDoxEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />

    </motion.div>
  );
};
