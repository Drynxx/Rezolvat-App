import React, { useState } from 'react';
import { Building2, FileText, Download, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LegalAnalysisResult, SampleTicket, ProcesVerbalExtractedData } from '../../types';
import { RomanianContraventionRuleEngine } from '../../lib/legal-engine/contravention-rules';
import { SAMPLE_TICKETS } from '../../lib/data/sample-tickets';
import { generatePlangerePdf } from '../../lib/pdf/plangere-generator';
import { preprocessDocumentImage, ProcessedImageResult } from '../../lib/ocr/compression';
import { extractProcesVerbalFromImage } from '../../lib/ocr/gemini-vision';
import { RadarHeroCard } from '../RadarHeroCard';
import { ActionDock } from '../ActionDock';
import { CaseCarousel } from '../CaseCarousel';
import { ProceduralFlawsCard } from '../ProceduralFlawsCard';
import { OcrReviewModal } from '../OcrReviewModal';
import { useTheme } from '../../context/ThemeContext';

interface AmendaGuardModuleProps {
  onOpenScanModal: () => void;
  scannedData?: { data: ProcesVerbalExtractedData; stats: ProcessedImageResult } | null;
}

export const AmendaGuardModule: React.FC<AmendaGuardModuleProps> = ({ onOpenScanModal, scannedData }) => {
  const { isDark } = useTheme();
  const [currentTicketData, setCurrentTicketData] = useState<ProcesVerbalExtractedData>(SAMPLE_TICKETS[0].data);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(SAMPLE_TICKETS[0].id);
  const [analysis, setAnalysis] = useState<LegalAnalysisResult>(() => 
    RomanianContraventionRuleEngine.analyze(SAMPLE_TICKETS[0].data)
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isCopiedIban, setIsCopiedIban] = useState<boolean>(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ProcesVerbalExtractedData | null>(null);
  const [compressionStats, setCompressionStats] = useState<ProcessedImageResult | null>(null);

  // When new scanned data arrives from parent
  React.useEffect(() => {
    if (scannedData) {
      setReviewData(scannedData.data);
      setCompressionStats(scannedData.stats);
      setIsReviewModalOpen(true);
    }
  }, [scannedData]);

  const handleSelectCase = (sample: SampleTicket) => {
    setIsProcessing(true);
    setSelectedTicketId(sample.id);
    setCurrentTicketData(sample.data);
    setTimeout(() => {
      const res = RomanianContraventionRuleEngine.analyze(sample.data);
      setAnalysis(res);
      setIsProcessing(false);
    }, 280);
  };

  const handleUploadFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const compressed = await preprocessDocumentImage(file, 1200, 0.75);
      const ocrResult = await extractProcesVerbalFromImage(compressed.base64, compressed.mimeType);
      
      setReviewData(ocrResult.data);
      setCompressionStats(compressed);
      setIsReviewModalOpen(true);
    } catch (err) {
      console.error('Upload OCR error:', err);
      alert('Eroare la procesarea documentului.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOcrData = (validatedData: ProcesVerbalExtractedData) => {
    setCurrentTicketData(validatedData);
    setSelectedTicketId('custom-scanned');
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
      link.download = `Plangere_Contravențională_${currentTicketData.pv_series}_${currentTicketData.pv_number}.pdf`;
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

  const handleCopyIban = () => {
    const iban = analysis.competentCourt.timbruTaxIban || 'RO49TREZ70020A100101XXXX';
    navigator.clipboard.writeText(iban);
    setIsCopiedIban(true);
    setTimeout(() => setIsCopiedIban(false), 2000);
  };

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 gap-6">
      
      {/* LEFT COLUMN (Mobile Full / Desktop 7 Cols) */}
      <div className="flex flex-col gap-6 md:col-span-7">
        
        {/* 1. Hero Win Probability Radar Card & Data Grid */}
        <RadarHeroCard 
          analysis={analysis} 
          ticketData={currentTicketData} 
        />

        {/* 2. Tactile Action Dock */}
        <ActionDock 
          onScanClick={onOpenScanModal}
          onUploadClick={handleUploadFile}
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
          courtName={analysis.competentCourt.name}
        />

        {/* 3. Interactive Case Simulator Carousel */}
        <CaseCarousel 
          selectedTicketId={selectedTicketId}
          onSelectCase={handleSelectCase}
        />

        {/* 4. Procedural Flaws Bento Card (Accordion) */}
        <ProceduralFlawsCard 
          analysis={analysis}
          isLoading={isProcessing}
        />

        {/* Mobile only Court Card */}
        <div className="md:hidden app-panel p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isDark ? 'bg-[#0058FF]/20 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              <Building2 className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-main)]">
                {analysis.competentCourt.name}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {analysis.competentCourt.email}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
            isDark 
              ? 'text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20' 
              : 'text-[#0058FF] bg-[#0058FF]/10'
          }`}>
            COMPETENȚĂ
          </span>
        </div>

      </div>

      {/* RIGHT COLUMN (Visible on Desktop 5 Cols) */}
      <div className="hidden md:flex flex-col gap-6 md:col-span-5">
        
        {/* Right 1: Live Court Pleading Preview Card */}
        <div className="app-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className={`w-5 h-5 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} stroke-[1.8]`} />
                <h4 className="text-sm font-bold text-[var(--text-main)] tracking-tight uppercase">
                  Dosar Juridic Generat
                </h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isDark 
                  ? 'text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20' 
                  : 'text-[#0058FF] bg-[#0058FF]/10'
              }`}>
                Art. 194 C.pr.civ.
              </span>
            </div>

            {/* Document Paper Mockup */}
            <div className={`p-4 rounded-[14px] border text-[11px] font-mono flex flex-col gap-2.5 ${
              isDark 
                ? 'bg-[#131620] border-white/[0.06] text-[#D1D5DB]' 
                : 'bg-[#F9FAFB] border-gray-100 text-[#111827]'
            }`}>
              <div className={`text-center font-bold pb-2 border-b ${
                isDark ? 'text-[#38BDF8] border-white/[0.08]' : 'text-[#0058FF] border-gray-200'
              }`}>
                PLÂNGERE CONTRAVENȚIONALĂ
              </div>
              <div className="text-[10px] text-[var(--text-muted)]">
                <strong className="text-[var(--text-main)]">CĂTRE:</strong> {analysis.competentCourt.name.toUpperCase()}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] leading-tight">
                <strong className="text-[var(--text-main)]">PETENT:</strong> {currentTicketData.contravener_name || 'Contravenient'} (CNP {currentTicketData.contravener_cnp || '1920415XXXXXX'})
              </div>
              <div className="text-[10px] text-[var(--text-muted)] leading-tight">
                <strong className="text-[var(--text-main)]">OBIECT:</strong> Anulare PV seria {currentTicketData.pv_series} nr. {currentTicketData.pv_number}
              </div>
              <div className={`p-2.5 rounded-[10px] text-[10px] font-sans leading-snug border ${
                isDark 
                  ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#34D399]' 
                  : 'bg-[#ECFDF5] border-[#059669]/20 text-[#059669]'
              }`}>
                ✓ Clauză <strong>Art. 411 alin. 2 C.pr.civ.</strong> inclusă (Judecare în lipsă fără prezență la tribunal).
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`mt-5 w-full bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 text-sm transition-all cursor-pointer shadow-sm ${
              isDark ? 'btn-primary-action' : ''
            }`}
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#38BDF8]" />
                <span>Se redactează PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Descarcă Dosarul PDF (49 RON)</span>
              </>
            )}
          </button>
        </div>

        {/* Right 2: Competent Court Routing Card */}
        <div className="app-panel p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className={`w-5 h-5 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} stroke-[1.8]`} />
              <h4 className="font-bold text-sm text-[var(--text-main)] tracking-tight uppercase">
                Instanța Teritorială
              </h4>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              isDark 
                ? 'text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20' 
                : 'text-[#0058FF] bg-[#0058FF]/10'
            }`}>
              Competentă
            </span>
          </div>

          <div className="text-base font-bold text-[var(--text-main)]">
            {analysis.competentCourt.name}
          </div>
          <div className="text-xs text-[var(--text-muted)] leading-snug">
            📍 {analysis.competentCourt.address}
          </div>
          <div className={`text-xs font-medium ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`}>
            ✉️ {analysis.competentCourt.email}
          </div>

          {/* IBAN for 20 RON Taxă Timbru */}
          <div className={`mt-2 pt-3 border-t flex items-center justify-between p-3 rounded-[12px] border ${
            isDark 
              ? 'border-white/[0.08] bg-[#131620] border-white/[0.06]' 
              : 'border-gray-100 bg-[#F9FAFB] border-gray-100'
          }`}>
            <div className="min-w-0">
              <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">IBAN Taxă Timbru (20 lei):</div>
              <div className="text-xs font-mono text-[var(--text-main)] truncate mt-0.5">
                {analysis.competentCourt.timbruTaxIban || 'RO49TREZ70020A100101XXXX'}
              </div>
            </div>
            <button
              onClick={handleCopyIban}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#1C1F2B] hover:bg-[#242838] border border-white/[0.1] text-white shadow-inner'
                  : 'bg-white hover:bg-gray-100 border border-gray-200 text-[#111827]'
              }`}
              title="Copiază IBAN"
            >
              {isCopiedIban ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
              <span>{isCopiedIban ? 'Copiat' : 'Copiază'}</span>
            </button>
          </div>
        </div>

        {/* Right 3: Step-by-Step Filing Roadmap */}
        <div className="app-panel p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-5 h-5 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"} stroke-[1.8]`} />
            <h4 className="font-bold text-sm text-[var(--text-main)] tracking-tight uppercase">
              Procedură Depunere (3 Pași)
            </h4>
          </div>

          <div className="flex flex-col gap-2.5 text-xs text-[var(--text-muted)]">
            <div className={`flex items-start gap-3 p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#0058FF]/25 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>1</span>
              <span>Descarcă plângerea PDF redactată conform Codului de Procedură Civilă.</span>
            </div>
            <div className={`flex items-start gap-3 p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#0058FF]/25 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>2</span>
              <span>Achită <strong className="text-[var(--text-main)]">20 RON Taxă de Timbru</strong> pe Ghișeul.ro la Judecătorie.</span>
            </div>
            <div className={`flex items-start gap-3 p-2.5 rounded-[12px] border ${
              isDark ? 'bg-[#131620] border-white/[0.04]' : 'bg-[#F9FAFB] border-gray-100'
            }`}>
              <span className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-[#0058FF]/25 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>3</span>
              <span>Trimite PDF-ul + chitanța de 20 lei pe email către arhiva Judecătoriei.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive OCR Review & Correction Sheet Modal */}
      <OcrReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        extractedData={reviewData}
        compressionStats={compressionStats}
        onConfirm={handleConfirmOcrData}
      />

    </div>
  );
};
