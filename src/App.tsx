import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { FloatingBottomDock } from './components/FloatingBottomDock';
import { CameraViewfinderModal } from './components/CameraViewfinderModal';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { AmendaGuardModule } from './components/AmendaGuard/AmendaGuardModule';
import { AutoDoxModule } from './components/AutoDox/AutoDoxModule';
import { AnpcModule } from './components/ANPC/AnpcModule';
import { GhiseuNavigatorModule } from './components/GhiseuNavigator/GhiseuNavigatorModule';
import { AppTab, ProcesVerbalExtractedData } from './types';
import { ProcessedImageResult } from './lib/ocr/compression';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function MainAppContent() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<AppTab>('amendaguard');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [scannedPayload, setScannedPayload] = useState<{
    data: ProcesVerbalExtractedData;
    stats: ProcessedImageResult;
  } | null>(null);

  const handleScanComplete = (data: ProcesVerbalExtractedData, stats: ProcessedImageResult) => {
    setScannedPayload({ data, stats });
    setIsScanModalOpen(false);
    setActiveTab('amendaguard');
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans relative overflow-x-hidden flex flex-col selection:bg-[#0058FF] selection:text-white transition-colors duration-250">
      
      {/* Ambient Lighting & Atmospheric Depth Backlight (Dark Mode only) */}
      {isDark && (
        <>
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#0058FF]/12 via-[#38BDF8]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[300px] bg-[#0058FF]/8 blur-3xl pointer-events-none -z-10" />
        </>
      )}

      {/* 1. TopAppBar */}
      <TopBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)} 
        onQuickScan={() => setIsScanModalOpen(true)}
        unreadCount={1}
      />

      {/* 2. Main Content Container (Mobile max-w-md / Desktop max-w-6xl) */}
      <main className="w-full flex-1 max-w-md md:max-w-6xl mx-auto px-4 md:px-8 pt-4 pb-32 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {activeTab === 'amendaguard' && (
              <AmendaGuardModule 
                onOpenScanModal={() => setIsScanModalOpen(true)} 
                scannedData={scannedPayload}
              />
            )}
            {activeTab === 'autodox' && <AutoDoxModule />}
            {activeTab === 'anpc' && <AnpcModule />}
            {activeTab === 'ghiseu' && <GhiseuNavigatorModule />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating Bottom Navigation Bar (Mobile only) */}
      <FloatingBottomDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onQuickScan={() => setIsScanModalOpen(true)}
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
