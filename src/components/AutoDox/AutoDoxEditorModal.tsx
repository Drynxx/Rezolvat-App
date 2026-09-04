import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Car,
  User,
  FileText,
  Download,
  RefreshCw,
  Sparkles,
  Camera,
  Upload,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateItl054BundlePdf, ITL054DataPayload, numberToRomanianWords } from '../../lib/pdf/itl054-generator';
import { AutoDoxScannerModal } from './AutoDoxScannerModal';
import { AutoDoxDocType, AutoDoxScanResult } from '../../types';
import { validateRomanianCnp, validateVin, extractAutoDoxFromImage } from '../../lib/ocr/autodox-gemini-vision';
import { preprocessDocumentImage } from '../../lib/ocr/compression';
import { useTheme } from '../../context/ThemeContext';

interface AutoDoxEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 'vehicle' | 'seller' | 'buyer' | 'deal';

export const AutoDoxEditorModal: React.FC<AutoDoxEditorModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState<WizardStep>('vehicle');
  const [direction, setDirection] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerDocType, setScannerDocType] = useState<AutoDoxDocType>('vehicle_talon');
  const [scannedBadges, setScannedBadges] = useState<{ seller?: boolean; buyer?: boolean; vehicle?: boolean }>({});
  const [scanToast, setScanToast] = useState<string | null>(null);
  const [isDirectProcessing, setIsDirectProcessing] = useState<boolean>(false);

  // Clean initial state (Zero Mock Data)
  const [formData, setFormData] = useState<ITL054DataPayload>({
    sellerFiscalOrg: {
      name: '',
      cifSiruta: '',
      address: '',
      contact: '',
      remtiiNumber: '',
      rolNumber: '',
    },
    seller: {
      fullName: '',
      country: 'ROMÂNIA',
      county: '',
      postalCode: '',
      city: '',
      street: '',
      number: '',
      block: '',
      apartment: '',
      ciSeries: '',
      ciNumber: '',
      cnp: '',
      phone: '',
      email: '',
    },
    buyer: {
      fullName: '',
      country: 'ROMÂNIA',
      county: '',
      postalCode: '',
      city: '',
      street: '',
      number: '',
      block: '',
      apartment: '',
      ciSeries: '',
      ciNumber: '',
      cnp: '',
      phone: '',
      email: '',
    },
    buyerFiscalOrg: {
      name: '',
      cifSiruta: '',
      address: '',
      contact: '',
      remtiiNumber: '',
      rolNumber: '',
    },
    vehicle: {
      make: '',
      type: '',
      vin: '',
      engineSerial: '',
      displacementCm3: undefined,
      maxMassTons: undefined,
      plateNumber: '',
      itpExpiryDate: '',
      civSeries: '',
      firstRegYear: undefined,
      euroNorm: '',
      acquiredDate: '',
      acquisitionAct: '',
    },
    commercial: {
      priceRon: 0,
      priceRonWords: '',
      hasAnnexes: false,
      contractDate: new Date().toISOString().split('T')[0],
      contractPlace: '',
    },
  });

  if (!isOpen) return null;

  const stepsList: { id: WizardStep; label: string; icon: React.FC<any>; isDone: boolean }[] = [
    {
      id: 'vehicle',
      label: '1. Vehicul (Talon)',
      icon: Car,
      isDone: !!(formData.vehicle.vin && formData.vehicle.make),
    },
    {
      id: 'seller',
      label: '2. Vânzător (CI)',
      icon: User,
      isDone: !!(formData.seller.fullName && formData.seller.cnp),
    },
    {
      id: 'buyer',
      label: '3. Cumpărător (CI)',
      icon: User,
      isDone: !!(formData.buyer.fullName && formData.buyer.cnp),
    },
    {
      id: 'deal',
      label: '4. Tranzacție & Final',
      icon: FileText,
      isDone: formData.commercial.priceRon > 0,
    },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.id === currentStep);

  const goToStep = (target: WizardStep) => {
    const targetIndex = stepsList.findIndex((s) => s.id === target);
    setDirection(targetIndex > currentStepIndex ? 1 : -1);
    setCurrentStep(target);
  };

  const handlePriceChange = (val: number) => {
    const words = numberToRomanianWords(val) ? `${numberToRomanianWords(val)} lei` : '';
    setFormData((prev) => ({
      ...prev,
      commercial: {
        ...prev.commercial,
        priceRon: val,
        priceRonWords: words,
      },
    }));
  };

  const handleApplyScanData = (result: AutoDoxScanResult) => {
    if (result.ciData) {
      const ci = result.ciData;
      if (result.docType === 'seller_ci' || currentStep === 'seller') {
        setFormData((prev) => ({
          ...prev,
          seller: {
            ...prev.seller,
            fullName: ci.fullName || prev.seller.fullName,
            cnp: ci.cnp || prev.seller.cnp,
            ciSeries: ci.ciSeries || prev.seller.ciSeries,
            ciNumber: ci.ciNumber || prev.seller.ciNumber,
            county: ci.county || prev.seller.county,
            city: ci.city || prev.seller.city,
            street: ci.street || prev.seller.street,
            number: ci.number || prev.seller.number,
            block: ci.block || prev.seller.block,
            staircase: ci.staircase || prev.seller.staircase,
            floor: ci.floor || prev.seller.floor,
            apartment: ci.apartment || prev.seller.apartment,
            postalCode: ci.postalCode || prev.seller.postalCode,
          },
          sellerFiscalOrg: result.detectedOffice
            ? {
                ...prev.sellerFiscalOrg,
                name: result.detectedOffice.name,
                cifSiruta: result.detectedOffice.cifSiruta,
                address: result.detectedOffice.address,
                contact: result.detectedOffice.contact,
              }
            : prev.sellerFiscalOrg,
        }));
        setScannedBadges((prev) => ({ ...prev, seller: true }));
        setScanToast(`Vânzător extras cu succes din CI (${result.processingTimeMs}ms • ~${result.tokensUsedEstimate} tk)`);
      } else {
        setFormData((prev) => ({
          ...prev,
          buyer: {
            ...prev.buyer,
            fullName: ci.fullName || prev.buyer.fullName,
            cnp: ci.cnp || prev.buyer.cnp,
            ciSeries: ci.ciSeries || prev.buyer.ciSeries,
            ciNumber: ci.ciNumber || prev.buyer.ciNumber,
            county: ci.county || prev.buyer.county,
            city: ci.city || prev.buyer.city,
            street: ci.street || prev.buyer.street,
            number: ci.number || prev.buyer.number,
            block: ci.block || prev.buyer.block,
            staircase: ci.staircase || prev.buyer.staircase,
            floor: ci.floor || prev.buyer.floor,
            apartment: ci.apartment || prev.buyer.apartment,
            postalCode: ci.postalCode || prev.buyer.postalCode,
          },
          buyerFiscalOrg: result.detectedOffice
            ? {
                ...prev.buyerFiscalOrg,
                name: result.detectedOffice.name,
                cifSiruta: result.detectedOffice.cifSiruta,
                address: result.detectedOffice.address,
                contact: result.detectedOffice.contact,
              }
            : prev.buyerFiscalOrg,
        }));
        setScannedBadges((prev) => ({ ...prev, buyer: true }));
        setScanToast(`Cumpărător extras cu succes din CI (${result.processingTimeMs}ms • ~${result.tokensUsedEstimate} tk)`);
      }
    }

    if (result.vehicleData) {
      const v = result.vehicleData;
      setFormData((prev) => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          make: v.make || prev.vehicle.make,
          type: v.type || prev.vehicle.type,
          vin: v.vin || prev.vehicle.vin,
          engineSerial: v.engineSerial || prev.vehicle.engineSerial,
          displacementCm3: v.displacementCm3 || prev.vehicle.displacementCm3,
          maxMassTons: v.maxMassTons || prev.vehicle.maxMassTons,
          plateNumber: v.plateNumber || prev.vehicle.plateNumber,
          civSeries: v.civSeries || prev.vehicle.civSeries,
          firstRegYear: v.firstRegYear || prev.vehicle.firstRegYear,
          euroNorm: v.euroNorm || prev.vehicle.euroNorm,
        },
      }));
      setScannedBadges((prev) => ({ ...prev, vehicle: true }));
      setScanToast(`Talon auto extras cu succes (${result.processingTimeMs}ms • ~${result.tokensUsedEstimate} tk)`);
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const pdfBytes = await generateItl054BundlePdf(formData);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanVin = formData.vehicle.vin || 'Dosar_Nou';
      link.download = `Model_2026_ITL_054_Contract_Auto_${cleanVin}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err) {
      console.error('Error downloading Model 2026 ITL 054:', err);
      alert('Eroare la generarea dosarului oficial PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openScanForCurrentStep = () => {
    if (currentStep === 'vehicle') {
      setScannerDocType('vehicle_talon');
    } else if (currentStep === 'seller') {
      setScannerDocType('seller_ci');
    } else if (currentStep === 'buyer') {
      setScannerDocType('buyer_ci');
    } else {
      setScannerDocType('auto_detect');
    }
    setIsScannerOpen(true);
  };

  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: AutoDoxDocType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsDirectProcessing(true);
      setScanToast('Optimizare WebP și analiză Gemini 3.6 Flash...');
      const compressed = await preprocessDocumentImage(file, 1024, 0.75);
      const res = await extractAutoDoxFromImage(compressed.base64, docType, compressed.mimeType);
      handleApplyScanData(res);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err: any) {
      console.error('Error during quick OCR upload:', err);
      alert(err?.message || 'A apărut o eroare la procesarea fotografiei. Vă rugăm reîncercați.');
    } finally {
      setIsDirectProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  const isCurrentVinValid = validateVin(formData.vehicle.vin);
  const isSellerCnpValid = validateRomanianCnp(formData.seller.cnp);
  const isBuyerCnpValid = validateRomanianCnp(formData.buyer.cnp);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-3xl max-h-[96vh] sm:max-h-[94vh] rounded-[24px] sm:rounded-[28px] overflow-hidden flex flex-col shadow-2xl border ${
            isDark
              ? 'bg-[#0E121D]/90 border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl'
              : 'bg-white/95 border-gray-200 shadow-2xl backdrop-blur-2xl'
          }`}
        >
          {/* TOP BAR: Glassmorphism Header */}
          <div className="p-4 sm:p-5 border-b border-[var(--panel-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                  isDark
                    ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_15px_rgba(0,88,255,0.25)]'
                    : 'bg-[#0058FF]/10 text-[#0058FF]'
                }`}
              >
                <Car className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-[var(--text-main)] tracking-tight">
                    Model 2026 ITL 054
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isDark
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30'
                        : 'bg-[#0058FF]/10 text-[#0058FF]'
                    }`}
                  >
                    5x Exemplare Oficiale
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Cartușe fiscale A, B, C, D conforme cu Legea 207/2015 Codul de Procedură Fiscală
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isDark
                  ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.08]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* STEPPER BAR: Fluid Glassmorphic Pills */}
          <div className="px-4 py-3 border-b border-[var(--panel-border)] bg-black/[0.03] dark:bg-white/[0.01]">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {stepsList.map((step, idx) => {
                const isActive = step.id === currentStep;
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`p-2 sm:py-2.5 sm:px-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-2 ${
                      isActive
                        ? isDark
                          ? 'bg-[#0058FF]/20 border-[#38BDF8] text-white shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-[#0058FF]/10 border-[#0058FF] text-[#0058FF] shadow-sm'
                        : step.isDone
                        ? isDark
                          ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#34D399]'
                          : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                        : isDark
                        ? 'bg-[#131620]/60 border-white/[0.04] text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]'
                        : 'bg-white/60 border-gray-100 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        isActive
                          ? isDark
                            ? 'bg-[#38BDF8] text-[#0A0E17]'
                            : 'bg-[#0058FF] text-white'
                          : step.isDone
                          ? 'bg-[#10B981] text-white'
                          : isDark
                          ? 'bg-white/[0.08] text-[var(--text-muted)]'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>

                    <div className="min-w-0 hidden sm:flex flex-col">
                      <span className="text-[11px] font-bold truncate leading-tight">
                        {step.label.split('. ')[1]}
                      </span>
                      <span className="text-[9px] opacity-70 truncate">
                        {step.isDone ? 'Completat ✓' : isActive ? 'În editare...' : 'În așteptare'}
                      </span>
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0058FF] via-[#38BDF8] to-[#10B981]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* NOTIFICATION TOAST */}
          {scanToast && (
            <div className="mx-4 mt-3 p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium bg-[#10B981]/15 border-[#10B981]/30 text-[#34D399] animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{scanToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setScanToast(null)}
                className="p-1 hover:opacity-100 opacity-60 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* MAIN WIZARD BODY: Animated Glassmorphic Sections */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col text-xs">
            <AnimatePresence custom={direction} mode="wait">
              {/* STEP 1: VEHICUL */}
              {currentStep === 'vehicle' && (
                <motion.div
                  key="step-vehicle"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* AI Quick Scan Hero Glass Card */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden ${
                      isDark
                        ? 'bg-gradient-to-br from-[#0058FF]/15 via-[#131620]/80 to-[#38BDF8]/10 border-[#38BDF8]/30 shadow-[0_0_25px_rgba(0,88,255,0.15)]'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                          isDark ? 'bg-[#0058FF] text-white' : 'bg-[#0058FF] text-white'
                        }`}
                      >
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-2">
                          <span>Fă Poză la Talon / CIV Auto</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                            Zero-Mock • 1:1
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          Gemini 3.6 Flash extrage cu acuratețe seria de șasiu (VIN), marca și tipul exact așa cum sunt tipărite pe document.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-shrink-0">
                      <button
                        type="button"
                        onClick={openScanForCurrentStep}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#0058FF] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{scannedBadges.vehicle ? 'Scanează din Nou' : 'Fă Poză (Camera)'}</span>
                      </button>

                      <label
                        className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                          isDark
                            ? 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-white'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                        }`}
                      >
                        {isDirectProcessing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38BDF8]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Încarcă Talon</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={isDirectProcessing}
                          onChange={(e) => handleQuickUpload(e, 'vehicle_talon')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Manual / Verified Fields Form in Glass Container */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${
                      isDark ? 'bg-[#131620]/60 border-white/[0.06]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                        <Car className="w-4 h-4 text-[#38BDF8]" />
                        <span>(3) Obiectul Contractului (Datele Vehiculului)</span>
                      </div>
                      {isCurrentVinValid && (
                        <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                          ✓ VIN 17 Caractere Valid
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Număr de Identificare (VIN / Serie Șasiu) *
                        </label>
                        <input
                          type="text"
                          placeholder="ex: WVWZZZAUZHP104928"
                          value={formData.vehicle.vin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, vin: e.target.value.toUpperCase().replace(/[\s-]/g, '') },
                            })
                          }
                          className={`p-2.5 rounded-xl border font-mono font-bold text-xs uppercase outline-none transition-all ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-[#38BDF8] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/30'
                              : 'bg-gray-50 border-gray-200 text-[#0058FF] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Marca Vehiculului (D.1) *
                        </label>
                        <input
                          type="text"
                          placeholder="ex: DACIA, VOLKSWAGEN"
                          value={formData.vehicle.make}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, make: e.target.value.toUpperCase() } })
                          }
                          className={`p-2.5 rounded-xl border text-xs uppercase outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Tip / Model (D.3) *
                        </label>
                        <input
                          type="text"
                          placeholder="Exact ca pe talon, ex: LOGAN, GOLF"
                          value={formData.vehicle.type}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, type: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Nr. Înmatriculare (A)
                        </label>
                        <input
                          type="text"
                          placeholder="ex: B 104 BZX"
                          value={formData.vehicle.plateNumber || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, plateNumber: e.target.value.toUpperCase() },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs uppercase outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Serie CIV (Carte Identitate)
                        </label>
                        <input
                          type="text"
                          placeholder="ex: K910284"
                          value={formData.vehicle.civSeries || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, civSeries: e.target.value.toUpperCase() },
                            })
                          }
                          className={`p-2.5 rounded-xl border font-mono text-xs uppercase outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Capacitate Cilindrică (cm³)
                        </label>
                        <input
                          type="number"
                          placeholder="ex: 1968"
                          value={formData.vehicle.displacementCm3 || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, displacementCm3: Number(e.target.value) || undefined },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Masa Maximă (Tone)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="ex: 1.85"
                          value={formData.vehicle.maxMassTons || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, maxMassTons: Number(e.target.value) || undefined },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          An Fabricație / Înmatriculare
                        </label>
                        <input
                          type="number"
                          placeholder="ex: 2020"
                          value={formData.vehicle.firstRegYear || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, firstRegYear: Number(e.target.value) || undefined },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Normă Poluare (V.9)
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Euro 6, Euro 5"
                          value={formData.vehicle.euroNorm || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, euroNorm: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Serie Motor (P.5)
                        </label>
                        <input
                          type="text"
                          placeholder="ex: CRBC129481 (dacă există)"
                          value={formData.vehicle.engineSerial || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, engineSerial: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: VÂNZĂTOR */}
              {currentStep === 'seller' && (
                <motion.div
                  key="step-seller"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* AI Quick Scan Hero Glass Card */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden ${
                      isDark
                        ? 'bg-gradient-to-br from-[#0058FF]/15 via-[#131620]/80 to-[#38BDF8]/10 border-[#38BDF8]/30 shadow-[0_0_25px_rgba(0,88,255,0.15)]'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#0058FF] text-white shadow-md">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-2">
                          <span>Fă Poză la Buletinul (CI) Vânzătorului</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                            Extracție Instantă CI
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          Extrage automat Numele, CNP-ul, Seria/Numărul CI și adresa de domiciliu exact cum sunt tipărite.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-shrink-0">
                      <button
                        type="button"
                        onClick={openScanForCurrentStep}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#0058FF] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{scannedBadges.seller ? 'Scanează din Nou' : 'Fă Poză (Camera)'}</span>
                      </button>

                      <label
                        className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                          isDark
                            ? 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-white'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                        }`}
                      >
                        {isDirectProcessing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38BDF8]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Încarcă CI Vânzător</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={isDirectProcessing}
                          onChange={(e) => handleQuickUpload(e, 'seller_ci')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Seller Details Form */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${
                      isDark ? 'bg-[#131620]/60 border-white/[0.06]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                        <User className="w-4 h-4 text-[#38BDF8]" />
                        <span>(1) Persoana care înstrăinează (Vânzător)</span>
                      </div>
                      {isSellerCnpValid && (
                        <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                          ✓ CNP Validat Matematic
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Nume & Prenume Vânzător *
                        </label>
                        <input
                          type="text"
                          placeholder="ex: POPESCU MIHAI"
                          value={formData.seller.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, fullName: e.target.value.toUpperCase() } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          CNP Vânzător *
                        </label>
                        <input
                          type="text"
                          placeholder="13 cifre"
                          value={formData.seller.cnp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seller: { ...formData.seller, cnp: e.target.value.replace(/[\s-]/g, '') },
                            })
                          }
                          className={`p-2.5 rounded-xl border font-mono text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          CI Seria & Număr
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Seria"
                            value={formData.seller.ciSeries}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                seller: { ...formData.seller, ciSeries: e.target.value.toUpperCase() },
                              })
                            }
                            className={`w-16 p-2.5 rounded-xl border text-xs uppercase outline-none ${
                              isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Număr (6 cifre)"
                            value={formData.seller.ciNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, seller: { ...formData.seller, ciNumber: e.target.value } })
                            }
                            className={`flex-1 p-2.5 rounded-xl border text-xs outline-none ${
                              isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Județ</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj, București"
                          value={formData.seller.county}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, county: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Localitate / Sector
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Cluj-Napoca, Sector 1"
                          value={formData.seller.city}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, city: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Stradă & Număr Imobil
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Str. Dorobanți nr. 34"
                          value={`${formData.seller.street}${formData.seller.number ? ` nr. ${formData.seller.number}` : ''}`}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, street: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-3 grid grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Bloc"
                          value={formData.seller.block || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, block: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Scară"
                          value={formData.seller.staircase || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, staircase: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Etaj"
                          value={formData.seller.floor || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, floor: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Apartament"
                          value={formData.seller.apartment || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, apartment: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* DITL Info Card */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs mt-1 ${
                        isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <div className="font-bold">Organ Fiscal Vânzător (Cartuș A & B)</div>
                          <div className="text-[11px] opacity-80">
                            {formData.sellerFiscalOrg?.name || 'Se detectează automat din localitatea vânzătorului'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                        DITL Viză
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CUMPĂRĂTOR */}
              {currentStep === 'buyer' && (
                <motion.div
                  key="step-buyer"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* AI Quick Scan Hero Glass Card */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden ${
                      isDark
                        ? 'bg-gradient-to-br from-[#0058FF]/15 via-[#131620]/80 to-[#38BDF8]/10 border-[#38BDF8]/30 shadow-[0_0_25px_rgba(0,88,255,0.15)]'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#0058FF] text-white shadow-md">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-2">
                          <span>Fă Poză la Buletinul (CI) Cumpărătorului</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                            Extracție Instantă CI
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          Extrage datele cumpărătorului pentru cartușele C și D ale primăriei noului proprietar.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-shrink-0">
                      <button
                        type="button"
                        onClick={openScanForCurrentStep}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#0058FF] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{scannedBadges.buyer ? 'Scanează din Nou' : 'Fă Poză (Camera)'}</span>
                      </button>

                      <label
                        className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                          isDark
                            ? 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-white'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                        }`}
                      >
                        {isDirectProcessing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#38BDF8]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Încarcă CI Cumpărător</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          disabled={isDirectProcessing}
                          onChange={(e) => handleQuickUpload(e, 'buyer_ci')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Buyer Details Form */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${
                      isDark ? 'bg-[#131620]/60 border-white/[0.06]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                        <User className="w-4 h-4 text-[#38BDF8]" />
                        <span>(2) Persoana care dobândește (Cumpărător)</span>
                      </div>
                      {isBuyerCnpValid && (
                        <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                          ✓ CNP Validat Matematic
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Nume & Prenume Cumpărător *
                        </label>
                        <input
                          type="text"
                          placeholder="ex: IONESCU ELENA"
                          value={formData.buyer.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, fullName: e.target.value.toUpperCase() } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          CNP Cumpărător *
                        </label>
                        <input
                          type="text"
                          placeholder="13 cifre"
                          value={formData.buyer.cnp}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              buyer: { ...formData.buyer, cnp: e.target.value.replace(/[\s-]/g, '') },
                            })
                          }
                          className={`p-2.5 rounded-xl border font-mono text-xs outline-none ${
                            isDark
                              ? 'bg-black/30 border-white/[0.08] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          CI Seria & Număr
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Seria"
                            value={formData.buyer.ciSeries}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                buyer: { ...formData.buyer, ciSeries: e.target.value.toUpperCase() },
                              })
                            }
                            className={`w-16 p-2.5 rounded-xl border text-xs uppercase outline-none ${
                              isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Număr (6 cifre)"
                            value={formData.buyer.ciNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, buyer: { ...formData.buyer, ciNumber: e.target.value } })
                            }
                            className={`flex-1 p-2.5 rounded-xl border text-xs outline-none ${
                              isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Județ</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj, Ilfov"
                          value={formData.buyer.county}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, county: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Localitate / Sector
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Cluj-Napoca"
                          value={formData.buyer.city}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, city: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Stradă & Număr Imobil
                        </label>
                        <input
                          type="text"
                          placeholder="ex: Calea Florești nr. 78"
                          value={`${formData.buyer.street}${formData.buyer.number ? ` nr. ${formData.buyer.number}` : ''}`}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, street: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-3 grid grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Bloc"
                          value={formData.buyer.block || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, block: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Scară"
                          value={formData.buyer.staircase || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, staircase: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Etaj"
                          value={formData.buyer.floor || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, floor: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Apartament"
                          value={formData.buyer.apartment || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, apartment: e.target.value } })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* DITL Buyer Card */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs mt-1 ${
                        isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 flex-shrink-0" />
                        <div>
                          <div className="font-bold">Organ Fiscal Cumpărător (Cartuș C & D)</div>
                          <div className="text-[11px] opacity-80">
                            {formData.buyerFiscalOrg?.name || 'Se detectează automat din localitatea cumpărătorului'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                        Înregistrare 30 zile
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: TRANZACȚIE & FINALIZARE */}
              {currentStep === 'deal' && (
                <motion.div
                  key="step-deal"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* Price & Commercial Details Form */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col gap-3.5 ${
                      isDark ? 'bg-[#131620]/60 border-white/[0.06]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-[var(--panel-border)]">
                      <FileText className="w-4 h-4 text-[#38BDF8]" />
                      <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)]">
                        (4) Prețul și Detaliile Contractului
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Preț în Cifre (LEI / RON) *
                        </label>
                        <input
                          type="number"
                          placeholder="ex: 45000"
                          value={formData.commercial.priceRon || ''}
                          onChange={(e) => handlePriceChange(Number(e.target.value))}
                          className={`p-3 rounded-xl border font-extrabold text-sm outline-none ${
                            isDark
                              ? 'bg-black/40 border-white/[0.1] text-white focus:border-[#38BDF8]'
                              : 'bg-white border-gray-200 text-[#111827] focus:border-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Preț în Litere (Generat Automat în Română)
                        </label>
                        <input
                          type="text"
                          readOnly
                          placeholder="ex: patruzeci și cinci de mii lei"
                          value={formData.commercial.priceRonWords}
                          className={`p-3 rounded-xl border text-xs outline-none ${
                            isDark
                              ? 'bg-black/20 border-white/[0.06] text-[#38BDF8]'
                              : 'bg-gray-50 border-gray-200 text-[#0058FF]'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Data Încheierii
                        </label>
                        <input
                          type="date"
                          value={formData.commercial.contractDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              commercial: { ...formData.commercial, contractDate: e.target.value },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                          Locul Încheierii Contractului
                        </label>
                        <input
                          type="text"
                          placeholder="ex: București, Sector 1"
                          value={formData.commercial.contractPlace}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              commercial: { ...formData.commercial, contractPlace: e.target.value },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-xs outline-none ${
                            isDark ? 'bg-black/30 border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complete Dossier Review Bento Card */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col gap-3 ${
                      isDark
                        ? 'bg-gradient-to-br from-[#131620] to-[#0A0E17] border-white/[0.08]'
                        : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                      <div className="flex items-center gap-2 font-bold text-xs text-[var(--text-main)]">
                        <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                        <span>Centralizator Dosar Model 2026 ITL 054</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#34D399]">Gata de Generare</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl border border-white/[0.04] bg-black/20">
                        <div className="text-[9px] text-[var(--text-muted)] uppercase font-semibold">Vehicul</div>
                        <div className="font-bold text-[var(--text-main)] truncate mt-0.5">
                          {formData.vehicle.make ? `${formData.vehicle.make} ${formData.vehicle.type}` : 'Nespecificat'}
                        </div>
                        <div className="font-mono text-[10px] opacity-70 truncate">
                          {formData.vehicle.vin || 'VIN lipsă'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-white/[0.04] bg-black/20">
                        <div className="text-[9px] text-[var(--text-muted)] uppercase font-semibold">Vânzător</div>
                        <div className="font-bold text-[var(--text-main)] truncate mt-0.5">
                          {formData.seller.fullName || 'Nume lipsă'}
                        </div>
                        <div className="font-mono text-[10px] opacity-70 truncate">
                          {formData.seller.cnp || 'CNP lipsă'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-white/[0.04] bg-black/20">
                        <div className="text-[9px] text-[var(--text-muted)] uppercase font-semibold">Cumpărător</div>
                        <div className="font-bold text-[var(--text-main)] truncate mt-0.5">
                          {formData.buyer.fullName || 'Nume lipsă'}
                        </div>
                        <div className="font-mono text-[10px] opacity-70 truncate">
                          {formData.buyer.cnp || 'CNP lipsă'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-white/[0.04] bg-black/20">
                        <div className="text-[9px] text-[var(--text-muted)] uppercase font-semibold">Preț Oficial</div>
                        <div className="font-bold text-[#34D399] truncate mt-0.5">
                          {formData.commercial.priceRon ? `${formData.commercial.priceRon} RON` : '0 RON'}
                        </div>
                        <div className="text-[10px] opacity-70 truncate">
                          {formData.commercial.contractDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER: Fluid Stepper Navigation & Download */}
          <div className="p-3 sm:p-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-[var(--panel-border)] flex items-center justify-between gap-2 sm:gap-3 bg-black/[0.04] dark:bg-white/[0.02] flex-shrink-0 z-10">
            <div>
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepsList[currentStepIndex - 1].id)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isDark
                      ? 'bg-[#131620] border-white/[0.08] text-white hover:bg-white/[0.05]'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Înapoi</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'text-[#A0A0A0] hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Anulează
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline mr-2">
                Pasul {currentStepIndex + 1} din {stepsList.length}
              </span>

              {currentStepIndex < stepsList.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepsList[currentStepIndex + 1].id)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#0058FF] hover:bg-[#0047D4] text-white rounded-full text-xs font-bold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <span className="hidden sm:inline">Continuă spre {stepsList[currentStepIndex + 1].label.split('. ')[1]}</span>
                  <span className="sm:hidden">Continuă</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#0058FF] to-[#0047D4] hover:from-[#0047D4] hover:to-[#003bb3] text-white rounded-full text-xs font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-lg active:scale-98 border border-[#38BDF8]/40 shadow-[0_0_20px_rgba(0,88,255,0.4)]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#38BDF8]" />
                      <span>Generare...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Descarcă Model 2026 ITL 054 (5x Exemplare)</span>
                      <span className="sm:hidden">Descarcă 5x ITL 054</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AutoDox Low-Token AI Scanner Modal */}
      <AutoDoxScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        initialDocType={scannerDocType}
        onApplyData={handleApplyScanData}
      />
    </AnimatePresence>
  );
};
