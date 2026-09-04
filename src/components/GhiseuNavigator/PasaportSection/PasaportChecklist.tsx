import React, { useState } from 'react';
import { PasaportAgeGroup } from '../../../types/ghiseu';
import { Check, AlertTriangle, Camera, CheckCircle2, FileText, Info } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PasaportChecklistProps {
  selectedGroup: PasaportAgeGroup;
}

export const PasaportChecklist: React.FC<PasaportChecklistProps> = ({ selectedGroup }) => {
  const { isDark } = useTheme();
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedIds(p => ({ ...p, [id]: !p[id] }));
  };

  const isMinor = selectedGroup === 'sub_12' || selectedGroup === '12_18';

  const items = [
    {
      id: 'ci_solicitant',
      title: isMinor 
        ? (selectedGroup === 'sub_12' ? 'Certificatul de naștere al minorului (Original)' : 'Cartea de identitate a minorului (Original)')
        : 'Cartea de identitate / Buletinul de identitate valabil (Original)',
      desc: isMinor && selectedGroup === 'sub_12'
        ? 'Pentru copiii sub 14 ani este obligatoriu certificatul de naștere în original.'
        : 'Actul de identitate al titularului, aflat în termen de valabilitate.',
      badge: 'ORIGINAL OBLIGATORIU',
      critical: false,
    },
    {
      id: 'dovada_taxa',
      title: 'Dovada achitării taxei de pașaport (Chitanță Ghișeul.ro / Trezorerie)',
      desc: 'Chitanța PDF descărcată de pe Ghișeul.ro (pe telefon sau printată) ori recipisa de la Trezorerie / CEC.',
      badge: 'DOVADĂ PLATĂ',
      critical: false,
    },
    {
      id: 'pasaport_anterior',
      title: 'Pașaportul anterior (dacă există)',
      desc: 'Dacă mai deții un pașaport vechi, chiar dacă este expirat, trebuie predat la ghișeu pentru anulare.',
      badge: 'DACĂ E CAZUL',
      critical: false,
    },
  ];

  if (isMinor) {
    items.push({
      id: 'prezenta_parinti',
      title: 'Prezența FIZICĂ a ambilor părinți cu cărțile de identitate (sau procură notarială)',
      desc: 'Dacă un părinte nu poate veni, este necesară procura specială autentificată la notar sau hotărârea judecătorească definitivă de exercitare a autorității părintești exclusive.',
      badge: 'CRITIC PENTRU MINORI',
      critical: true,
    });

    items.push({
      id: 'prezenta_minor',
      title: 'Prezența fizică a copilului la ghișeu',
      desc: 'Copilul trebuie să fie prezent la ghișeu pentru preluarea imaginii faciale (și amprentelor dacă are peste 12 ani).',
      badge: 'PREZENȚĂ OBLIGATORIE',
      critical: true,
    });
  }

  if (selectedGroup === 'temporar') {
    items.push({
      id: 'acte_urgenta',
      title: 'Documente oficiale justificative ale urgenței obiective',
      desc: 'Pașaportul temporar se eliberează DOAR cu acte doveditoare: urgență medicală în străinătate, deces în familie sau motive de serviciu neamânabile.',
      badge: 'URGENȚĂ DOVEDITĂ',
      critical: true,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm md:text-base font-bold text-[var(--text-main)]">
            Acte Necesare la Ghișeul de Pașapoarte
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Dosarul se prezintă la ora programării rezervate online.
          </p>
        </div>

        {/* Free Photo Notice */}
        <div className={`p-2 px-3 rounded-[12px] border flex items-center gap-2 text-xs font-semibold ${
          isDark ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <Camera className="w-4 h-4" />
          <span>Fotografia se face gratuit la ghișeu!</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((it) => {
          const isChecked = !!checkedIds[it.id];

          return (
            <div
              key={it.id}
              onClick={() => toggleCheck(it.id)}
              className={`p-4 rounded-[16px] border transition-all cursor-pointer select-none flex flex-col gap-2 ${
                isChecked
                  ? isDark 
                    ? 'bg-[#10B981]/10 border-[#10B981]/30 opacity-80' 
                    : 'bg-emerald-50/70 border-emerald-200'
                  : isDark 
                    ? 'bg-[#131620] border-white/[0.06] hover:border-white/[0.15]' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-[#0058FF] text-white'
                        : isDark
                          ? 'border border-white/[0.2] hover:border-white/[0.4]'
                          : 'border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>

                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold leading-snug ${
                      isChecked ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'
                    }`}>
                      {it.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {it.desc}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                  it.critical
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : isDark ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-100 text-sky-800'
                }`}>
                  {it.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice about photo */}
      <div className={`p-3 rounded-[12px] text-xs flex items-start gap-2 ${
        isDark ? 'bg-white/[0.04] text-[var(--text-muted)]' : 'bg-gray-50 text-gray-600 border border-gray-200'
      }`}>
        <Info className="w-4 h-4 flex-shrink-0 text-[#0058FF] mt-0.5" />
        <span>
          <strong>Nu cheltui bani la ateliere foto!</strong> Fotografia biometrică se capturează pe loc, direct în cabina digitală a serviciului de pașapoarte, fără niciun cost suplimentar.
        </span>
      </div>
    </div>
  );
};
