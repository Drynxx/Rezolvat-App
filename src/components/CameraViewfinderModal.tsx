import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, Upload, RefreshCw, AlertCircle, FlipHorizontal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { preprocessDocumentImage, ProcessedImageResult } from '../lib/ocr/compression';
import { extractProcesVerbalFromImage } from '../lib/ocr/gemini-vision';
import { ProcesVerbalExtractedData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CameraViewfinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: ProcesVerbalExtractedData, stats: ProcessedImageResult) => void;
}

export const CameraViewfinderModal: React.FC<CameraViewfinderModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const { isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Cadrează Procesul-Verbal');

  // Start Camera on Open
  useEffect(() => {
    if (isOpen) {
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
        throw new Error('Camera access not supported on this browser');
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
    } catch (err: any) {
      console.warn('Camera error or permission denied:', err);
      setCameraError('Camera inaccesibilă sau permisiune refuzată. Puteți încărca o fotografie din fișiere.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const processAndExtract = async (source: Blob | File | HTMLImageElement | string) => {
    try {
      setIsProcessing(true);
      setStatusMessage('Optimizare Canvas WebP (1200px)...');

      // 1. Client-side Grayscale & WebP Compression
      const compressed = await preprocessDocumentImage(source, 1200, 0.75);

      setStatusMessage('Extragere date juridice cu Gemini 2.0 Flash...');
      // 2. Multimodal OCR Extraction
      const ocrResult = await extractProcesVerbalFromImage(compressed.base64, compressed.mimeType);

      stopCamera();
      onScanComplete(ocrResult.data, compressed);
    } catch (err: any) {
      console.error('Error during OCR processing:', err);
      alert(err?.message || 'A apărut o eroare la procesarea documentului. Încercați din nou.');
    } finally {
      setIsProcessing(false);
      setStatusMessage('Cadrează Procesul-Verbal');
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            {/* Header / Close */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-xs font-bold text-[#D1D5DB] uppercase tracking-widest">
                  Scanner AI Proces-Verbal
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </motion.button>
            </div>

            {/* Viewfinder Target Frame */}
            <div className="relative w-full aspect-[3/4] max-h-[380px] rounded-[24px] border-2 border-dashed border-[#38BDF8]/40 bg-[#0A0E17]/90 overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl">
              
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

              {/* Corner Indicators */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#38BDF8] rounded-tl-lg pointer-events-none z-10" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#38BDF8] rounded-tr-lg pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#38BDF8] rounded-bl-lg pointer-events-none z-10" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#38BDF8] rounded-br-lg pointer-events-none z-10" />

              {/* Animated Laser Scanning Line */}
              <motion.div
                animate={{
                  y: [-120, 120, -120],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_12px_#38BDF8] z-10"
              />

              {/* Viewfinder Placeholder when Camera is inactive / loading */}
              {(!cameraActive || isProcessing) && (
                <div className="relative z-10 p-6 flex flex-col items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm m-4">
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-10 h-10 text-[#38BDF8] animate-spin mb-3" />
                      <h4 className="font-bold text-sm text-white">{statusMessage}</h4>
                      <p className="text-[11px] text-[#A0A0A0] mt-1">Se extrag automat seria, amenda și punctele...</p>
                    </>
                  ) : cameraError ? (
                    <>
                      <AlertCircle className="w-8 h-8 text-[#FBBF24] mb-2" />
                      <p className="text-xs text-[#D1D5DB] leading-relaxed">{cameraError}</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-[#38BDF8] mb-3 animate-pulse stroke-[1.5]" />
                      <h4 className="font-bold text-sm text-white">Se pornește camera...</h4>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 mt-4">
              
              {/* Shutter Capture Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing}
                onClick={handleCaptureFrame}
                className="w-full py-3.5 px-4 rounded-full bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold text-sm tracking-tight flex items-center justify-center gap-2 royal-glow transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>{isProcessing ? 'Se analizează...' : 'Fotografiază & Analizează cu AI'}</span>
              </motion.button>

              {/* File Upload Fallback */}
              <label className="w-full py-3 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10">
                <Upload className="w-4 h-4 text-[#38BDF8]" />
                <span>Încarcă din Galerie / Fișiere</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </label>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
