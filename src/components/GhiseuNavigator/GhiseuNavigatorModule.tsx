import React from 'react';
import { FileText, BadgeCheck, Calendar, Clock, ArrowRight, Info, Building, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

export const GhiseuNavigatorModule: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Header Section */}
      <section className="flex flex-col gap-1.5 mt-2">
        <h1 className="text-[28px] md:text-[32px] leading-tight font-bold text-[var(--text-main)] tracking-tight">
          GhiseuNavigator
        </h1>
        <p className="text-[15px] md:text-[16px] text-[var(--text-muted)] font-medium max-w-2xl leading-relaxed">
          Proceduri oficiale explicate pe pași. Navigați prin birocrație cu ușurință și claritate.
        </p>
      </section>

      {/* Bento Grid Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Service Card 1: Cazier Judiciar Online (Featured Stepper Card) */}
        <article className={`app-panel p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden group transition-all ${
          isDark ? 'hover:border-[#38BDF8]/40' : 'hover:border-[#0058FF]/30'
        }`}>
          {isDark && (
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#0058FF]/10 rounded-bl-full blur-2xl pointer-events-none" />
          )}
          
          <header className="flex justify-between items-start z-10">
            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-sm ${
              isDark ? 'bg-[#0058FF]/20 border border-[#38BDF8]/30 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              <FileText className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="flex gap-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>
                Gratuit
              </span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                isDark ? 'bg-[#131620] text-[#A0A0A0] border border-white/[0.06]' : 'bg-gray-100 text-[#6B7280]'
              }`}>
                <Clock className="w-3.5 h-3.5" /> 5 min
              </span>
            </div>
          </header>

          <div className="z-10 flex flex-col gap-1.5">
            <h2 className="text-xl font-bold text-[var(--text-main)]">
              Cazier Judiciar Online
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Obțineți certificatul de cazier judiciar direct pe email, fără a vă deplasa la ghișeu.
            </p>
          </div>

          <div className="mt-auto pt-2 z-10 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
              Pași Necesari
            </h3>
            <ul className={`flex flex-col gap-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] ${
              isDark ? 'before:bg-white/[0.08]' : 'before:bg-gray-200'
            }`}>
              <li className="flex items-center gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${
                  isDark 
                    ? 'bg-[#0058FF] border border-[#38BDF8]/40 shadow-[0_0_8px_rgba(0,88,255,0.5)]' 
                    : 'bg-[#0058FF]'
                }`}>
                  1
                </div>
                <span className="text-xs font-semibold text-[var(--text-main)]">Autentificare HUB MAI / Ghișeul.ro</span>
              </li>
              <li className="flex items-center gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDark ? 'bg-[#131620] border border-white/[0.08] text-[#A0A0A0]' : 'bg-gray-100 text-[#6B7280]'
                }`}>
                  2
                </div>
                <span className="text-xs text-[var(--text-muted)]">Selectare scop eliberare</span>
              </li>
              <li className="flex items-center gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDark ? 'bg-[#131620] border border-white/[0.08] text-[#A0A0A0]' : 'bg-gray-100 text-[#6B7280]'
                }`}>
                  3
                </div>
                <span className="text-xs text-[var(--text-muted)]">Descărcare PDF semnat digital</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              confetti({ particleCount: 50, spread: 60 });
              window.open('https://hub.mai.gov.ro/', '_blank');
            }}
            className={`mt-3 w-full h-14 bg-[#0058FF] hover:bg-[#0047D4] text-white rounded-full text-sm font-bold transition-all z-10 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              isDark ? 'btn-primary-action' : ''
            }`}
          >
            <span>Începe Procedura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </article>

        {/* Service Card 2: Schimbare Buletin Expirat */}
        <article className={`app-panel p-6 md:p-8 flex flex-col gap-5 justify-between transition-all ${
          isDark ? 'hover:border-[#38BDF8]/40' : 'hover:border-[#0058FF]/30'
        }`}>
          <div>
            <header className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-sm ${
                isDark ? 'bg-[#131620] border border-white/[0.06] text-[#A0A0A0]' : 'bg-gray-100 text-[#4B5563]'
              }`}>
                <BadgeCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                  isDark ? 'bg-[#131620] text-white border border-white/[0.08]' : 'bg-gray-100 text-[#111827]'
                }`}>
                  7 RON
                </span>
                <span className={`px-3.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                  isDark ? 'bg-[#131620] text-[#A0A0A0] border border-white/[0.06]' : 'bg-gray-100 text-[#6B7280]'
                }`}>
                  <Calendar className="w-3.5 h-3.5" /> 15 zile
                </span>
              </div>
            </header>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-[var(--text-main)]">
                Schimbare Buletin Expirat
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Informații complete despre documentele necesare, taxele aferente și programarea online pentru reînnoirea cărții de identitate expirate sau pierdute.
              </p>
            </div>

            <div className={`mt-5 p-4 rounded-[14px] border flex flex-col gap-1.5 text-xs ${
              isDark 
                ? 'bg-[#131620] border-white/[0.04] text-[#A0A0A0]' 
                : 'bg-[#F9FAFB] border-gray-100 text-[#6B7280]'
            }`}>
              <span className="font-semibold text-[var(--text-main)]">Acte cheie necesare:</span>
              <span>• Act de identitate vechi (original)</span>
              <span>• Certificat de naștere / căsătorie</span>
              <span>• Dovadă spațiu locativ (proprietar/chiriaș)</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => alert('Ghidul detaliat pentru schimbarea buletinului a fost descărcat!')}
              className={`w-full h-12 rounded-full text-sm font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'border border-white/[0.1] hover:border-[#38BDF8]/40 bg-[#131620] hover:bg-[#181C28] text-[#38BDF8] shadow-inner'
                  : 'border border-[#E5E7EB] text-[#0058FF] hover:bg-[#0058FF]/5'
              }`}
            >
              <span>Vezi Detalii & Cerere Tip</span>
            </button>
          </div>
        </article>

        {/* Service Card 3: Programare Pașaport Online */}
        <article className={`app-panel p-6 md:p-8 flex flex-col gap-5 justify-between transition-all ${
          isDark ? 'hover:border-[#38BDF8]/40' : 'hover:border-[#0058FF]/30'
        }`}>
          <div>
            <header className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shadow-sm ${
                isDark ? 'bg-[#0058FF]/20 border border-[#38BDF8]/30 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
              }`}>
                <Building className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className={`px-3.5 py-1 rounded-full text-xs font-semibold ${
                  isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
                }`}>
                  258 RON
                </span>
                <span className={`px-3.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                  isDark ? 'bg-[#131620] text-[#A0A0A0] border border-white/[0.06]' : 'bg-gray-100 text-[#6B7280]'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> 10 min
                </span>
              </div>
            </header>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-[var(--text-main)]">
                Programare Pașaport Online
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Rezervare interval orar fără timp de așteptare la ghișeele de pașapoarte din toată țara și achitare taxă consulară electronic pe Ghișeul.ro.
              </p>
            </div>

            <div className={`mt-5 p-4 rounded-[14px] border flex flex-col gap-1.5 text-xs ${
              isDark 
                ? 'bg-[#131620] border-white/[0.04] text-[#A0A0A0]' 
                : 'bg-[#F9FAFB] border-gray-100 text-[#6B7280]'
            }`}>
              <span className="font-semibold text-[var(--text-main)]">Valabilitate:</span>
              <span>• 10 ani pentru persoane peste 18 ani</span>
              <span>• Taxă: 258 RON (electronic pe Ghișeul.ro)</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => window.open('https://hub.mai.gov.ro/epasapoarte', '_blank')}
              className={`w-full h-12 rounded-full text-sm font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'border border-white/[0.1] hover:border-[#38BDF8]/40 bg-[#131620] hover:bg-[#181C28] text-[#38BDF8] shadow-inner'
                  : 'border border-[#E5E7EB] text-[#0058FF] hover:bg-[#0058FF]/5'
              }`}
            >
              <span>Programare pe HUB MAI</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </article>

        {/* Contextual Card / Info Actualizate */}
        <article className={`app-panel p-6 md:p-8 flex items-center gap-5 md:col-span-2 lg:col-span-3`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-[#0058FF]/20 border border-[#38BDF8]/30 text-[#38BDF8]' : 'bg-[#0058FF]/10 text-[#0058FF]'
          }`}>
            <Info className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-[var(--text-main)]">
              Informații și Formulare Actualizate
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
              Toate ghidurile noastre sunt revizuite conform legislației în vigoare la nivelul anului curent, pentru a asigura corectitudinea demersurilor dumneavoastră la ghișeele administrației publice.
            </p>
          </div>
        </article>

      </div>
    </div>
  );
};
