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
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">Cadrul Legal & Conformitate Statutară</h2>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  REZOLVAT
                </span>
              </div>
              <p className="text-xs text-slate-400">Reglementat conform legislației din România și Uniunea Europeană</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Legal Text Sections */}
        <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-300">
          
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <div className="flex gap-2 items-center mb-1.5 text-amber-300 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4" />
              <span>Declinare a Răspunderii (Protecție Legea nr. 51/1995)</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-200">
              <strong>Rezolvat</strong> este o platformă tehnologică independentă dedicată automatizării documentelor administrative românești. Platforma nu constituie o societate de avocați, nu acordă consultanță juridică personalizată și nu înlocuiește asistența unui avocat autorizat conform Legii nr. 51/1995.
            </p>
          </div>

          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
            <h4 className="text-white font-semibold mb-1 flex items-center gap-2 text-xs md:text-sm">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Natura Documentelor Generate</span>
            </h4>
            <p className="leading-relaxed text-xs text-slate-400">
              Toate plângerile contravenționale, dosarele auto Model 2026 ITL 054 și sesizările ANPC sunt generate automat pe baza șabloanelor oficiale publice și a normelor legislative în vigoare (O.G. nr. 2/2001, O.U.G. nr. 195/2002, Codul de Procedură Civilă). Utilizatorul își asumă verificarea datelor înainte de semnare și depunere.
            </p>
          </div>

          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
            <h4 className="text-white font-semibold mb-1 flex items-center gap-2 text-xs md:text-sm">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Confidențialitate & Securitate GDPR</span>
            </h4>
            <p className="leading-relaxed text-xs text-slate-400">
              Imaginile procesate prin sistemul de scanare OCR sunt comprimate direct în browserul dumneavoastră și transmise exclusiv în tunel criptat TLS 1.3 pentru extragerea datelor. Datele personale nu sunt comercializate către terți.
            </p>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full btn-primary-action py-3.5 px-6 rounded-2xl text-center font-bold text-sm cursor-pointer"
        >
          Am Înțeles și Sunt de Acord
        </button>

      </div>
    </div>
  );
};
