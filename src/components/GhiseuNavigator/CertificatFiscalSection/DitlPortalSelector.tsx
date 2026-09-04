import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  Search, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  FileDown,
  Info
} from 'lucide-react';
import { DITL_PORTALS } from '../../../lib/data/ghiseu-directory';
import { DitlPortalInfo } from '../../../types/ghiseu';
import { DebitsWarningBanner } from './DebitsWarningBanner';
import { FiscalFormModal } from './FiscalFormModal';
import { useTheme } from '../../../context/ThemeContext';
import confetti from 'canvas-confetti';

export const DitlPortalSelector: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Toate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePortalForForm, setActivePortalForForm] = useState<DitlPortalInfo | null>(null);

  const regions = ['Toate', 'București', 'Transilvania', 'Banat', 'Moldova', 'Dobrogea', 'Oltenia', 'Crișana'];

  const filteredPortals = DITL_PORTALS.filter((p) => {
    const matchesRegion = selectedRegion === 'Toate' || p.region === selectedRegion;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleOpenModalWithPortal = (portal?: DitlPortalInfo) => {
    if (portal) setActivePortalForForm(portal);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Hero Card */}
      <div className="app-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {isDark && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0058FF]/10 rounded-bl-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col gap-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#0058FF]/20 text-[#38BDF8] border border-[#38BDF8]/30' : 'bg-[#0058FF]/10 text-[#0058FF]'
            }`}>
              D.I.T.L. & PRIMĂRII LOCALE
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              0 LEI • Emis în 24–48h
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">
            Certificat de Atestare Fiscală Online (DITL)
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-muted)] leading-relaxed">
            Necesar la vânzarea imobilelor, autoturismelor, credite ipotecare și succesiuni. Găsește portalul electronic al primăriei tale sau generează cererea oficială tip (Model ITL-012) în PDF.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto z-10 flex-shrink-0">
          <button
            onClick={() => handleOpenModalWithPortal()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 bg-[#0058FF] hover:bg-[#0047D4]"
          >
            <FileDown className="w-4 h-4" />
            <span>Generează Cererea Tip (PDF ITL-012)</span>
          </button>

          <a
            href="https://www.ghiseul.ro/ghiseul/public/amenzi"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
              isDark 
                ? 'bg-[#131620] border-white/[0.1] text-white hover:border-[#38BDF8]/40' 
                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
            }`}
          >
            <span>Verifică Debite pe Ghișeul.ro</span>
            <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
          </a>
        </div>
      </div>

      {/* CRITICAL DEBITS WARNING BANNER */}
      <DebitsWarningBanner />

      {/* PORTAL SEARCH & DIRECTORY */}
      <div className="app-panel p-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-inherit pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0058FF]" />
              Directoriu Portaluri Fiscale Locale (București & Municipii)
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Selectează orașul sau sectorul pentru a accesa direct ghișeul electronic securizat
            </p>
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Caută sector sau oraș..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 rounded-full text-xs font-medium border ${
                isDark ? 'bg-[#131620] border-white/[0.1] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Region filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#0058FF] text-white'
                  : isDark
                    ? 'bg-[#131620] border border-white/[0.08] text-[var(--text-muted)] hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Grid of Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPortals.map((portal) => (
            <div
              key={portal.id}
              className={`p-5 rounded-[18px] border flex flex-col justify-between gap-4 transition-all ${
                isDark 
                  ? 'bg-[#131620] border-white/[0.05] hover:border-[#38BDF8]/40' 
                  : 'bg-white border-gray-200 hover:border-[#0058FF]/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isDark ? 'bg-white/[0.06] text-[#38BDF8]' : 'bg-blue-50 text-[#0058FF]'
                  }`}>
                    {portal.region}
                  </span>
                  <span className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    {portal.onlineProcessingHours}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[var(--text-main)] leading-snug">
                  {portal.name}
                </h4>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {portal.notes}
                </p>

                <div className="flex flex-wrap gap-1 mt-1">
                  {portal.requiredDocuments.map((doc, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/[0.04] text-[var(--text-muted)]">
                      • {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-inherit">
                <a
                  href={portal.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => confetti({ particleCount: 30, spread: 40 })}
                  className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold text-white bg-[#0058FF] hover:bg-[#0047D4] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-98 text-center"
                >
                  <span>Portal Oficial DITL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenModalWithPortal(portal)}
                  title="Generează cerere PDF tipizată pentru acest sector"
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1] text-white hover:bg-white/[0.1]' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileDown className="w-4 h-4 text-[#38BDF8]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for Fiscal PDF Form */}
      <FiscalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCity={activePortalForForm ? activePortalForForm.name.split('(')[0].trim() : 'Sector 1'}
        defaultRegion={activePortalForForm ? activePortalForForm.region : 'București'}
      />

    </div>
  );
};
