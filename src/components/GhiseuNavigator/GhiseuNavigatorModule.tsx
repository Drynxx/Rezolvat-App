import React, { useState } from 'react';
import { 
  BadgeCheck, 
  FileText, 
  Building, 
  Building2, 
  Clock, 
  CreditCard, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { GhiseuServiceId } from '../../types/ghiseu';
import { GhiseuHeader } from './common/GhiseuHeader';
import { BuletinWizard } from './BuletinSection/BuletinWizard';
import { CazierGuide } from './CazierSection/CazierGuide';
import { PasaportCalculator } from './PasaportSection/PasaportCalculator';
import { DitlPortalSelector } from './CertificatFiscalSection/DitlPortalSelector';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';

export const GhiseuNavigatorModule: React.FC = () => {
  const { isDark } = useTheme();
  const [activeService, setActiveService] = useState<GhiseuServiceId>('buletin');

  const services = [
    {
      id: 'buletin' as GhiseuServiceId,
      title: 'Buletin Expirat & Domiciliu',
      authority: 'Evidența Populației (SPCLEP)',
      tag: '7 RON • Ghiseul.ro',
      badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      desc: 'Configurator 3 tap-uri (proprietar vs chiriaș vs gazdă), checklist acte originale & copii, cerere oficială PDF.',
      icon: BadgeCheck,
    },
    {
      id: 'cazier' as GhiseuServiceId,
      title: 'Cazier Judiciar Online',
      authority: 'HUB MAI & Ghișeul.ro',
      tag: '0 LEI • 5 MINUTE',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      desc: 'Ghid pas cu pas fără drum la secția de poliție. Descărcare PDF semnat electronic conform eIDAS.',
      icon: FileText,
    },
    {
      id: 'pasaport' as GhiseuServiceId,
      title: 'Programare Pașaport Online',
      authority: 'Direcția Generală de Pașapoarte',
      tag: 'Calculator Taxe Consulară',
      badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      desc: 'Calculator automat 234 / 258 / 96 RON, deep-link oficial epasapoarte.ro fără comisioane de intermediari.',
      icon: Building,
    },
    {
      id: 'fiscal' as GhiseuServiceId,
      title: 'Certificat de Atestare Fiscală',
      authority: 'D.I.T.L. / Primării Locale',
      tag: '24–48h • Directoriu',
      badgeColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      desc: 'Directoriu online Sectoare 1-6 & municipii, avertisment amenzi neplătite, cerere tip PDF ITL-012.',
      icon: Building2,
    },
  ];

  const handleSelectService = (id: GhiseuServiceId) => {
    setActiveService(id);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 1. Header Section */}
      <GhiseuHeader />

      {/* 2. Top Bento Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((srv) => {
          const Icon = srv.icon;
          const isSelected = activeService === srv.id;

          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => handleSelectService(srv.id)}
              className={`p-4 rounded-[20px] text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? isDark 
                    ? 'bg-[#0058FF]/20 border-[#38BDF8] shadow-[0_0_15px_rgba(0,88,255,0.25)]' 
                    : 'bg-[#0058FF]/10 border-[#0058FF] shadow-sm'
                  : isDark
                    ? 'bg-[#131620] border-white/[0.06] hover:border-white/[0.15]'
                    : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-[14px] flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#0058FF] text-white'
                      : isDark ? 'bg-white/[0.08] text-[var(--text-muted)]' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${srv.badgeColor}`}>
                    {srv.tag}
                  </span>
                </div>

                <div>
                  <h3 className={`text-sm font-bold leading-tight ${
                    isSelected ? (isDark ? 'text-[#38BDF8]' : 'text-[#0058FF]') : 'text-[var(--text-main)]'
                  }`}>
                    {srv.title}
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                    {srv.authority}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {srv.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. Active Service Workspace */}
      <div className="w-full">
        {activeService === 'buletin' && <BuletinWizard />}
        {activeService === 'cazier' && <CazierGuide />}
        {activeService === 'pasaport' && <PasaportCalculator />}
        {activeService === 'fiscal' && <DitlPortalSelector />}
      </div>

    </div>
  );
};
