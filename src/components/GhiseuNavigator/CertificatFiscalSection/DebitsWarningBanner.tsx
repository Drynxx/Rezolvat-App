import React from 'react';
import { AlertTriangle, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface DebitsWarningBannerProps {
  onCheckFines?: () => void;
}

export const DebitsWarningBanner: React.FC<DebitsWarningBannerProps> = ({ onCheckFines }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-[20px] border flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
      isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-950'
    }`}>
      <div className="flex items-start gap-4 max-w-2xl">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <h4 className="font-bold text-sm text-amber-500 flex items-center gap-1.5">
            Capcană Majoră: Ai Amenzi de Circulație sau Impozite Neachitate?
          </h4>
          <p className="leading-relaxed opacity-95">
            Conform <em>art. 158–159 din Codul de procedură fiscală</em>, dacă ai chiar și o singură amendă rutieră neplătită (ex: 150 RON pentru viteză sau parcare), D.I.T.L. îți va elibera certificatul fiscal <strong>„CU DATORII”</strong>.
          </p>
          <p className="leading-relaxed font-semibold opacity-90 text-[11px]">
            ⚠️ Notarul va REFUGE autentificarea vânzării apartamentului sau mașinii, iar banca va BLOCA aprobarea creditului ipotecar până la stingerea integrală a debitului!
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto flex-shrink-0">
        <a
          href="https://www.ghiseul.ro/ghiseul/public/amenzi"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-98"
        >
          <span>Verifică & Achită pe Ghișeul.ro</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
