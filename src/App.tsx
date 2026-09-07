import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { TopBar } from './components/TopBar';
import { FloatingBottomDock } from './components/FloatingBottomDock';
import { CameraViewfinderModal } from './components/CameraViewfinderModal';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { AmendaGuardModule } from './components/AmendaGuard/AmendaGuardModule';
import { AutoDoxModule } from './components/AutoDox/AutoDoxModule';
import { AnpcModule } from './components/ANPC/AnpcModule';
import { GhiseuNavigatorModule } from './components/GhiseuNavigator/GhiseuNavigatorModule';
import { WorkInProgressModule } from './components/WorkInProgressModule';
import { AppTab, ProcesVerbalExtractedData } from './types';
import { ProcessedImageResult } from './lib/ocr/compression';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function MainAppContent() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<AppTab>('autodox');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [autoDoxScanTrigger, setAutoDoxScanTrigger] = useState<number>(0);
  const [scannedPayload, setScannedPayload] = useState<{
    data: ProcesVerbalExtractedData;
    stats: ProcessedImageResult;
  } | null>(null);

  const handleScanComplete = (data: ProcesVerbalExtractedData, stats: ProcessedImageResult) => {
    setScannedPayload({ data, stats });
    setIsScanModalOpen(false);
    setActiveTab('autodox');
  };

  const handleQuickScan = () => {
    setActiveTab('autodox');
    setAutoDoxScanTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans relative overflow-x-hidden flex flex-col selection:bg-[#0058FF] selection:text-white transition-colors duration-250">
      
      {/* Sonner Toaster for System-Wide Notifications */}
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
            borderRadius: '16px',
            fontSize: '13px',
          },
        }}
      />

      {/* Ambient Lighting & Atmospheric Depth Backlight */}
      {isDark ? (
        <>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-[#0058FF]/15 via-[#38BDF8]/6 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-0 right-0 w-[600px] h-[350px] bg-[#0058FF]/10 blur-3xl pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-b from-[#0058FF]/5 via-[#38BDF8]/2 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* 1. TopAppBar */}
      <TopBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)} 
        onQuickScan={handleQuickScan}
        unreadCount={1}
      />

      {/* 2. Main Content Container */}
      <main className="w-full flex-1 max-w-md md:max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-32 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="w-full"
          >
            {activeTab === 'autodox' && (
              <AutoDoxModule openEditorTrigger={autoDoxScanTrigger} />
            )}
            {(activeTab === 'amendaguard' || activeTab === 'anpc' || activeTab === 'ghiseu' || activeTab === 'pricing') && (
              <WorkInProgressModule
                activeTab={activeTab}
                onGoToAutoDox={() => setActiveTab('autodox')}
                onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating Bottom Navigation Bar (Mobile only) */}
      <FloatingBottomDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onQuickScan={handleQuickScan}
      />

      {/* 4. Fullscreen Camera Viewfinder Modal */}
      <CameraViewfinderModal 
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />

      {/* 5. Statutory Legal Disclaimer Modal */}
      <LegalDisclaimerModal 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />

    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}

export default App;
