import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';

interface CazierEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartHubMai: () => void;
}

export const CazierEligibilityModal: React.FC<CazierEligibilityModalProps> = ({
  isOpen,
  onClose,
  onStartHubMai,
}) => {
  const { isDark } = useTheme();

  const [answers, setAnswers] = useState({
    isRomanianCitizen: true,
    hasCleanRecord: true,
    hasRomanianCardOrGhiseu: true,
  });

  if (!isOpen) return null;

  const isEligible = answers.isRomanianCitizen && answers.hasCleanRecord && answers.hasRomanianCardOrGhiseu;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg flex flex-col rounded-[24px] border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#121622] border-white/[0.1] text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0058FF]/15 text-[#0058FF] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Verificare Eligibilitate Cazier Online</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Află în 30 secunde dacă poți descărca cazierul pe loc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 text-sm">
          {/* Question 1 */}
          <div className="flex items-center justify-between p-3.5 rounded-[14px] border border-inherit">
            <div>
              <span className="font-semibold text-xs block">Ești cetățean român major?</span>
              <span className="text-[11px] text-[var(--text-muted)]">Cu CNP valid și act de identitate românesc</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setAnswers(p => ({ ...p, isRomanianCitizen: true }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  answers.isRomanianCitizen ? 'bg-[#0058FF] text-white' : 'bg-gray-100 dark:bg-white/[0.06] text-[var(--text-muted)]'
                }`}
              >
                DA
              </button>
              <button
                onClick={() => setAnswers(p => ({ ...p, isRomanianCitizen: false }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !answers.isRomanianCitizen ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-white/[0.06] text-[var(--text-muted)]'
                }`}
              >
                NU
              </button>
            </div>
          </div>

          {/* Question 2 */}
          <div className="flex items-center justify-between p-3.5 rounded-[14px] border border-inherit">
            <div>
              <span className="font-semibold text-xs block">Ai cazierul curat (fără condamnări)?</span>
              <span className="text-[11px] text-[var(--text-muted)]">Fără mențiuni penale înscrise în cazier</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setAnswers(p => ({ ...p, hasCleanRecord: true }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  answers.hasCleanRecord ? 'bg-[#0058FF] text-white' : 'bg-gray-100 dark:bg-white/[0.06] text-[var(--text-muted)]'
                }`}
              >
                DA
              </button>
              <button
                onClick={() => setAnswers(p => ({ ...p, hasCleanRecord: false }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !answers.hasCleanRecord ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-white/[0.06] text-[var(--text-muted)]'
                }`}
              >
                NU
              </button>
            </div>
          </div>

          {/* Question 3 */}
          <div className="flex items-center justify-between p-3.5 rounded-[14px] border border-inherit">
            <div>
              <span className="font-semibold text-xs block">Ai cont Ghișeul.ro sau card bancar pe numele tău?</span>
              <span className="text-[11px] text-[var(--text-muted)]">Utilizat pentru validarea identității în 60 secunde</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setAnswers(p => ({ ...p, hasRomanianCardOrGhiseu: true }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  answers.hasRomanianCardOrGhiseu ? 'bg-[#0058FF] text-white' : 'bg-gray-100 dark:bg-white/[0.06] text-[var(--text-muted)]'
                }`}
              >
                DA
              </button>
              <button
                onClick={() => setAnswers(p => ({ ...p, hasRomanianCardOrGhiseu: false }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !answers.hasRomanianCardOrGhiseu ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-white/[0.06] text-[var(--text-muted)]'
                }`}
              >
                NU
              </button>
            </div>
          </div>

          {/* Verdict Box */}
          {isEligible ? (
            <div className="p-4 rounded-[16px] bg-[#10B981]/15 border border-[#10B981]/30 flex flex-col gap-2 text-xs text-emerald-400">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
                <span>Ești 100% Eligibil pentru Eliberare Instantanee!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                Poți obține cazierul judiciar semnat digital pe loc, fără costuri (0 LEI) și fără deplasare la secția de poliție, prin integrarea directă HUB MAI cu Ghișeul.ro.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-[16px] bg-amber-500/15 border border-amber-500/30 flex flex-col gap-2 text-xs text-amber-300">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Necesită Prezență Fizică la Secție</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
                Conform Legii nr. 290/2004, persoanele cu mențiuni înscrise în cazier sau fără instrument bancar românesc de validare trebuie să solicite documentul la ghișeul oricărei subunități de poliție.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 md:p-5 border-t border-inherit flex items-center justify-between gap-3 bg-inherit">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
          >
            Închide
          </button>

          {isEligible && (
            <button
              onClick={() => {
                confetti({ particleCount: 50, spread: 50 });
                onStartHubMai();
                onClose();
              }}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0058FF] hover:bg-[#0047D4] flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-98"
            >
              <span>Mergi pe HUB MAI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
