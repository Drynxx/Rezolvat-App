import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Camera, 
  Upload, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ShieldCheck, 
  Receipt, 
  CreditCard, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LegalAnalysisResult, SampleTicket, ProcesVerbalExtractedData } from '../../types';
import { RomanianContraventionRuleEngine } from '../../lib/legal-engine/contravention-rules';
import { SAMPLE_TICKETS } from '../../lib/data/sample-tickets';
import { generatePlangerePdf } from '../../lib/pdf/plangere-generator';
import { preprocessDocumentImage, ProcessedImageResult } from '../../lib/ocr/compression';
import { extractProcesVerbalFromImage } from '../../lib/ocr/gemini-vision';
import { OcrReviewModal } from '../OcrReviewModal';

interface AmendaGuardModuleProps {
  onOpenScanModal: () => void;
  scannedData?: { data: ProcesVerbalExtractedData; stats: ProcessedImageResult } | null;
}

export const AmendaGuardModule: React.FC<AmendaGuardModuleProps> = ({ onOpenScanModal, scannedData }) => {
  const [currentTicketData, setCurrentTicketData] = useState<ProcesVerbalExtractedData>(SAMPLE_TICKETS[0].data);
  const [analysis, setAnalysis] = useState<LegalAnalysisResult>(() => 
    RomanianContraventionRuleEngine.analyze(SAMPLE_TICKETS[0].data)
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isCopiedEmail, setIsCopiedEmail] = useState<boolean>(false);
  const [isCopiedIban, setIsCopiedIban] = useState<boolean>(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ProcesVerbalExtractedData | null>(null);
  const [compressionStats, setCompressionStats] = useState<ProcessedImageResult | null>(null);

  React.useEffect(() => {
    if (scannedData) {
      setReviewData(scannedData.data);
      setCompressionStats(scannedData.stats);
      setIsReviewModalOpen(true);
    }
  }, [scannedData]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await preprocessDocumentImage(file, 1200, 0.75);
      const ocrResult = await extractProcesVerbalFromImage(compressed.base64, compressed.mimeType);
      setReviewData(ocrResult.data);
      setCompressionStats(compressed);
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error('Upload OCR error:', err);
      alert('Eroare la procesarea documentului.');
    }
  };

  const handleConfirmOcrData = (validatedData: ProcesVerbalExtractedData) => {
    setCurrentTicketData(validatedData);
    const newAnalysis = RomanianContraventionRuleEngine.analyze(validatedData);
    setAnalysis(newAnalysis);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfBytes = await generatePlangerePdf(currentTicketData, analysis);
      
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dosar_Anulare_PV_${currentTicketData.pv_series}_${currentTicketData.pv_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('A apărut o eroare la generarea PDF-ului.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(analysis.competentCourt.email);
    setIsCopiedEmail(true);
    setTimeout(() => setIsCopiedEmail(false), 2000);
  };

  const handleCopyIban = () => {
    const iban = analysis.competentCourt.timbruTaxIban || 'RO49TREZ70020A100101XXXX';
    navigator.clipboard.writeText(iban);
    setIsCopiedIban(true);
    setTimeout(() => setIsCopiedIban(false), 2000);
  };

  // 100px Radial Gauge calculation (radius = 38)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const score = analysis.successScore || 85;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* LEFT CARD: Radar Rezolvat Hero (Desktop 7 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-7">
        <div className="glass-card p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Card Header & Radial Gauge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-2 border-b border-white/[0.08]">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Viciu Procedural Depistat (O.G. 2/2001)
                </span>
              </div>
              <h2 className="text-[22px] md:text-[24px] font-bold text-white tracking-tight">
                Radar Rezolvat
              </h2>
              <p className="text-xs text-slate-400 max-w-sm">
                Analiză juridică automată în timp real a procesului-verbal conform jurisprudenței românești.
              </p>
            </div>

            {/* 100px Circular SVG Radial Gauge showing 85% */}
            <div className="relative w-[100px] h-[100px] flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                <defs>
                  <linearGradient id="emeraldRadialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
                
                {/* Track */}
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="6"
                />

                {/* Progress */}
                <motion.circle
                  cx="45"
                  cy="45"
                  r={radius}
                  fill="none"
                  stroke="url(#emeraldRadialGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))'
                  }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white tracking-tight leading-none">
                  {score}%
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-0.5">
                  Șanse
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Bar */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-400">Proces-Verbal</span>
              <span className="text-xs md:text-sm font-bold text-white mt-0.5">
                {currentTicketData.pv_series} {currentTicketData.pv_number}
              </span>
            </div>
            <div className="flex flex-col border-x border-white/[0.08]">
              <span className="text-[10px] uppercase font-mono text-slate-400">Valoare Amendă</span>
              <span className="text-xs md:text-sm font-bold text-rose-300 mt-0.5">
                {currentTicketData.fine_amount_ron} RON
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-400">Puncte Penalizare</span>
              <span className="text-xs md:text-sm font-bold text-amber-300 mt-0.5">
                {currentTicketData.penalty_points || 3} Puncte
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary Action Button: Scanează Proces-Verbal cu AI */}
            <button
              onClick={onOpenScanModal}
              className="w-full btn-primary-action py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-[0_10px_25px_rgba(6,182,212,0.25)]"
            >
              <Camera className="w-4 h-4 text-white" />
              <span>Scanează Proces-Verbal cu AI</span>
            </button>

            {/* Secondary Split Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <label className="btn-glass-secondary py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-xs font-medium">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Încarcă PDF / Poze</span>
                <input 
                  type="file" 
                  accept="image/*,application/pdf" 
                  className="hidden" 
                  onChange={handleUploadFile}
                />
              </label>

              <button
                onClick={handleDownloadPdf}
                className="btn-glass-secondary py-3 px-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-xs font-medium"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Taxă 20 lei & Plângere</span>
              </button>
            </div>
          </div>

          {/* Accordion Card: Viciu Procedural */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white tracking-tight">
                    Lipsă serie aparat radar cinemometru (Norma NML 021-05)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Nulitate absolută conform deciziei RIL a Înaltei Curți de Casație și Justiție
                  </span>
                </div>
              </div>
              {isAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {isAccordionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 pt-1 text-[11px] text-slate-300 leading-relaxed border-t border-white/[0.04]"
                >
                  <p className="mb-2">
                    Agentul constatator nu a consemnat seria aparatului cinemometru și buletinul de verificare metrologică valabil în cuprinsul rubricii de descriere a faptei.
                  </p>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    ✓ Art. 16 alin. (1) O.G. 2/2001 raportat la NML 021-05 determină lipsa probatoriului tehnic al vitezei.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT CARD: Official Court Dossier Preview (Desktop 5 Cols) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6 md:col-span-5">
        <div className="glass-card p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden">
          
          <div>
            {/* Header badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Dosar Juridic Oficial
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 font-bold">
                Art. 194 C.pr.civ.
              </span>
            </div>

            {/* macOS Legal Window Mockup */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-950/70 p-5 flex flex-col gap-3.5 shadow-inner text-[11px]">
              
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  plangere_contraventionala.pdf
                </span>
              </div>

              {/* Court Details */}
              <div className="flex flex-col gap-1">
                <div className="text-[10px] font-mono uppercase text-slate-400">Instanța Competentă:</div>
                <div className="text-xs font-bold text-white">
                  {analysis.competentCourt.name}
                </div>
                <div className="flex items-center justify-between mt-1 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="font-mono text-[10px] text-cyan-300 truncate max-w-[200px]">
                    {analysis.competentCourt.email}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded-lg bg-white/[0.06]"
                  >
                    {isCopiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopiedEmail ? 'Copiat' : 'Copiază'}</span>
                  </button>
                </div>
              </div>

              {/* Taxa Timbru 20 RON */}
              <div className="flex flex-col gap-1 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono uppercase text-slate-400">Taxă Judiciară de Timbru:</span>
                  <span className="font-bold text-emerald-400">20 RON (Fixă)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] mt-1">
                  <span className="font-mono text-[9px] text-slate-300 truncate max-w-[190px]">
                    IBAN: {analysis.competentCourt.timbruTaxIban || 'RO49TREZ70020A100101XXXX'}
                  </span>
                  <button
                    onClick={handleCopyIban}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded-lg bg-white/[0.06]"
                  >
                    {isCopiedIban ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopiedIban ? 'Copiat' : 'IBAN'}</span>
                  </button>
                </div>
              </div>

              {/* Procedural guarantee */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                <span>Include clauza Art. 411 alin. 2 C.pr.civ. (judecare în lipsă).</span>
              </div>

            </div>
          </div>

          {/* Download Full Dossier Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full mt-6 btn-primary-action py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Se compilează dosarul...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Descarcă Dosarul PDF (49 RON)</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Review Modal for OCR Data Validation */}
      {isReviewModalOpen && reviewData && (
        <OcrReviewModal 
          isOpen={isReviewModalOpen}
          extractedData={reviewData}
          compressionStats={compressionStats}
          onClose={() => setIsReviewModalOpen(false)}
          onConfirm={handleConfirmOcrData}
        />
      )}

    </div>
  );
};
