import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X,
  Car,
  User,
  FileText,
  Download,
  RefreshCw,
  Camera,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Building,
  Coins,
  MapPin,
  Calendar,
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

  // Currency & Rate states
  const [currencyMode, setCurrencyMode] = useState<'RON' | 'EUR'>('RON');
  const [priceEur, setPriceEur] = useState<number | ''>('');
  const [eurRate, setEurRate] = useState<number>(4.97);

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
      staircase: '',
      floor: '',
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
      staircase: '',
      floor: '',
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

  const stepsList: { id: WizardStep; label: string; shortLabel: string; icon: React.FC<any>; isDone: boolean }[] = [
    {
      id: 'vehicle',
      label: '1. Vehicul (Talon)',
      shortLabel: 'Vehicul',
      icon: Car,
      isDone: !!(formData.vehicle.vin && formData.vehicle.make),
    },
    {
      id: 'seller',
      label: '2. Vânzător (CI)',
      shortLabel: 'Vânzător',
      icon: User,
      isDone: !!(formData.seller.fullName && formData.seller.cnp),
    },
    {
      id: 'buyer',
      label: '3. Cumpărător (CI)',
      shortLabel: 'Cumpărător',
      icon: User,
      isDone: !!(formData.buyer.fullName && formData.buyer.cnp),
    },
    {
      id: 'deal',
      label: '4. Tranzacție & Preț',
      shortLabel: 'Tranzacție',
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

  const handlePriceRonChange = (val: number | '') => {
    const numericVal = val === '' ? 0 : val;
    const words = numberToRomanianWords(numericVal) ? `${numberToRomanianWords(numericVal)} lei` : '';
    setFormData((prev) => ({
      ...prev,
      commercial: {
        ...prev.commercial,
        priceRon: numericVal,
        priceRonWords: words,
      },
    }));
    if (numericVal > 0 && eurRate > 0) {
      setPriceEur(Math.round(numericVal / eurRate));
    } else {
      setPriceEur('');
    }
  };

  const handlePriceEurChange = (val: number | '', rate = eurRate) => {
    setPriceEur(val);
    const numericEur = val === '' ? 0 : val;
    const calculatedRon = Math.round(numericEur * rate);
    const words = numberToRomanianWords(calculatedRon) ? `${numberToRomanianWords(calculatedRon)} lei` : '';
    setFormData((prev) => ({
      ...prev,
      commercial: {
        ...prev.commercial,
        priceRon: calculatedRon,
        priceRonWords: words,
      },
    }));
  };

  const handleRateChange = (rate: number) => {
    setEurRate(rate);
    if (currencyMode === 'EUR' && typeof priceEur === 'number' && priceEur > 0) {
      handlePriceEurChange(priceEur, rate);
    }
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
        toast.success(`Vânzător extras din CI (${result.processingTimeMs}ms)`);
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
        toast.success(`Cumpărător extras din CI (${result.processingTimeMs}ms)`);
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
      toast.success(`Talon auto extras (${result.processingTimeMs}ms)`);
    }
  };

  const handleDownload = async () => {
    const toastId = toast.loading('Se generează setul de 5 exemplare oficiale ITL 054...');
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

      toast.success('Dosarul oficial PDF a fost descărcat cu succes!', { id: toastId });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err) {
      console.error('Error downloading Model 2026 ITL 054:', err);
      toast.error('Eroare la generarea dosarului oficial PDF.', { id: toastId });
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
    const toastId = toast.loading('Optimizare imagine și analiză Gemini Flash...');
    try {
      setIsDirectProcessing(true);
      const compressed = await preprocessDocumentImage(file, 1024, 0.75);
      const res = await extractAutoDoxFromImage(compressed.base64, docType, compressed.mimeType);
      handleApplyScanData(res);
      toast.dismiss(toastId);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err: any) {
      console.error('Error during quick OCR upload:', err);
      toast.error(err?.message || 'A apărut o eroare la procesarea fotografiei. Vă rugăm reîncercați.', { id: toastId });
    } finally {
      setIsDirectProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  const isCurrentVinValid = validateVin(formData.vehicle.vin);
  const isSellerCnpValid = validateRomanianCnp(formData.seller.cnp);
  const isBuyerCnpValid = validateRomanianCnp(formData.buyer.cnp);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 24 : -24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 24 : -24, opacity: 0 }),
  };

  // ── macOS Minimalist Design Tokens ──────────────────────────────────────────
  const bg = isDark ? '#0D1117' : '#FFFFFF';
  const surface = isDark ? 'rgba(255, 255, 255, 0.03)' : '#F9FAFB';
  const border = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const borderLight = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  const textPrimary = isDark ? '#F5F5F7' : '#1D1D1F';
  const textSecondary = isDark ? '#86868B' : '#6E6E73';
  const textTertiary = isDark ? '#545458' : '#AEAEB2';
  const accent = '#0058FF';
  const accentBg = isDark ? 'rgba(0, 88, 255, 0.12)' : 'rgba(0, 88, 255, 0.06)';
  const accentBorder = isDark ? 'rgba(0, 88, 255, 0.25)' : 'rgba(0, 88, 255, 0.15)';
  const emerald = isDark ? '#30D158' : '#28A745';
  const emeraldBg = isDark ? 'rgba(48, 209, 88, 0.1)' : 'rgba(40, 167, 69, 0.08)';

  // Input styles
  const inputClass = `w-full px-3 py-2 rounded-xl text-xs outline-none transition-all ${
    isDark
      ? 'bg-black/30 border border-white/[0.08] text-white placeholder-zinc-500 focus:border-[#0058FF] focus:ring-1 focus:ring-[#0058FF]/30'
      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#0058FF] focus:ring-1 focus:ring-[#0058FF]/20'
  }`;

  const labelClass = 'text-[11px] font-medium text-slate-500 dark:text-zinc-400 mb-1 block';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(24px)' }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 14 }}
          transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          className="w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-t-[28px] sm:rounded-[28px] shadow-2xl relative"
          style={{
            background: bg,
            border: `1px solid ${border}`,
            boxShadow: isDark ? '0 24px 70px rgba(0,0,0,0.8), inset 0 1px 0 0 rgba(255,255,255,0.08)' : '0 16px 40px rgba(0,0,0,0.12), inset 0 1px 0 0 rgba(255,255,255,0.8)',
          }}
        >
          {/* ── WINDOW HEADER (Apple macOS Style) ────────────────────────────── */}
          <div
            className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
            style={{ borderBottom: `1px solid ${borderLight}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accent }}
              >
                <Car className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight" style={{ color: textPrimary }}>
                    Model 2026 ITL 054
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: emeraldBg, color: emerald }}
                  >
                    5x Exemplare
                  </span>
                </div>
                <div className="text-[11px]" style={{ color: textSecondary }}>
                  Contract Înstrăinare-Dobândire Auto · Legea 207/2015
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 btn-press"
              style={{ color: textSecondary }}
              title="Închide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── SEGMENTED STEPPER (Fluid Apple Spring Pill) ──────────────────── */}
          <div className="px-4 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${borderLight}` }}>
            <div
              className="grid grid-cols-4 gap-1 p-1 rounded-xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
            >
              {stepsList.map((step, idx) => {
                const isActive = step.id === currentStep;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className="relative flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer select-none btn-press z-10"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="wizard-stepper-pill"
                        className="absolute inset-0 rounded-lg -z-10 shadow-sm"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
                          boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                        }}
                        transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                      />
                    )}
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      style={{
                        background: isActive ? accent : step.isDone ? emerald : 'transparent',
                        color: isActive || step.isDone ? '#FFFFFF' : textTertiary,
                        border: isActive || step.isDone ? 'none' : `1px solid ${border}`,
                      }}
                    >
                      {step.isDone && !isActive ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className="text-[11px] font-medium truncate"
                      style={{
                        color: isActive ? textPrimary : textSecondary,
                        fontWeight: isActive ? 650 : 500,
                      }}
                    >
                      {step.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SCROLLABLE BODY ────────────────────────────────────────────── */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4 text-xs">
            <AnimatePresence custom={direction} mode="wait">
              {/* ── STEP 1: VEHICUL ────────────────────────────────────────── */}
              {currentStep === 'vehicle' && (
                <motion.div
                  key="step-vehicle"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* Quick AI OCR Bar */}
                  <div
                    className="p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: accent, color: '#FFFFFF' }}
                      >
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs" style={{ color: textPrimary }}>
                          Scanează Talon Auto (Certificat Înmatriculare)
                        </div>
                        <div className="text-[11px]" style={{ color: textSecondary }}>
                          Extrage automat VIN, Marcă, Model, Serie CIV prin Gemini OCR
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={openScanForCurrentStep}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        style={{ background: accent, color: '#FFFFFF' }}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{scannedBadges.vehicle ? 'Re-scanează' : 'Cameră'}</span>
                      </button>

                      <label
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                          borderColor: border,
                          color: textPrimary,
                        }}
                      >
                        {isDirectProcessing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0058FF]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Încarcă</span>
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

                  {/* Form Container */}
                  <div
                    className="p-4 rounded-2xl flex flex-col gap-3"
                    style={{ background: surface, border: `1px solid ${border}` }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${borderLight}` }}>
                      <span className="font-bold text-xs uppercase tracking-wider" style={{ color: textSecondary }}>
                        Date Identificare Vehicul
                      </span>
                      {isCurrentVinValid && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: emeraldBg, color: emerald }}>
                          ✓ VIN 17 Caractere Valid
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Număr Identificare (VIN / Serie Șasiu) *</label>
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
                          className={`${inputClass} font-mono font-bold uppercase tracking-wider`}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Marca (D.1) *</label>
                        <input
                          type="text"
                          placeholder="ex: VOLKSWAGEN, DACIA"
                          value={formData.vehicle.make}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, make: e.target.value.toUpperCase() } })
                          }
                          className={`${inputClass} uppercase`}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Model / Tip Comercial (D.3) *</label>
                        <input
                          type="text"
                          placeholder="ex: GOLF 7, DUSTER"
                          value={formData.vehicle.type}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, type: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Nr. Înmatriculare (A)</label>
                        <input
                          type="text"
                          placeholder="ex: B 123 ABC"
                          value={formData.vehicle.plateNumber || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, plateNumber: e.target.value.toUpperCase() },
                            })
                          }
                          className={`${inputClass} uppercase`}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Serie CIV (Carte Identitate)</label>
                        <input
                          type="text"
                          placeholder="ex: K123456"
                          value={formData.vehicle.civSeries || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, civSeries: e.target.value.toUpperCase() },
                            })
                          }
                          className={`${inputClass} font-mono uppercase`}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Capacitate Cilindrică (cm³)</label>
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
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Masa Maximă Autorizată (Tone)</label>
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
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>An Fabricație / Înmatriculare</label>
                        <input
                          type="number"
                          placeholder="ex: 2019"
                          value={formData.vehicle.firstRegYear || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicle: { ...formData.vehicle, firstRegYear: Number(e.target.value) || undefined },
                            })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Normă Poluare (V.9)</label>
                        <input
                          type="text"
                          placeholder="ex: Euro 6, Euro 5"
                          value={formData.vehicle.euroNorm || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, vehicle: { ...formData.vehicle, euroNorm: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: VÂNZĂTOR ───────────────────────────────────────── */}
              {currentStep === 'seller' && (
                <motion.div
                  key="step-seller"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* Quick AI OCR Bar */}
                  <div
                    className="p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: accent, color: '#FFFFFF' }}
                      >
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs" style={{ color: textPrimary }}>
                          Scanează Buletin Vânzător (Carte Identitate)
                        </div>
                        <div className="text-[11px]" style={{ color: textSecondary }}>
                          Extrage CNP, Nume, Serie/Număr CI și Adresă de domiciliu
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={openScanForCurrentStep}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        style={{ background: accent, color: '#FFFFFF' }}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{scannedBadges.seller ? 'Re-scanează' : 'Cameră'}</span>
                      </button>

                      <label
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                          borderColor: border,
                          color: textPrimary,
                        }}
                      >
                        {isDirectProcessing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0058FF]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Încarcă</span>
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

                  {/* Form Container */}
                  <div
                    className="p-4 rounded-2xl flex flex-col gap-3"
                    style={{ background: surface, border: `1px solid ${border}` }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${borderLight}` }}>
                      <span className="font-bold text-xs uppercase tracking-wider" style={{ color: textSecondary }}>
                        Date Identificare Vânzător (Proprietar Actual)
                      </span>
                      {isSellerCnpValid && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: emeraldBg, color: emerald }}>
                          ✓ CNP Valid
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Nume și Prenume Complet *</label>
                        <input
                          type="text"
                          placeholder="ex: POPESCU ION"
                          value={formData.seller.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, fullName: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Cod Numeric Personal (CNP) *</label>
                        <input
                          type="text"
                          maxLength={13}
                          placeholder="ex: 1850412123456"
                          value={formData.seller.cnp}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, cnp: e.target.value.replace(/\D/g, '') } })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelClass}>Serie CI</label>
                          <input
                            type="text"
                            maxLength={2}
                            placeholder="ex: RX"
                            value={formData.seller.ciSeries}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                seller: { ...formData.seller, ciSeries: e.target.value.toUpperCase() },
                              })
                            }
                            className={`${inputClass} font-mono uppercase text-center`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Număr CI</label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="ex: 123456"
                            value={formData.seller.ciNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                seller: { ...formData.seller, ciNumber: e.target.value.replace(/\D/g, '') },
                              })
                            }
                            className={`${inputClass} font-mono text-center`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Județ / Sector *</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj, Sector 1"
                          value={formData.seller.county}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, county: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Localitate (Oraș / Sat) *</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj-Napoca, Florești"
                          value={formData.seller.city}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, city: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelClass}>Stradă și Număr</label>
                        <input
                          type="text"
                          placeholder="ex: Str. Memorandumului nr. 28"
                          value={`${formData.seller.street}${formData.seller.number ? ` nr. ${formData.seller.number}` : ''}`}
                          onChange={(e) =>
                            setFormData({ ...formData, seller: { ...formData.seller, street: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-4 gap-2">
                        <div>
                          <label className={labelClass}>Bloc</label>
                          <input
                            type="text"
                            placeholder="Bloc"
                            value={formData.seller.block || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, seller: { ...formData.seller, block: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Scară</label>
                          <input
                            type="text"
                            placeholder="Scară"
                            value={formData.seller.staircase || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, seller: { ...formData.seller, staircase: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Etaj</label>
                          <input
                            type="text"
                            placeholder="Etaj"
                            value={formData.seller.floor || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, seller: { ...formData.seller, floor: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Ap.</label>
                          <input
                            type="text"
                            placeholder="Ap"
                            value={formData.seller.apartment || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, seller: { ...formData.seller, apartment: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* DITL Badge */}
                    <div
                      className="p-2.5 rounded-xl flex items-center justify-between text-xs mt-1"
                      style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${borderLight}` }}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-[#0058FF] flex-shrink-0" />
                        <div>
                          <div className="font-semibold" style={{ color: textPrimary }}>DITL Vânzător (Cartuș A & B)</div>
                          <div className="text-[11px]" style={{ color: textSecondary }}>
                            {formData.sellerFiscalOrg?.name || 'Se alocă automat conform adresei de domiciliu'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: accentBg, color: accent }}>
                        Scoatere evidență
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: CUMPĂRĂTOR ──────────────────────────────────────── */}
              {currentStep === 'buyer' && (
                <motion.div
                  key="step-buyer"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* Quick AI OCR Bar */}
                  <div
                    className="p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: accent, color: '#FFFFFF' }}
                      >
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs" style={{ color: textPrimary }}>
                          Scanează Buletin Cumpărător (Carte Identitate)
                        </div>
                        <div className="text-[11px]" style={{ color: textSecondary }}>
                          Extrage datele noului proprietar pentru contract și viza DITL
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={openScanForCurrentStep}
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        style={{ background: accent, color: '#FFFFFF' }}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{scannedBadges.buyer ? 'Re-scanează' : 'Cameră'}</span>
                      </button>

                      <label
                        className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                          borderColor: border,
                          color: textPrimary,
                        }}
                      >
                        {isDirectProcessing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0058FF]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Încarcă</span>
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

                  {/* Form Container */}
                  <div
                    className="p-4 rounded-2xl flex flex-col gap-3"
                    style={{ background: surface, border: `1px solid ${border}` }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${borderLight}` }}>
                      <span className="font-bold text-xs uppercase tracking-wider" style={{ color: textSecondary }}>
                        Date Identificare Cumpărător (Noul Proprietar)
                      </span>
                      {isBuyerCnpValid && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: emeraldBg, color: emerald }}>
                          ✓ CNP Valid
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Nume și Prenume Cumpărător *</label>
                        <input
                          type="text"
                          placeholder="ex: IONESCU MARIA"
                          value={formData.buyer.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, fullName: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Cod Numeric Personal (CNP) *</label>
                        <input
                          type="text"
                          maxLength={13}
                          placeholder="ex: 2920615123456"
                          value={formData.buyer.cnp}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, cnp: e.target.value.replace(/\D/g, '') } })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelClass}>Serie CI</label>
                          <input
                            type="text"
                            maxLength={2}
                            placeholder="ex: DP"
                            value={formData.buyer.ciSeries}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                buyer: { ...formData.buyer, ciSeries: e.target.value.toUpperCase() },
                              })
                            }
                            className={`${inputClass} font-mono uppercase text-center`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Număr CI</label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="ex: 654321"
                            value={formData.buyer.ciNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                buyer: { ...formData.buyer, ciNumber: e.target.value.replace(/\D/g, '') },
                              })
                            }
                            className={`${inputClass} font-mono text-center`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Județ / Sector *</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj, Sector 2"
                          value={formData.buyer.county}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, county: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Localitate (Oraș / Sat) *</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj-Napoca, Florești"
                          value={formData.buyer.city}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, city: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className={labelClass}>Stradă și Număr</label>
                        <input
                          type="text"
                          placeholder="ex: Calea Florești nr. 78"
                          value={`${formData.buyer.street}${formData.buyer.number ? ` nr. ${formData.buyer.number}` : ''}`}
                          onChange={(e) =>
                            setFormData({ ...formData, buyer: { ...formData.buyer, street: e.target.value } })
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-4 gap-2">
                        <div>
                          <label className={labelClass}>Bloc</label>
                          <input
                            type="text"
                            placeholder="Bloc"
                            value={formData.buyer.block || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, buyer: { ...formData.buyer, block: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Scară</label>
                          <input
                            type="text"
                            placeholder="Scară"
                            value={formData.buyer.staircase || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, buyer: { ...formData.buyer, staircase: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Etaj</label>
                          <input
                            type="text"
                            placeholder="Etaj"
                            value={formData.buyer.floor || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, buyer: { ...formData.buyer, floor: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Ap.</label>
                          <input
                            type="text"
                            placeholder="Ap"
                            value={formData.buyer.apartment || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, buyer: { ...formData.buyer, apartment: e.target.value } })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* DITL Badge */}
                    <div
                      className="p-2.5 rounded-xl flex items-center justify-between text-xs mt-1"
                      style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${borderLight}` }}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-[#0058FF] flex-shrink-0" />
                        <div>
                          <div className="font-semibold" style={{ color: textPrimary }}>DITL Cumpărător (Cartuș C & D)</div>
                          <div className="text-[11px]" style={{ color: textSecondary }}>
                            {formData.buyerFiscalOrg?.name || 'Se alocă automat conform localității cumpărătorului'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: emeraldBg, color: emerald }}>
                        Înregistrare 30 zile
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: TRANZACȚIE & FINAL (RON / EUR SUPPORT) ─────────── */}
              {currentStep === 'deal' && (
                <motion.div
                  key="step-deal"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-4"
                >
                  {/* Currency Switcher & Price Input Card */}
                  <div
                    className="p-4 rounded-2xl flex flex-col gap-4"
                    style={{ background: surface, border: `1px solid ${border}` }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${borderLight}` }}>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-[#0058FF]" />
                        <span className="font-bold text-xs uppercase tracking-wider" style={{ color: textPrimary }}>
                          Prețul Tranzacției (Art. 4)
                        </span>
                      </div>

                      {/* Currency Mode Segmented Switch */}
                      <div
                        className="flex items-center p-0.5 rounded-lg"
                        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                      >
                        <button
                          type="button"
                          onClick={() => setCurrencyMode('RON')}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                          style={{
                            background: currencyMode === 'RON' ? (isDark ? 'rgba(255,255,255,0.15)' : '#FFFFFF') : 'transparent',
                            color: currencyMode === 'RON' ? textPrimary : textSecondary,
                            boxShadow: currencyMode === 'RON' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          LEI (RON)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrencyMode('EUR')}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          style={{
                            background: currencyMode === 'EUR' ? (isDark ? 'rgba(255,255,255,0.15)' : '#FFFFFF') : 'transparent',
                            color: currencyMode === 'EUR' ? textPrimary : textSecondary,
                            boxShadow: currencyMode === 'EUR' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          <span>EURO (€)</span>
                        </button>
                      </div>
                    </div>

                    {/* Dual Currency Input Fields */}
                    {currencyMode === 'EUR' ? (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className={labelClass}>Preț convenit în EURO (€) *</label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="ex: 8500"
                                value={priceEur}
                                onChange={(e) => handlePriceEurChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className={`${inputClass} text-base font-extrabold pr-10`}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-sm text-[#0058FF]">
                                €
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className={labelClass}>Curs Conversie (RON / €)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={eurRate}
                              onChange={(e) => handleRateChange(Number(e.target.value) || 4.97)}
                              className={`${inputClass} font-mono font-bold text-center`}
                            />
                          </div>
                        </div>

                        {/* Calculated Official RON Equivalent */}
                        <div
                          className="p-3 rounded-xl flex items-center justify-between"
                          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                        >
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: textSecondary }}>
                              Echivalent Oficial Înscris în Contract (RON)
                            </div>
                            <div className="font-extrabold text-sm" style={{ color: textPrimary }}>
                              {formData.commercial.priceRon.toLocaleString('ro-RO')} LEI
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: emeraldBg, color: emerald }}>
                            1 € = {eurRate} RON
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className={labelClass}>Preț Oficial în Cifre (LEI / RON) *</label>
                            <div className="relative">
                              <input
                                type="number"
                                placeholder="ex: 42000"
                                value={formData.commercial.priceRon || ''}
                                onChange={(e) => handlePriceRonChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className={`${inputClass} text-base font-extrabold pr-12`}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[#0058FF]">
                                LEI
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className={labelClass}>Echivalent Informativ (€)</label>
                            <div
                              className="px-3 py-2 rounded-xl text-xs flex items-center justify-between"
                              style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: `1px solid ${borderLight}` }}
                            >
                              <span className="font-extrabold text-sm" style={{ color: textPrimary }}>
                                {priceEur ? `≈ ${priceEur.toLocaleString('ro-RO')} €` : '0 €'}
                              </span>
                              <span className="text-[10px]" style={{ color: textSecondary }}>
                                @ {eurRate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preț în Litere (Auto-Generated) */}
                    <div>
                      <label className={labelClass}>Preț în Litere (Generat Automat conform legii)</label>
                      <input
                        type="text"
                        readOnly
                        value={formData.commercial.priceRonWords || 'zero lei'}
                        className={`${inputClass} font-medium opacity-90 cursor-default`}
                        style={{
                          background: isDark ? 'rgba(0, 88, 255, 0.08)' : 'rgba(0, 88, 255, 0.04)',
                          borderColor: accentBorder,
                          color: textPrimary,
                        }}
                      />
                    </div>

                    {/* Date & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className={labelClass}>Data Încheierii Contractului</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={formData.commercial.contractDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commercial: { ...formData.commercial, contractDate: e.target.value },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Locul Încheierii (Oraș, Județ)</label>
                        <input
                          type="text"
                          placeholder="ex: Cluj-Napoca, Cluj"
                          value={formData.commercial.contractPlace}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              commercial: { ...formData.commercial, contractPlace: e.target.value },
                            })
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Complete Dossier Summary Bento Card */}
                  <div
                    className="p-4 rounded-2xl flex flex-col gap-3"
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F9FAFB',
                      border: `1px solid ${border}`,
                    }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${borderLight}` }}>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" style={{ color: emerald }} />
                        <span className="font-bold text-xs" style={{ color: textPrimary }}>
                          Centralizator Dosar Model 2026 ITL 054
                        </span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: emerald }}>
                        5x Exemplare Gata
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl border" style={{ borderColor: borderLight, background: bg }}>
                        <div className="text-[9px] uppercase font-semibold" style={{ color: textSecondary }}>Vehicul</div>
                        <div className="font-bold truncate mt-0.5" style={{ color: textPrimary }}>
                          {formData.vehicle.make ? `${formData.vehicle.make} ${formData.vehicle.type}` : 'Nespecificat'}
                        </div>
                        <div className="font-mono text-[10px] opacity-70 truncate" style={{ color: textSecondary }}>
                          {formData.vehicle.vin || 'Fără VIN'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border" style={{ borderColor: borderLight, background: bg }}>
                        <div className="text-[9px] uppercase font-semibold" style={{ color: textSecondary }}>Vânzător</div>
                        <div className="font-bold truncate mt-0.5" style={{ color: textPrimary }}>
                          {formData.seller.fullName || 'Nume lipsă'}
                        </div>
                        <div className="font-mono text-[10px] opacity-70 truncate" style={{ color: textSecondary }}>
                          {formData.seller.cnp || 'Fără CNP'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border" style={{ borderColor: borderLight, background: bg }}>
                        <div className="text-[9px] uppercase font-semibold" style={{ color: textSecondary }}>Cumpărător</div>
                        <div className="font-bold truncate mt-0.5" style={{ color: textPrimary }}>
                          {formData.buyer.fullName || 'Nume lipsă'}
                        </div>
                        <div className="font-mono text-[10px] opacity-70 truncate" style={{ color: textSecondary }}>
                          {formData.buyer.cnp || 'Fără CNP'}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl border" style={{ borderColor: borderLight, background: bg }}>
                        <div className="text-[9px] uppercase font-semibold" style={{ color: textSecondary }}>Preț Oficial</div>
                        <div className="font-bold truncate mt-0.5" style={{ color: emerald }}>
                          {formData.commercial.priceRon ? `${formData.commercial.priceRon.toLocaleString('ro-RO')} RON` : '0 RON'}
                        </div>
                        <div className="text-[10px] opacity-70 truncate" style={{ color: textSecondary }}>
                          {priceEur ? `(${priceEur.toLocaleString('ro-RO')} €)` : formData.commercial.contractDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── STICKY FOOTER (Navigation & Action Bar) ───────────────────────── */}
          <div
            className="px-5 py-3.5 flex items-center justify-between gap-3 flex-shrink-0"
            style={{
              borderTop: `1px solid ${borderLight}`,
              background: isDark ? 'rgba(13, 17, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div>
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepsList[currentStepIndex - 1].id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: border, color: textPrimary }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Înapoi</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer opacity-70 hover:opacity-100"
                  style={{ color: textSecondary }}
                >
                  Anulează
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] hidden sm:inline mr-1" style={{ color: textSecondary }}>
                Pasul {currentStepIndex + 1} din {stepsList.length}
              </span>

              {currentStepIndex < stepsList.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepsList[currentStepIndex + 1].id)}
                  className="px-4 sm:px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                  style={{ background: accent, color: '#FFFFFF' }}
                >
                  <span className="hidden sm:inline">Continuă spre {stepsList[currentStepIndex + 1].shortLabel}</span>
                  <span className="sm:hidden">Continuă</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                  style={{
                    background: accent,
                    color: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(0, 88, 255, 0.35)',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generare dosar...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Descarcă 5x ITL 054 (PDF)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Low-Token AI Scanner Modal */}
      <AutoDoxScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        initialDocType={scannerDocType}
        onApplyData={handleApplyScanData}
      />
    </AnimatePresence>
  );
};
