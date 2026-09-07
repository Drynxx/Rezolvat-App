import React from 'react';
import { ScanLine, Upload, RefreshCw, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ActionDockProps {
  onScanClick: () => void;
  onUploadClick: (file: File) => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  courtName: string;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  onScanClick,
  onUploadClick,
  onDownloadPdf,
  isGeneratingPdf,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col gap-4 mt-2 w-full">
      
      {/* Central Primary Scan Button */}
      <button
        onClick={onScanClick}
        className={`w-full bg-[#0058FF] hover:bg-[#0047D4] text-white text-base font-bold rounded-full h-14 flex items-center justify-center gap-2.5 cursor-pointer shadow-sm btn-press ${
          isDark ? 'btn-primary-action' : ''
        }`}
      >
        <ScanLine className="w-5 h-5 text-white stroke-[2]" />
        <span>Scanează Proces-Verbal cu AI</span>
      </button>

      {/* Secondary Buttons */}
      <div className="flex gap-4">
        <label className={`flex-1 text-sm font-semibold rounded-full h-12 flex items-center justify-center gap-2 cursor-pointer btn-press ${
          isDark
            ? 'bg-[#1C1F2B] hover:bg-[#242838] border border-white/[0.1] hover:border-[#38BDF8]/40 text-[#D1D5DB] shadow-inner'
            : 'bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] shadow-sm'
        }`}>
          <Upload className={`w-4 h-4 stroke-[2] ${isDark ? 'text-[#38BDF8]' : 'text-[#9CA3AF]'}`} />
          <span>Încarcă PDF</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUploadClick(e.target.files[0]);
              }
            }}
          />
        </label>

        <button
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className={`flex-1 text-sm font-semibold rounded-full h-12 flex items-center justify-center gap-2 cursor-pointer btn-press ${
            isDark
              ? 'bg-[#1C1F2B] hover:bg-[#242838] border border-white/[0.1] hover:border-[#38BDF8]/40 text-[#D1D5DB] shadow-inner'
              : 'bg-[#0058FF]/10 hover:bg-[#0058FF]/15 text-[#0058FF]'
          }`}
        >
          {isGeneratingPdf ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0058FF]" />
              <span>Se redactează...</span>
            </>
          ) : (
            <>
              <Zap className={`w-4 h-4 stroke-[2] ${isDark ? 'text-[#38BDF8]' : 'text-[#0058FF]'}`} />
              <span>Taxă 20 lei & Plătește</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
