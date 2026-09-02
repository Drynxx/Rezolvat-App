import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { LegalAnalysisResult, ProcesVerbalExtractedData } from '../../types';
import { RomanianContraventionRuleEngine } from '../../lib/legal-engine/contravention-rules';
import { SAMPLE_TICKETS } from '../../lib/data/sample-tickets';
import { generatePlangerePdf } from '../../lib/pdf/plangere-generator';
import { preprocessDocumentImage, ProcessedImageResult } from '../../lib/ocr/compression';
import { extractProcesVerbalFromImage } from '../../lib/ocr/gemini-vision';
import { OcrReviewModal } from '../OcrReviewModal';
import { VehicleHologram3D } from '../VehicleHologram3D';

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

  const score = analysis.successScore || 85;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-5 animate-fadeIn">
      
      {/* Top Header / Profile Greeting */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary relative flex-shrink-0 shadow-[0_0_12px_rgba(123,208,255,0.3)]">
            <img 
              className="w-full h-full object-cover" 
              alt="Profil utilizator" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx-EJFsPlAoU3W1KvWcVUyGs42uQuv6oFjsfJOCUunRB974oUKHaEfmu6ChoZWtZE25_Fq5UzFKg1pkedgA930AuyPuOWHQ6oHqOSGpoqLi7gKHCNAgs4XvSGut1Hfp61M6wPOBBai8s41S2H4vcedxPUwmjcarV7o9c7WzojYD60xtGtI0xlfKrEBBSeGl1z6_QZvdYcKUMBPzLPznEbkfXtnMvZFn-6fGTJRmy_l8pQp22_TEYtE6A" 
            />
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline-md text-headline-md text-white font-semibold">
              Salut, Andrei!
            </h2>
            <span className="font-body-md text-data-mono text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">shield</span>
              Dosarul tău este protejat
            </span>
          </div>
        </div>

        <button 
          title="Notificări"
          className="w-10 h-10 rounded-full bg-surface-container glass-panel flex items-center justify-center relative shadow-[0_4px_12px_rgba(0,0,0,0.2)] border-t border-white/10 hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.8)] animate-pulse"></span>
        </button>
      </div>

      {/* Hero Bento Card with 3D Hologram */}
      <div className="relative w-full rounded-[28px] glass-panel bg-surface-container-high/60 overflow-hidden shadow-xl p-6 border-t border-white/10 flex flex-col justify-between min-h-[240px]">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start w-full sm:w-3/5">
          <div className="flex items-center gap-1.5 bg-tertiary-container/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(78,222,163,0.2)] mb-3 border border-tertiary/25">
            <span className="material-symbols-outlined text-[14px] text-tertiary">verified</span>
            <span className="font-label-caps text-label-caps text-tertiary">VERIFICAT LEGAL</span>
          </div>

          <h3 className="font-headline-md text-headline-md text-white mb-4 leading-tight">
            Volkswagen Passat<br/>
            <span className="text-on-surface-variant text-[18px]">2.0 TDI · {currentTicketData.pv_series} {currentTicketData.pv_number}</span>
          </h3>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              <span className="font-data-mono text-data-mono text-on-surface">ITP Valabil & RCA Activ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              <span className="font-data-mono text-data-mono text-on-surface">Fără Debite Fiscale (DITL)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              <span className="font-data-mono text-data-mono text-on-surface">
                Termen legal contestație: 15 zile (O.G. 2/2001)
              </span>
            </div>
          </div>
        </div>

        {/* 3D Holographic Vehicle Animation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 hidden sm:flex items-center justify-center z-10 pointer-events-none">
          <div className="absolute w-36 h-8 bg-secondary/25 rounded-[100%] blur-xl bottom-4 shadow-[0_0_30px_rgba(123,208,255,0.4)]"></div>
          <VehicleHologram3D />
        </div>
      </div>

      {/* Middle 2-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        
        {/* Probability Card */}
        <div className="glass-panel rounded-2xl bg-surface-container/80 p-5 border-t border-white/10 flex flex-col justify-between shadow-lg relative overflow-hidden h-[175px]">
          <div className="absolute inset-0 bg-gradient-to-b from-tertiary/5 to-transparent pointer-events-none"></div>
          <span className="font-body-md text-data-mono text-on-surface-variant z-10 font-medium">
            Probabilitate Câștig
          </span>

          <div className="flex items-end gap-2 z-10 mt-1">
            <span className="font-display-lg-mobile text-[44px] leading-none text-white tracking-tighter font-extrabold">
              {score}
            </span>
            <span className="font-headline-md text-headline-md text-tertiary mb-1 font-bold">%</span>
          </div>

          <div className="flex items-end gap-1.5 h-9 mt-auto z-10">
            <div className="w-1/6 bg-tertiary/20 rounded-t-sm h-1/4"></div>
            <div className="w-1/6 bg-tertiary/40 rounded-t-sm h-2/4"></div>
            <div className="w-1/6 bg-tertiary/60 rounded-t-sm h-3/4"></div>
            <div className="w-1/6 bg-tertiary/80 rounded-t-sm h-4/5"></div>
            <div className="w-1/6 bg-tertiary rounded-t-sm h-full relative shadow-[0_0_10px_rgba(78,222,163,0.5)]">
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
            </div>
            <div className="w-1/6 bg-tertiary/90 rounded-t-sm h-5/6"></div>
          </div>
        </div>

        {/* Map Widget Card */}
        <div className="glass-panel rounded-2xl bg-surface-container/80 p-0 border-t border-white/10 shadow-lg relative overflow-hidden h-[175px] flex flex-col">
          <div className="p-3 bg-surface-container-high/90 backdrop-blur-md z-20 flex justify-between items-center absolute top-0 w-full border-b border-white/10">
            <span className="font-data-mono text-data-mono text-on-surface font-semibold truncate pr-2">
              {analysis.competentCourt.name}
            </span>
            <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
          </div>

          {/* Stylized Dark Judicial Map Canvas */}
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlZTTKjj-GGLyo6rOhv60SwLMR19d9Z4J2k_LcrNmJOW_mqSCw7h37l9CAGtyAtuKLMgmo_jZErQTrzeakpRG9vdJBeUpgS7pJBY85hxTyCS-XfZHsxZbSePbfiSr7mz1SqyDyq1cygWH1zDEcCZ7iD-hz7FEWsYhxrcV1PfKIvIFjXNEiYOXWz76x_R0ntVw4t25dE3fzsurfZjpTHmpWaOCe-bxRK1tv96LCzxz5QrrlwEMzm2sG3g')` 
            }}
          >
            <div className="w-full h-full bg-[#051424]/40 backdrop-brightness-75"></div>
          </div>

          {/* Pinging Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-secondary rounded-full shadow-[0_0_15px_rgba(123,208,255,1)] z-10 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-2 border-secondary animate-ping"></div>
          </div>
        </div>

      </div>

      {/* Vicii Procedurale Section */}
      <div className="flex flex-col gap-3 w-full mt-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-headline-md text-body-lg text-white font-semibold">
            Vicii Procedurale Depistate
          </h3>
          <span className="font-label-caps text-label-caps text-secondary bg-secondary/10 px-2.5 py-1 rounded-full font-bold">
            2 IDENTIFICATE
          </span>
        </div>

        {/* Item 1 */}
        <div className="glass-panel bg-surface-container/60 rounded-2xl p-4 flex items-center gap-4 border-t border-white/5 shadow-md hover:bg-surface-container-high/70 transition-colors">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shrink-0">
            <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-body-md text-body-md text-white font-medium truncate">
              Lipsă serie cinemometru radar
            </span>
            <span className="font-body-md text-data-mono text-on-surface-variant truncate text-xs">
              Art. 109 alin. (2) OUG 195/2002 · Norma Metrologică NML 021-05
            </span>
          </div>
          <div className="bg-tertiary-container/40 border border-tertiary/20 px-3 py-1 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(78,222,163,0.15)] shrink-0">
            <span className="font-label-caps text-[10px] text-tertiary uppercase tracking-wider font-bold">
              Validat ✓
            </span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="glass-panel bg-surface-container/60 rounded-2xl p-4 flex items-center gap-4 border-t border-white/5 shadow-md hover:bg-surface-container-high/70 transition-colors">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 shrink-0 relative">
            <span className="material-symbols-outlined text-error text-[20px]">gavel</span>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container/50"></span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-body-md text-body-md text-white font-medium truncate">
              Lipsă mențiune obiecțiuni contravenient
            </span>
            <span className="font-body-md text-data-mono text-on-surface-variant truncate text-xs">
              Art. 16 alin. (7) OG 2/2001 · Nulitate relativă dovedită
            </span>
          </div>
          <div className="bg-error-container/20 border border-error/20 px-3 py-1 rounded-full flex items-center justify-center shrink-0">
            <span className="font-label-caps text-[10px] text-error uppercase tracking-wider font-bold">
              Analiză
            </span>
          </div>
        </div>
      </div>

      {/* Tactile Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
        <button
          onClick={onOpenScanModal}
          className="w-full sm:w-1/2 btn-primary-action py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer font-bold text-sm"
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          <span>Scanează Proces-Verbal cu AI</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-full sm:w-1/2 glass-panel bg-surface-container/80 hover:bg-surface-container-high text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer text-sm border-t border-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
          <span>{isGeneratingPdf ? 'Se compilează dosarul...' : 'Descarcă Dosarul PDF (49 RON)'}</span>
        </button>
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
