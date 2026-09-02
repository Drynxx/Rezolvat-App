import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FileCheck, Edit3, ShieldAlert, Sparkles, Scale, DollarSign, Calendar, MapPin, Gauge } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProcesVerbalExtractedData } from '../types';
import { ProcessedImageResult } from '../lib/ocr/compression';
import { useTheme } from '../context/ThemeContext';

interface OcrReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedData: ProcesVerbalExtractedData | null;
  compressionStats?: ProcessedImageResult | null;
  onConfirm: (updatedData: ProcesVerbalExtractedData) => void;
}

export const OcrReviewModal: React.FC<OcrReviewModalProps> = ({
  isOpen,
  onClose,
  extractedData,
  compressionStats,
  onConfirm,
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<ProcesVerbalExtractedData | null>(extractedData);

  // Sync state when props change
  React.useEffect(() => {
    if (extractedData) {
      setFormData(extractedData);
    }
  }, [extractedData]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof ProcesVerbalExtractedData, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      confetti({ particleCount: 50, spread: 60 });
      onConfirm(formData);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="app-panel max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-[var(--panel-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>
                <FileCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
                  Verificare Date Proces-Verbal
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Extrase cu AI din imaginea scanată · Corectați dacă este necesar
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.06]' : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 md:p-6 overflow-y-auto flex flex-col gap-5">
            
            {/* Compression Stats Badge */}
            {compressionStats && (
              <div className={`p-3 rounded-[12px] flex items-center justify-between text-xs border ${
                isDark 
                  ? 'bg-[#131620] border-white/[0.06] text-[#A0A0A0]' 
                  : 'bg-[#F9FAFB] border-gray-100 text-[#6B7280]'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />
                  <span>Optimizare WebP Canvas:</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="line-through">{compressionStats.originalSizeKb} KB</span>
                  <span className="text-[#34D399] font-bold">➔ {compressionStats.compressedSizeKb} KB (-{compressionStats.compressionRatio}%)</span>
                </div>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Seria PV */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Seria PV
                </label>
                <input
                  type="text"
                  value={formData.pv_series}
                  onChange={(e) => handleChange('pv_series', e.target.value.toUpperCase())}
                  className={`p-3 rounded-[10px] border font-bold text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-white focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* Numar PV */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Număr PV
                </label>
                <input
                  type="text"
                  value={formData.pv_number}
                  onChange={(e) => handleChange('pv_number', e.target.value)}
                  className={`p-3 rounded-[10px] border font-bold text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-white focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* Valoare Amenda */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Cuantum Amendă (RON)
                </label>
                <input
                  type="number"
                  value={formData.fine_amount_ron}
                  onChange={(e) => handleChange('fine_amount_ron', Number(e.target.value))}
                  className={`p-3 rounded-[10px] border font-bold text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-[#FFB7B2] focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#E11D48] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* Puncte Penalizare */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Puncte Penalizare
                </label>
                <input
                  type="number"
                  value={formData.penalty_points || 0}
                  onChange={(e) => handleChange('penalty_points', Number(e.target.value))}
                  className={`p-3 rounded-[10px] border font-bold text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-white focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* Nume Contravenient */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Nume & Prenume Contravenient
                </label>
                <input
                  type="text"
                  value={formData.contravener_name || ''}
                  onChange={(e) => handleChange('contravener_name', e.target.value)}
                  className={`p-3 rounded-[10px] border text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-white focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* CNP */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  CNP Contravenient
                </label>
                <input
                  type="text"
                  value={formData.contravener_cnp || ''}
                  onChange={(e) => handleChange('contravener_cnp', e.target.value)}
                  className={`p-3 rounded-[10px] border font-mono text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-white focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* Oras / Judet */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Localitate / Județ
                </label>
                <input
                  type="text"
                  value={`${formData.incident_city || ''}, ${formData.incident_county || ''}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    handleChange('incident_city', parts[0]?.trim() || '');
                    handleChange('incident_county', parts[1]?.trim() || '');
                  }}
                  className={`p-3 rounded-[10px] border text-sm outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-white focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

              {/* Descriere Fapta */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  Descrierea Faptei din PV
                </label>
                <textarea
                  rows={2}
                  value={formData.deed_description || ''}
                  onChange={(e) => handleChange('deed_description', e.target.value)}
                  className={`p-3 rounded-[10px] border text-xs outline-none transition-colors leading-relaxed ${
                    isDark 
                      ? 'bg-[#131620] border-white/[0.08] text-[#D1D5DB] focus:border-[#38BDF8]' 
                      : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                  }`}
                />
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 md:p-6 border-t border-[var(--panel-border)] flex items-center justify-end gap-3 bg-[var(--panel-bg-nested)]">
            <button
              onClick={onClose}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                isDark ? 'text-[#A0A0A0] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Anulează
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-3 bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold rounded-full text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isDark ? 'btn-primary-action' : ''
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Validează & Generează Dosarul</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
