import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, Upload, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Car, User, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { preprocessDocumentImage, ProcessedImageResult } from '../../lib/ocr/compression';
import { extractAutoDoxFromImage } from '../../lib/ocr/autodox-gemini-vision';
import { AutoDoxDocType, AutoDoxScanResult } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AutoDoxScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocType?: AutoDoxDocType;
  onApplyData: (result: AutoDoxScanResult) => void;
}

export const AutoDoxScannerModal: React.FC<AutoDoxScannerModalProps> = ({
  isOpen,
  onClose,
  initialDocType = 'seller_ci',
  onApplyData,
}) => {
  const { isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [selectedDocType, setSelectedDocType] = useState<AutoDoxDocType>(initialDocType);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Cadrează documentul');
  const [scanResult, setScanResult] = useState<AutoDoxScanResult | null>(null);
  const [imageStats, setImageStats] = useState<ProcessedImageResult | null>(null);

  useEffect(() => {
    if (initialDocType) {
      setSelectedDocType(initialDocType);
    }
  }, [initialDocType]);

  useEffect(() => {
    if (isOpen) {
      setScanResult(null);
      setImageStats(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera error or permission denied:', err);
      setCameraError('Camera inaccesibilă sau permisiune refuzată. Puteți încărca o fotografie din fișiere.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const processAndExtract = async (source: Blob | File | HTMLImageElement | string) => {
    try {
      setIsProcessing(true);
      setStatusMessage('Optimizare Canvas WebP (1024px Low-Token)...');

      // 1. Client-Side Image Preprocessing (1024px cap ensures single Gemini tile = 258 tokens)
      const compressed = await preprocessDocumentImage(source, 1024, 0.75);
      setImageStats(compressed);

      setStatusMessage('Extragere țintită cu Gemini 2.0 Flash (<400 tokens)...');

      // 2. Multimodal Low-Token Vision OCR
      const result = await extractAutoDoxFromImage(
        compressed.base64,
        selectedDocType,
        compressed.mimeType
      );

      setScanResult(result);
      stopCamera();

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore in test environments
      }
    } catch (err: any) {
      console.error('Error during AutoDox OCR processing:', err);
      alert('A apărut o eroare la procesarea fotografiei. Vă rugăm reîncercați.');
    } finally {
      setIsProcessing(false);
      setStatusMessage('Cadrează documentul');
    }
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current || isProcessing) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        processAndExtract(blob);
      }
    }, 'image/jpeg', 0.85);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndExtract(e.target.files[0]);
    }
  };

  const handleApply = () => {
    if (scanResult) {
      onApplyData(scanResult);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="app-panel max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[var(--panel-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark
                    ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30'
                    : 'bg-[#0058FF]/10 text-[#0058FF]'
                }`}
              >
                <Camera className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    Scanner AI Documente Auto
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
                      isDark
                        ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    Low-Token ~390 tk
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Gemini 2.0 Flash Vision • Cartușe A, B, C, D Model 2026 ITL 054
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.06]'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Doc Type Selector Tabs */}
          {!scanResult && (
            <div className="p-3 border-b border-[var(--panel-border)] bg-black/10">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-2 px-1">
                Alege tipul documentului scanat:
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocType('seller_ci')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedDocType === 'seller_ci'
                      ? isDark
                        ? 'bg-[#0058FF]/25 border-[#38BDF8] text-[#38BDF8]'
                        : 'bg-[#0058FF]/10 border-[#0058FF] text-[#0058FF]'
                      : isDark
                      ? 'bg-[#131620] border-white/[0.06] text-[var(--text-muted)] hover:text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">CI Vânzător</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocType('buyer_ci')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedDocType === 'buyer_ci'
                      ? isDark
                        ? 'bg-[#0058FF]/25 border-[#38BDF8] text-[#38BDF8]'
                        : 'bg-[#0058FF]/10 border-[#0058FF] text-[#0058FF]'
                      : isDark
                      ? 'bg-[#131620] border-white/[0.06] text-[var(--text-muted)] hover:text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">CI Cumpărător</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocType('vehicle_talon')}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedDocType === 'vehicle_talon'
                      ? isDark
                        ? 'bg-[#0058FF]/25 border-[#38BDF8] text-[#38BDF8]'
                        : 'bg-[#0058FF]/10 border-[#0058FF] text-[#0058FF]'
                      : isDark
                      ? 'bg-[#131620] border-white/[0.06] text-[var(--text-muted)] hover:text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Talon / CIV</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Body: Camera Viewfinder or Extracted Result Review */}
          <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
            {!scanResult ? (
              <div className="flex flex-col items-center gap-4">
                {/* Viewfinder Frame */}
                <div className="relative w-full aspect-[4/3] max-h-[290px] rounded-[20px] border-2 border-dashed border-[#38BDF8]/40 bg-[#0A0E17]/95 overflow-hidden flex flex-col items-center justify-center text-center shadow-inner">
                  {/* Live Video Feed */}
                  {cameraActive && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Corner Targets */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#38BDF8] rounded-tl-lg pointer-events-none z-10" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#38BDF8] rounded-tr-lg pointer-events-none z-10" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#38BDF8] rounded-bl-lg pointer-events-none z-10" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#38BDF8] rounded-br-lg pointer-events-none z-10" />

                  {/* Scanning Laser Line */}
                  <motion.div
                    animate={{
                      y: [-90, 90, -90],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_12px_#38BDF8] z-10"
                  />

                  {/* Overlay for inactive or processing state */}
                  {(!cameraActive || isProcessing) && (
                    <div className="relative z-10 p-5 flex flex-col items-center justify-center bg-black/70 rounded-2xl backdrop-blur-sm m-4">
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-9 h-9 text-[#38BDF8] animate-spin mb-2.5" />
                          <h4 className="font-bold text-sm text-white">{statusMessage}</h4>
                          <p className="text-[11px] text-[#94A3B8] mt-1">
                            Compresie Canvas WebP + prompt structurat low-token
                          </p>
                        </>
                      ) : cameraError ? (
                        <>
                          <AlertCircle className="w-8 h-8 text-[#FBBF24] mb-2" />
                          <p className="text-xs text-[#D1D5DB] leading-relaxed">{cameraError}</p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-[#38BDF8] mb-2 animate-pulse" />
                          <h4 className="font-bold text-xs text-white">Pornire cameră foto...</h4>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Shutter and File Upload Controls */}
                <div className="w-full flex flex-col sm:flex-row gap-2.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCaptureFrame}
                    disabled={isProcessing || !cameraActive}
                    className="flex-1 bg-[#0058FF] hover:bg-[#0047D4] disabled:opacity-50 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Fă Fotografie (Shutter)</span>
                  </motion.button>

                  <label className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer text-xs font-semibold ${
                    isDark ? 'bg-[#131620] border-white/[0.08] text-white hover:bg-white/[0.04]' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                  }`}>
                    <Upload className="w-4 h-4 text-[#38BDF8]" />
                    <span>Încarcă Poză din Fișiere</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              /* Review & Confirmation of Extracted Document Data */
              <div className="flex flex-col gap-4">
                {/* Status and Token Efficiency Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    isDark
                      ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#34D399]'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-xs">Date Extrase cu Succes prin Gemini Flash</div>
                      <div className="text-[11px] opacity-80">
                        {scanResult.processingTimeMs}ms • Consum estimat: ~{scanResult.tokensUsedEstimate} tokens (Economie ~75%)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded-md">
                    {scanResult.confidenceScore}% Acuratețe
                  </span>
                </div>

                {/* Display Scanned Identity Card Info */}
                {scanResult.ciData && (
                  <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                    isDark ? 'bg-[#131620] border-white/[0.08]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                      <div className="flex items-center gap-2 font-bold text-xs text-[var(--text-main)]">
                        <User className="w-4 h-4 text-[#38BDF8]" />
                        <span>
                          {scanResult.docType === 'buyer_ci' ? 'Date Cumpărător (CI)' : 'Date Vânzător (CI)'}
                        </span>
                      </div>
                      {scanResult.ciData.isCnpValid && (
                        <span className="text-[10px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                          ✓ CNP Validat Matematic
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Nume Complet</div>
                        <div className="font-bold text-[var(--text-main)] mt-0.5">{scanResult.ciData.fullName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">CNP</div>
                        <div className="font-mono font-bold text-[var(--text-main)] mt-0.5">{scanResult.ciData.cnp}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">CI Serie & Număr</div>
                        <div className="font-semibold text-[var(--text-main)] mt-0.5">
                          {scanResult.ciData.ciSeries} {scanResult.ciData.ciNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Județ & Oraș</div>
                        <div className="font-semibold text-[var(--text-main)] mt-0.5">
                          {scanResult.ciData.county}, {scanResult.ciData.city}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Adresă Domiciliu</div>
                        <div className="font-medium text-[var(--text-main)] mt-0.5">
                          {scanResult.ciData.street} nr. {scanResult.ciData.number}
                          {scanResult.ciData.block ? `, Bl. ${scanResult.ciData.block}` : ''}
                          {scanResult.ciData.apartment ? `, Ap. ${scanResult.ciData.apartment}` : ''}
                        </div>
                      </div>
                    </div>

                    {scanResult.detectedOffice && (
                      <div className={`mt-1 p-2.5 rounded-lg border text-[11px] ${
                        isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}>
                        <strong>DITL Competent Identificat:</strong> {scanResult.detectedOffice.name} ({scanResult.detectedOffice.cifSiruta})
                      </div>
                    )}
                  </div>
                )}

                {/* Display Scanned Vehicle Info */}
                {scanResult.vehicleData && (
                  <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                    isDark ? 'bg-[#131620] border-white/[0.08]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
                      <div className="flex items-center gap-2 font-bold text-xs text-[var(--text-main)]">
                        <Car className="w-4 h-4 text-[#38BDF8]" />
                        <span>Date Vehicul (Talon / CIV)</span>
                      </div>
                      {scanResult.vehicleData.isVinValid && (
                        <span className="text-[10px] font-bold text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded-full">
                          ✓ Serie Șasiu (17 Caractere Valid)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Marcă & Tip</div>
                        <div className="font-bold text-[var(--text-main)] mt-0.5">
                          {scanResult.vehicleData.make} {scanResult.vehicleData.type}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Serie Șasiu / VIN</div>
                        <div className="font-mono font-bold text-[var(--text-main)] mt-0.5">
                          {scanResult.vehicleData.vin}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Număr Înmatriculare</div>
                        <div className="font-semibold text-[var(--text-main)] mt-0.5">
                          {scanResult.vehicleData.plateNumber || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Serie CIV</div>
                        <div className="font-semibold text-[var(--text-main)] mt-0.5">
                          {scanResult.vehicleData.civSeries || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Capacitate & Masă</div>
                        <div className="font-semibold text-[var(--text-main)] mt-0.5">
                          {scanResult.vehicleData.displacementCm3 || 0} cm³ • {scanResult.vehicleData.maxMassTons || 0} t
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">An & Normă Euro</div>
                        <div className="font-semibold text-[var(--text-main)] mt-0.5">
                          {scanResult.vehicleData.firstRegYear || '-'} • {scanResult.vehicleData.euroNorm || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm & Transfer to Contract Action */}
                <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex-1 bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aplică Datele în Model 2026 ITL 054</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScanResult(null);
                      startCamera();
                    }}
                    className={`py-3.5 px-4 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                      isDark
                        ? 'bg-[#131620] border-white/[0.08] text-[var(--text-muted)] hover:text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Scanează Alt Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
