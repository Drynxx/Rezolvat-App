import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  DownloadCloud,
  Send,
  Lock,
  FileBadge
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { CazierEligibilityModal } from './CazierEligibilityModal';
import confetti from 'canvas-confetti';

export const CazierGuide: React.FC = () => {
  const { isDark } = useTheme();
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: 'Conectare pe HUB MAI prin Ghișeul.ro',
      badge: 'Fără Deplasare Fizică',
      desc: 'Accesați platforma oficială hub.mai.gov.ro și alegeți „Autentificare cu Ghișeul.ro”. Sistemul vă validează identitatea instant în 60 de secunde prin cardul bancar românesc, fără a mai merge vreodată la secția de poliție pentru activarea contului.',
      actionNote: 'Dacă nu ai cont Ghișeul.ro, crearea unuia durează 2 minute cu datele cardului.',
      icon: Lock,
    },
    {
      num: 2,
      title: 'Accesare Serviciu „Cazier Judiciar”',
      badge: 'Meniu Online',
      desc: 'După logare pe portalul HUB MAI, selectați din meniul de servicii opțiunea „Eliberare Cazier Judiciar”. Sistemul recunoaște automat CNP-ul dumneavoastră și încarcă formularul securizat.',
      actionNote: 'Serviciul funcționează non-stop, 24/7.',
      icon: FileBadge,
    },
    {
      num: 3,
      title: 'Selectare Scop & Trimitere Cerere',
      badge: 'Timp: 30 secunde',
      desc: 'Bifați scopul pentru care solicitați cazierul: Angajare în muncă, Școală de șoferi / Permis, Admitere facultate / Concurs public sau Licitație. Cererea este trimisă automat către baza de date IGPR.',
      actionNote: 'Nu se percep taxe (este 100% GRATUIT conform Legii).',
      icon: Send,
    },
    {
      num: 4,
      title: 'Descărcare Imediată PDF Semnat Digital',
      badge: 'Valabil 6 Luni',
      desc: 'Documentul se generează instantaneu în format PDF, semnat cu sigiliu electronic calificat al Ministerului Afacerilor Interne. Descărcați fișierul pe telefon sau calculator.',
      actionNote: '100% valabil juridic la orice instituție publică sau companie privată din România.',
      icon: DownloadCloud,
    },
  ];

  const handleOpenHub = () => {
    confetti({ particleCount: 50, spread: 60 });
    window.open('https://hub.mai.gov.ro/', '_blank');
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Hero Service Card */}
      <div className="app-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {isDark && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0058FF]/10 rounded-bl-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col gap-2 max-w-xl z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              HUB MAI & GHIȘEUL.RO
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              0 LEI • 5 MINUTE DE PE CANAPEA
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
            Cazier Judiciar Online Fără Cozi la Secția de Poliție
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            Nu mai pierde timpul stând la cozi la ghișeele poliției pentru a completa formulare pe hârtie. Obține certificatul de cazier judiciar semnat electronic, 100% recunoscut legal, de acasă.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto z-10 flex-shrink-0">
          <button
            onClick={handleOpenHub}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 bg-[#0058FF] hover:bg-[#0047D4]"
          >
            <span>Deschide HUB MAI (hub.mai.gov.ro)</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEligibilityModalOpen(true)}
            className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all border cursor-pointer ${
              isDark 
                ? 'bg-[#131620] border-white/[0.1] text-white hover:border-[#38BDF8]/40' 
                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verifică Eligibilitatea Ta</span>
          </button>
        </div>
      </div>

      {/* 4-Step Interactive Timeline */}
      <div className="app-panel p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-inherit pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0058FF]" />
            Ghidul Tău Interactiv în 4 Pași Simpli
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min timp total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-5 rounded-[18px] border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isCurrent
                    ? isDark 
                      ? 'bg-[#0058FF]/15 border-[#38BDF8] shadow-sm' 
                      : 'bg-[#0058FF]/10 border-[#0058FF] shadow-sm'
                    : isDark
                      ? 'bg-[#131620] border-white/[0.05] hover:border-white/[0.15]'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#0058FF] text-white'
                        : isDark ? 'bg-white/[0.08] text-[var(--text-muted)]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {s.num}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {s.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-main)] leading-snug">
                    {s.title}
                  </h4>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className={`p-2.5 rounded-[10px] text-[11px] font-medium leading-tight ${
                  isDark ? 'bg-[#0A0E17] text-[#38BDF8]' : 'bg-white text-[#0058FF] border border-gray-100'
                }`}>
                  💡 {s.actionNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CRITICAL LEGAL WARNING & eIDAS ADVICE (Bento Box) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Nu printa cazierul pe hârtie */}
        <div className={`p-6 rounded-[20px] border flex flex-col gap-3 ${
          isDark ? 'bg-amber-500/10 border-amber-500/25 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-center gap-2.5 font-bold text-sm text-amber-500">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Regulă Critică: NU Printați Cazierul pe Hârtie!</span>
          </div>

          <p className="text-xs leading-relaxed font-normal opacity-90">
            Conform Regulamentului European eIDAS (nr. 910/2014) și Legii nr. 455/2001, certificatul de cazier judiciar emis online are forță probantă <strong>exclusiv în formatul său digital PDF nativ</strong>.
          </p>

          <p className="text-xs leading-relaxed font-normal opacity-90">
            Dacă îl printați la imprimantă, hârtia devine o simplă copie fără valoare juridică, deoarece semnătura electronică nu poate fi verificată pe hârtie. <strong>Trimiteți fișierul PDF original prin e-mail</strong> angajatorului, școlii sau instituției care îl solicită!
          </p>
        </div>

        {/* Box 2: Cum se verifică bifa verde */}
        <div className={`p-6 rounded-[20px] border flex flex-col gap-3 ${
          isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-white' : 'bg-sky-50 border-sky-200 text-sky-950'
        }`}>
          <div className="flex items-center gap-2.5 font-bold text-sm text-[#0058FF] dark:text-[#38BDF8]">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Verificare Semnătură în Adobe Acrobat Reader</span>
          </div>

          <p className="text-xs leading-relaxed text-[var(--text-muted)]">
            La deschiderea documentului în Adobe Acrobat Reader, va apărea o bară albastră în partea de sus cu textul: <em>„Signed and all signatures are valid”</em>.
          </p>

          <div className="flex flex-col gap-1 text-xs text-[var(--text-muted)] mt-1">
            <span>• <strong>Emitent:</strong> Ministerul Afacerilor Interne - Direcția Cazier Judiciar</span>
            <span>• <strong>Tip certificat:</strong> Sigiliu Electronic Calificat eIDAS</span>
            <span>• <strong>Valabilitate legală:</strong> 6 luni de la data emiterii</span>
          </div>
        </div>

      </div>

      {/* Modal for Eligibility Check */}
      <CazierEligibilityModal
        isOpen={isEligibilityModalOpen}
        onClose={() => setIsEligibilityModalOpen(false)}
        onStartHubMai={handleOpenHub}
      />

    </div>
  );
};
