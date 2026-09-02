import React from 'react';
import { X, ShieldCheck, FileCheck, Lock, AlertTriangle } from 'lucide-react';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="depth-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0058FF]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Cadrul Legal & Conformitate Statutară</h2>
              <p className="text-xs text-[#A0A0A0]">Reglementat conform legislației din România și UE</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Legal Text Sections */}
        <div className="flex flex-col gap-4 text-xs md:text-sm text-[#A0A0A0]">
          
          <div className="p-4 bg-[#F59E0B]/10 rounded-[14px] border border-[#F59E0B]/20">
            <div className="flex gap-2 items-center mb-1.5 text-[#FBBF24] font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" />
              <span>Declinare a Răspunderii (Protecție Legea nr. 51/1995)</span>
            </div>
            <p className="leading-relaxed text-xs text-[#D1D5DB]">
              <strong>BirocrațieZero</strong> este o platformă tehnologică independentă operată sub codurile CAEN <strong>6201</strong> (Activități de realizare a software-ului) și <strong>6311</strong> (Prelucrarea datelor și administrarea paginilor web). Platforma nu constituie o societate de avocați, nu acordă consultanță juridică personalizată și nu înlocuiește serviciile unui avocat autorizat conform Legii nr. 51/1995.
            </p>
          </div>

          <div className="p-4 bg-[#131620] rounded-[14px] border border-white/[0.04]">
            <h4 className="text-white font-semibold mb-1 flex items-center gap-2 text-xs md:text-sm">
              <FileCheck className="w-4 h-4 text-[#34D399]" />
              <span>Natura Documentelor Generate</span>
            </h4>
            <p className="leading-relaxed text-xs">
              Toate plângerile contravenționale, contractele auto Model ITL 054 și sesizările ANPC sunt generate automat pe baza șabloanelor oficiale publice și a normelor legislative în vigoare (O.G. nr. 2/2001, O.U.G. nr. 195/2002, Codul de Procedură Civilă). Utilizatorul își asumă verificarea datelor înainte de semnare și depunere.
            </p>
          </div>

          <div className="p-4 bg-[#131620] rounded-[14px] border border-white/[0.04]">
            <h4 className="text-white font-semibold mb-1 flex items-center gap-2 text-xs md:text-sm">
              <Lock className="w-4 h-4 text-[#38BDF8]" />
              <span>Politica de Confidențialitate & GDPR (Auto-Purge 24h)</span>
            </h4>
            <p className="leading-relaxed text-xs">
              Imaginile proceselor-verbale și ale actelor de identitate sunt prelucrate exclusiv în memorie (in-memory OCR) pentru extragerea datelor necesare completării documentului și sunt <strong>șterse automat în termen de 24 de ore</strong>. CNP-ul este stocat exclusiv sub formă de amprentă criptografică hash SHA-256 pentru prevenirea duplicatelor.
            </p>
          </div>

        </div>

        {/* Footer Button */}
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto bg-[#0058FF] hover:bg-[#0047D4] text-white font-bold py-3 px-6 rounded-full text-xs royal-glow transition-all cursor-pointer"
          >
            Am Înțeles și Sunt de Acord
          </button>
        </div>

      </div>
    </div>
  );
};
