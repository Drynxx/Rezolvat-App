import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Car, User, FileText, Download, RefreshCw, Sparkles, Building, Camera, Zap, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateItl054BundlePdf, ITL054DataPayload, numberToRomanianWords } from '../../lib/pdf/itl054-generator';
import { AutoDoxScannerModal } from './AutoDoxScannerModal';
import { AutoDoxDocType, AutoDoxScanResult } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AutoDoxEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoDoxEditorModal: React.FC<AutoDoxEditorModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerDocType, setScannerDocType] = useState<AutoDoxDocType>('seller_ci');
  const [scannedBadges, setScannedBadges] = useState<{ seller?: boolean; buyer?: boolean; vehicle?: boolean }>({});
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ITL054DataPayload>({
    sellerFiscalOrg: {
      name: 'DITL Sector 1 București',
      cifSiruta: 'RO419204',
      address: 'Str. Piața Amzei nr. 13, Sector 1, București',
      contact: '021-319.10.13 / contact@ditl1.ro',
      remtiiNumber: '10492',
      rolNumber: '4491024',
    },
    seller: {
      fullName: 'Popescu Mihai Alexandru',
      country: 'ROMÂNIA',
      county: 'București',
      postalCode: '010214',
      city: 'Sector 1',
      street: 'Str. Dorobanți',
      number: '34',
      block: 'A2',
      apartment: '14',
      ciSeries: 'DP',
      ciNumber: '491028',
      cnp: '1850412410029',
      phone: '0722123456',
      email: 'mihai.popescu@gmail.com',
    },
    buyer: {
      fullName: 'Ionescu Elena Andreea',
      country: 'ROMÂNIA',
      county: 'Cluj',
      postalCode: '400120',
      city: 'Cluj-Napoca',
      street: 'Calea Florești',
      number: '78',
      block: 'B4',
      apartment: '22',
      ciSeries: 'KX',
      ciNumber: '912048',
      cnp: '2920815125890',
      phone: '0744987654',
      email: 'elena.ionescu@yahoo.com',
    },
    buyerFiscalOrg: {
      name: 'DITL Primăria Cluj-Napoca',
      cifSiruta: 'RO55102',
      address: 'Str. Moților nr. 7, Cluj-Napoca',
      contact: '0264-596030 / taxe@primariaclujnapoca.ro',
      remtiiNumber: '88210',
      rolNumber: '192044',
    },
    vehicle: {
      make: 'VOLKSWAGEN',
      type: 'Autoturism M1 (Golf VII)',
      vin: 'WVWZZZAUZHP104928',
      engineSerial: 'CRBC129481',
      displacementCm3: 1968,
      maxMassTons: 1.85,
      plateNumber: 'B 104 BZX',
      itpExpiryDate: '2027-04-15',
      civSeries: 'K910284',
      firstRegYear: 2020,
      euroNorm: 'Euro 6',
      acquiredDate: '2020-03-10',
      acquisitionAct: 'Factura nr. 4410/2020',
    },
    commercial: {
      priceRon: 65000,
      priceRonWords: 'șaizeci și cinci de mii lei',
      hasAnnexes: false,
      contractDate: new Date().toISOString().split('T')[0],
      contractPlace: 'București',
    },
  });

  if (!isOpen) return null;

  const handlePriceChange = (val: number) => {
    const words = numberToRomanianWords(val) + ' lei';
    setFormData(prev => ({
      ...prev,
      commercial: {
        ...prev.commercial,
        priceRon: val,
        priceRonWords: words,
      }
    }));
  };

  const handleApplyScanData = (result: AutoDoxScanResult) => {
    if (result.ciData) {
      const ci = result.ciData;
      if (result.docType === 'seller_ci' || (!scannedBadges.seller && result.docType === 'auto_detect')) {
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
        setScanStatusMessage(`Vânzător extras prin Gemini Flash (${result.processingTimeMs}ms • ~${result.tokensUsedEstimate} tk)`);
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
        setScanStatusMessage(`Cumpărător extras prin Gemini Flash (${result.processingTimeMs}ms • ~${result.tokensUsedEstimate} tk)`);
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
      setScanStatusMessage(`Date vehicul extrase prin Gemini Flash (${result.processingTimeMs}ms • ~${result.tokensUsedEstimate} tk)`);
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
      link.download = `Model_2026_ITL_054_Contract_Auto_${formData.vehicle.vin}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      confetti({ particleCount: 70, spread: 60 });
      onClose();
    } catch (err) {
      console.error('Error downloading Model 2026 ITL 054:', err);
      alert('Eroare la generarea documentului PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="app-panel max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-[var(--panel-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>
                <Car className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
                    Model 2026 ITL 054 — Contract Auto (5x Exemplare)
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    isDark ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
                  }`}>
                    OFICIAL 2026
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Cartușe A, B, C, D DITL conforme cu Legea 207/2015 Codul de Procedură Fiscală
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

          {/* Form Content */}
          <div className="p-5 md:p-6 overflow-y-auto flex flex-col gap-6 text-xs">

            {/* AI Assistant Quick Scan Banner */}
            <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/30' : 'bg-blue-50/80 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-[#0058FF]/30 text-[#38BDF8]' : 'bg-[#0058FF]/15 text-[#0058FF]'
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[var(--text-main)] flex items-center gap-2">
                    <span>Auto-Completare Inteligentă cu Gemini Flash Vision</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#10B981]/20 text-[#34D399]">
                      Low-Token ~390 tk
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Scanează buletinele și talonul auto pentru completarea instantă a cartușelor A, B, C, D.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScannerDocType('auto_detect');
                  setIsScannerOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#0058FF] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm flex-shrink-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Deschide Scanner AI</span>
              </button>
            </div>

            {scanStatusMessage && (
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
                isDark ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#34D399]' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{scanStatusMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanStatusMessage(null)}
                  className="text-xs opacity-60 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {/* Section 1: Vânzător */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--panel-border)]">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                    (1) Persoana care înstrăinează (Vânzător)
                  </h3>
                  {scannedBadges.seller && (
                    <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                      ✓ Scanat AI
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScannerDocType('seller_ci');
                    setIsScannerOpen(true);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#0058FF]/30'
                      : 'bg-[#0058FF]/10 text-[#0058FF] hover:bg-[#0058FF]/15'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Scanează CI Vânzător</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Nume & Prenume</label>
                  <input
                    type="text"
                    value={formData.seller.fullName}
                    onChange={(e) => setFormData({ ...formData, seller: { ...formData.seller, fullName: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">CNP Vânzător</label>
                  <input
                    type="text"
                    value={formData.seller.cnp}
                    onChange={(e) => setFormData({ ...formData, seller: { ...formData.seller, cnp: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border font-mono text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">CI Seria & Număr</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Seria"
                      value={formData.seller.ciSeries}
                      onChange={(e) => setFormData({ ...formData, seller: { ...formData.seller, ciSeries: e.target.value.toUpperCase() } })}
                      className={`w-16 p-2.5 rounded-[8px] border text-xs uppercase outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Număr"
                      value={formData.seller.ciNumber}
                      onChange={(e) => setFormData({ ...formData, seller: { ...formData.seller, ciNumber: e.target.value } })}
                      className={`flex-1 p-2.5 rounded-[8px] border text-xs outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Județ & Localitate</label>
                    <input
                      type="text"
                      value={`${formData.seller.county}, ${formData.seller.city}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setFormData({ ...formData, seller: { ...formData.seller, county: parts[0]?.trim() || '', city: parts[1]?.trim() || '' } });
                      }}
                      className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Stradă & Număr / Bloc</label>
                    <input
                      type="text"
                      value={`${formData.seller.street}, nr. ${formData.seller.number}${formData.seller.block ? `, bl. ${formData.seller.block}` : ''}`}
                      onChange={(e) => setFormData({ ...formData, seller: { ...formData.seller, street: e.target.value } })}
                      className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Cumpărător */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--panel-border)]">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                    (2) Persoana care dobândește (Cumpărător)
                  </h3>
                  {scannedBadges.buyer && (
                    <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                      ✓ Scanat AI
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScannerDocType('buyer_ci');
                    setIsScannerOpen(true);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#0058FF]/30'
                      : 'bg-[#0058FF]/10 text-[#0058FF] hover:bg-[#0058FF]/15'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Scanează CI Cumpărător</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Nume & Prenume</label>
                  <input
                    type="text"
                    value={formData.buyer.fullName}
                    onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, fullName: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">CNP Cumpărător</label>
                  <input
                    type="text"
                    value={formData.buyer.cnp}
                    onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, cnp: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border font-mono text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">CI Seria & Număr</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Seria"
                      value={formData.buyer.ciSeries}
                      onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, ciSeries: e.target.value.toUpperCase() } })}
                      className={`w-16 p-2.5 rounded-[8px] border text-xs uppercase outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Număr"
                      value={formData.buyer.ciNumber}
                      onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, ciNumber: e.target.value } })}
                      className={`flex-1 p-2.5 rounded-[8px] border text-xs outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Județ & Localitate</label>
                    <input
                      type="text"
                      value={`${formData.buyer.county}, ${formData.buyer.city}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setFormData({ ...formData, buyer: { ...formData.buyer, county: parts[0]?.trim() || '', city: parts[1]?.trim() || '' } });
                      }}
                      className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Stradă & Număr / Bloc</label>
                    <input
                      type="text"
                      value={`${formData.buyer.street}, nr. ${formData.buyer.number}${formData.buyer.block ? `, bl. ${formData.buyer.block}` : ''}`}
                      onChange={(e) => setFormData({ ...formData, buyer: { ...formData.buyer, street: e.target.value } })}
                      className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                        isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Obiectul Contractului (Vehicul) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[var(--panel-border)]">
                <div className="flex items-center gap-2">
                  <Car className={`w-4 h-4 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />
                  <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                    (3) Obiectul Contractului (Datele Vehiculului din CIV / Talon)
                  </h3>
                  {scannedBadges.vehicle && (
                    <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                      ✓ Scanat AI
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScannerDocType('vehicle_talon');
                    setIsScannerOpen(true);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#0058FF]/30'
                      : 'bg-[#0058FF]/10 text-[#0058FF] hover:bg-[#0058FF]/15'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Scanează Talon Auto</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Număr de Identificare (VIN / Serie Șasiu)</label>
                  <input
                    type="text"
                    value={formData.vehicle.vin}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, vin: e.target.value.toUpperCase() } })}
                    className={`p-2.5 rounded-[8px] border font-mono font-bold text-xs uppercase outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-[#38BDF8]' : 'bg-white border-gray-200 text-[#0058FF]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Marca & Model</label>
                  <input
                    type="text"
                    value={`${formData.vehicle.make} ${formData.vehicle.type}`}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, make: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Serie Carte Identitate (CIV)</label>
                  <input
                    type="text"
                    value={formData.vehicle.civSeries}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, civSeries: e.target.value.toUpperCase() } })}
                    className={`p-2.5 rounded-[8px] border font-mono text-xs uppercase outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Capacitate Cilindrică</label>
                  <input
                    type="number"
                    value={formData.vehicle.displacementCm3 || ''}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, displacementCm3: Number(e.target.value) } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">An Fabricație</label>
                  <input
                    type="number"
                    value={formData.vehicle.firstRegYear || ''}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, firstRegYear: Number(e.target.value) } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Normă Poluare</label>
                  <input
                    type="text"
                    value={formData.vehicle.euroNorm || 'Euro 6'}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, euroNorm: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Nr. Înmatriculare</label>
                  <input
                    type="text"
                    value={formData.vehicle.plateNumber || ''}
                    onChange={(e) => setFormData({ ...formData, vehicle: { ...formData.vehicle, plateNumber: e.target.value.toUpperCase() } })}
                    className={`p-2.5 rounded-[8px] border text-xs uppercase outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Prețul & Locația */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-[var(--panel-border)]">
                <FileText className={`w-4 h-4 ${isDark ? "text-[#38BDF8]" : "text-[#0058FF]"}`} />
                <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                  (4) Prețul și Condițiile de Înstrăinare
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Preț în Cifre (LEI / RON)</label>
                  <input
                    type="number"
                    value={formData.commercial.priceRon}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className={`p-2.5 rounded-[8px] border font-bold text-sm outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Preț în Litere (Completat automat)</label>
                  <input
                    type="text"
                    value={formData.commercial.priceRonWords}
                    onChange={(e) => setFormData({ ...formData, commercial: { ...formData.commercial, priceRonWords: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-[#38BDF8]' : 'bg-white border-gray-200 text-[#0058FF]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Data Încheierii</label>
                  <input
                    type="date"
                    value={formData.commercial.contractDate}
                    onChange={(e) => setFormData({ ...formData, commercial: { ...formData.commercial, contractDate: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Locul Încheierii</label>
                  <input
                    type="text"
                    value={formData.commercial.contractPlace}
                    onChange={(e) => setFormData({ ...formData, commercial: { ...formData.commercial, contractPlace: e.target.value } })}
                    className={`p-2.5 rounded-[8px] border text-xs outline-none ${
                      isDark ? 'bg-[#131620] border-white/[0.08] text-white' : 'bg-white border-gray-200 text-[#111827]'
                    }`}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-5 md:p-6 border-t border-[var(--panel-border)] flex items-center justify-between gap-3 bg-[var(--panel-bg-nested)]">
            <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">
              Document gata de printat în 5 exemplare pentru DITL & DGPCI
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'text-[#A0A0A0] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Închide
              </button>
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className={`px-6 py-3 bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold rounded-full text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isDark ? 'btn-primary-action' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#38BDF8]" />
                    <span>Se generează PDF-ul...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Descarcă Model 2026 ITL 054 (5x Exemplare)</span>
                  </>
                )}
              </button>
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
