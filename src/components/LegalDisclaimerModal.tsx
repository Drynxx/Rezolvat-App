import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileCheck, Lock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(24px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 14 }}
          transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          className="apple-glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Modal Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isDark 
                  ? 'bg-[#0058FF]/20 border border-[#38BDF8]/30 text-[#38BDF8] shadow-[0_0_12px_rgba(0,88,255,0.3)]' 
                  : 'bg-[#0058FF]/10 text-[#0058FF] border border-[#0058FF]/20'
              }`}>
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-[var(--text-main)]">
                  Cadrul Legal & Conformitate Statutară
                </h2>
                <p className="text-xs text-[var(--text-muted)] font-medium">
                  Reglementat conform legislației din România și Uniunea Europeană
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full cursor-pointer transition-colors btn-press text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10"
              title="Închide"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Legal Text Sections */}
          <div className="flex flex-col gap-3.5 text-xs md:text-sm">

            <div className={`p-4 rounded-2xl border ${
              isDark 
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-200' 
                : 'bg-amber-50 border-amber-200/80 text-amber-950'
            }`}>
              <div className="flex gap-2 items-center mb-1.5 font-bold text-xs uppercase tracking-wider text-amber-500">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Declinare a Răspunderii (Protecție Legea nr. 51/1995)</span>
              </div>
              <p className="leading-relaxed text-xs opacity-90">
                <strong>ZIRO</strong> este o platformă tehnologică independentă operată sub codurile CAEN <strong>6201</strong> (Activități de realizare a software-ului) și <strong>6311</strong> (Prelucrarea datelor și administrarea paginilor web). Platforma nu constituie o societate de avocați, nu acordă consultanță juridică personalizată și nu înlocuiește serviciile unui avocat autorizat conform Legii nr. 51/1995.
              </p>
            </div>

            <div className="apple-glass-card p-4">
              <h4 className="font-bold mb-1.5 flex items-center gap-2 text-xs md:text-sm text-[var(--text-main)]">
                <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Natura Documentelor Generate</span>
              </h4>
              <p className="leading-relaxed text-xs text-[var(--text-muted)]">
                Toate plângerile contravenționale, contractele auto Model ITL 054 și sesizările ANPC sunt generate automat pe baza șabloanelor oficiale publice și a normelor legislative în vigoare (O.G. nr. 2/2001, O.U.G. nr. 195/2002, Codul de Procedură Civilă). Utilizatorul își asumă verificarea datelor înainte de semnare și depunere.
              </p>
            </div>

            <div className="apple-glass-card p-4">
              <h4 className="font-bold mb-1.5 flex items-center gap-2 text-xs md:text-sm text-[var(--text-main)]">
                <Lock className="w-4 h-4 text-[#0058FF] shrink-0" />
                <span>Politica de Confidențialitate & GDPR (Auto-Purge 24h)</span>
              </h4>
              <p className="leading-relaxed text-xs text-[var(--text-muted)]">
                Imaginile proceselor-verbale și ale actelor de identitate sunt prelucrate exclusiv în memorie (in-memory OCR) pentru extragerea datelor necesare completării documentului și sunt <strong>șterse automat în termen de 24 de ore</strong>. CNP-ul este stocat exclusiv sub formă de amprentă criptografică hash SHA-256 pentru prevenirea duplicatelor.
              </p>
            </div>

          </div>

          {/* Footer Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-3 px-7 rounded-full text-xs shadow-[0_4px_14px_rgba(0,88,255,0.3)] transition-all cursor-pointer btn-press"
            >
              Am Înțeles și Sunt de Acord
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
