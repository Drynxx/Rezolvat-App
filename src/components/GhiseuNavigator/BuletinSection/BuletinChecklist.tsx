import React, { useState } from 'react';
import { ChecklistDocItem } from '../../../types/ghiseu';
import { CheckCircle2, Circle, AlertTriangle, FileText, Check, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface BuletinChecklistProps {
  items: ChecklistDocItem[];
}

export const BuletinChecklist: React.FC<BuletinChecklistProps> = ({ items }) => {
  const { isDark } = useTheme();
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = items.filter((item) => checkedMap[item.id]).length;
  const isAllCompleted = items.length > 0 && completedCount === items.length;

  const renderBadge = (type: ChecklistDocItem['type']) => {
    switch (type) {
      case 'original':
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-800'
          }`}>
            ORIGINAL OBLIGATORIU
          </span>
        );
      case 'copie':
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isDark ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-100 text-sky-800'
          }`}>
            COPIE XEROX
          </span>
        );
      case 'original_si_copie':
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-800'
          }`}>
            ORIGINAL + COPIE
          </span>
        );
      case 'chitanta':
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800'
          }`}>
            CHITANȚĂ 7 RON
          </span>
        );
      case 'prezenta':
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isDark ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-rose-100 text-rose-800'
          }`}>
            PREZENȚĂ FIZICĂ GHIȘEU
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm md:text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <span>Dosarul Tău Fizic Pentru Ghișeu</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              isAllCompleted 
                ? 'bg-[#10B981]/20 text-[#34D399]' 
                : isDark ? 'bg-white/[0.06] text-[var(--text-muted)]' : 'bg-gray-100 text-gray-700'
            }`}>
              {completedCount} din {items.length} pregătite
            </span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Bifează actele pe măsură ce le pui în dosar. Niciun funcționar nu te va trimite acasă!
          </p>
        </div>

        {/* Progress bar pill */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-28 h-2 rounded-full bg-gray-200 dark:bg-white/[0.1] overflow-hidden">
            <div 
              className="h-full bg-[#0058FF] transition-all duration-300 rounded-full"
              style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)]">
            {items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isChecked = !!checkedMap[item.id];

          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
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
                      isChecked 
                        ? 'line-through text-[var(--text-muted)]' 
                        : 'text-[var(--text-main)]'
                    }`}>
                      {item.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {item.description}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {renderBadge(item.type)}
                </div>
              </div>

              {/* Critical warning banner if any */}
              {item.criticalNotice && (
                <div className={`mt-1 p-2.5 rounded-[10px] text-xs flex items-start gap-2 ${
                  isDark 
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' 
                    : 'bg-amber-50 border border-amber-200 text-amber-900'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
                  <span className="leading-tight font-medium">
                    {item.criticalNotice}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
