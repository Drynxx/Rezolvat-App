import React, { useState } from 'react';
import { AutoDoxEditorModal } from './AutoDoxEditorModal';
import { useTheme } from '../../context/ThemeContext';

interface AutoDoxModuleProps {
  openEditorTrigger?: number;
}

// ─── Minimal macOS-style icon primitives ────────────────────────────────────
const IconScan = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="11" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="1" y="11" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <path d="M11 11h4v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 1v14M1 7h14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
  </svg>
);

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M10.586 1.586a2 2 0 112.828 2.828L5 12.828H2V9.828L10.586 1.586Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Viză DITL Vânzător', sub: 'Cartuș A & B — Scoatere evidență fiscală' },
  { num: '02', title: 'Viză DITL Cumpărător', sub: 'Cartuș C & D — Înregistrare 30 zile' },
  { num: '03', title: 'Taxă Talon', sub: '49 RON — Ghișeul.ro / DGPCI' },
  { num: '04', title: 'Ghișeu DGPCI', sub: 'Depunere dosar plăcuțe & talon (90 zile)' },
];

const EXEMPLARE = [
  { label: 'Exemplar 1 — Original', dest: 'Cumpărător' },
  { label: 'Exemplar 2', dest: 'DITL Vânzător' },
  { label: 'Exemplar 3', dest: 'DITL Cumpărător' },
  { label: 'Exemplar 4', dest: 'DGPCI Înmatriculări' },
  { label: 'Exemplar 5', dest: 'Vânzător' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export const AutoDoxModule: React.FC<AutoDoxModuleProps> = ({ openEditorTrigger }) => {
  const { isDark } = useTheme();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (openEditorTrigger && openEditorTrigger > 0) {
      setIsEditorOpen(true);
    }
  }, [openEditorTrigger]);

  // ── Palette tokens (macOS HIG / Fintech minimal) ──
  const surface = isDark
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(0,0,0,0.02)';
  const surfaceElevated = isDark
    ? 'rgba(255,255,255,0.05)'
    : '#FFFFFF';
  const border = isDark
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(0,0,0,0.07)';
  const borderStrong = isDark
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(0,0,0,0.13)';
  const textPrimary = isDark ? '#F5F5F7' : '#1D1D1F';
  const textSecondary = isDark ? '#98989D' : '#6E6E73';
  const textTertiary = isDark ? '#636366' : '#AEAEB2';
  const accent = '#0058FF';
  const accentGlow = isDark ? '0 0 20px rgba(0,88,255,0.35)' : '0 4px 14px rgba(0,88,255,0.22)';
  const emerald = isDark ? '#30D158' : '#28A745';
  const shadow = isDark
    ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px rgba(0,0,0,0.4)'
    : '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';

  return (
    <div className="w-full flex flex-col" style={{ gap: '12px', maxWidth: '860px', margin: '0 auto', paddingBottom: '8px' }}>

      {/* ── ROW 1: Hero card + Steps ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '12px' }}>

        {/* ── Hero Pricing Card ──────────────────────────────────────── */}
        <div style={{
          background: isDark
            ? 'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F7 100%)',
          border: `1px solid ${borderStrong}`,
          borderRadius: '20px',
          padding: '22px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          boxShadow: shadow,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ambient glow top-right */}
          {isDark && (
            <div style={{
              position: 'absolute', top: '-24px', right: '-24px',
              width: '120px', height: '120px',
              background: 'radial-gradient(circle, rgba(0,88,255,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Label row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: textSecondary,
            }}>Contract Auto</span>
            <span style={{
              fontSize: '10px', fontWeight: 600, color: emerald,
              background: isDark ? 'rgba(48,209,88,0.1)' : 'rgba(40,167,69,0.08)',
              border: `1px solid ${isDark ? 'rgba(48,209,88,0.2)' : 'rgba(40,167,69,0.2)'}`,
              borderRadius: '6px', padding: '2px 8px',
            }}>ITL 054 · 2026</span>
          </div>

          {/* Price hero */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="text-[44px] md:text-[52px]" style={{
                fontWeight: 800, lineHeight: 1,
                letterSpacing: '-0.04em', color: textPrimary,
                fontVariantNumeric: 'tabular-nums',
              }}>39</span>
              <span style={{ fontSize: '18px', fontWeight: 600, color: accent, letterSpacing: '-0.01em', marginBottom: '4px' }}>RON</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: textSecondary, marginBottom: '22px', lineHeight: 1.4 }}>
            Dosar complet · 5 exemplare oficiale
          </p>

          {/* Feature list — sparse, macOS-style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
            {[
              '5 exemplare identice Model 2026',
              '100% acceptat DITL & DGPCI',
              'Scanare AI Gemini Flash',
              'Offline — date locale în browser',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: isDark ? 'rgba(48,209,88,0.12)' : 'rgba(40,167,69,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: emerald, flexShrink: 0,
                }}>
                  <IconCheck />
                </div>
                <span style={{ fontSize: '13px', color: textPrimary, fontWeight: 450 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div style={{ height: '1px', background: border, marginBottom: '20px' }} />

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setIsEditorOpen(true)}
              style={{
                width: '100%',
                background: accent,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '13px 20px',
                fontSize: '14px',
                fontWeight: 650,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: accentGlow,
                transition: 'opacity 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.985)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <IconScan />
              <span>Scanează cu AI</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              style={{
                width: '100%',
                background: surfaceElevated,
                color: textPrimary,
                border: `1px solid ${border}`,
                borderRadius: '12px',
                padding: '11px 20px',
                fontSize: '13px',
                fontWeight: 550,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <IconEdit />
              <span>Formular manual</span>
            </button>
          </div>
        </div>

        {/* ── 4-Step Timeline ───────────────────────────────────────── */}
        <div style={{
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.03)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 650, color: textPrimary, letterSpacing: '-0.01em' }}>
              Procedură pas cu pas
            </span>
            <span style={{ fontSize: '11px', color: textTertiary, fontWeight: 500 }}>4 pași</span>
          </div>

          {/* Steps with connector lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {STEPS.map((step, idx) => (
              <div key={step.num}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '10px 0',
                }}>
                  {/* Step indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isDark ? 'rgba(0,88,255,0.15)' : 'rgba(0,88,255,0.08)',
                      border: `1px solid rgba(0,88,255,0.25)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 700, color: accent,
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
                    }}>
                      {step.num}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div style={{
                        width: '1px', height: '20px',
                        background: `linear-gradient(to bottom, rgba(0,88,255,0.2), transparent)`,
                        marginTop: '2px',
                      }} />
                    )}
                  </div>
                  {/* Step content */}
                  <div style={{ paddingTop: '4px', flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '11px', color: textTertiary, marginTop: '2px', lineHeight: 1.4 }}>
                      {step.sub}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Exemplare list ─────────────────────────────────────── */}
      <div style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.03)',
      }}>
        {/* Card header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${border}`,
        }}>
          <span style={{ fontSize: '13px', fontWeight: 650, color: textPrimary, letterSpacing: '-0.01em' }}>
            Cele 5 exemplare
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600, color: emerald,
            background: isDark ? 'rgba(48,209,88,0.1)' : 'rgba(40,167,69,0.08)',
            border: `1px solid ${isDark ? 'rgba(48,209,88,0.2)' : 'rgba(40,167,69,0.2)'}`,
            borderRadius: '6px', padding: '2px 8px',
          }}>Model ITL 054</span>
        </div>

        {/* Table-like exemplare rows */}
        {EXEMPLARE.map((ex, idx) => (
          <div
            key={ex.label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 16px',
              borderBottom: idx < EXEMPLARE.length - 1 ? `1px solid ${border}` : 'none',
              transition: 'background 0.12s',
              cursor: 'default',
              gap: '8px',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px',
                background: isDark ? 'rgba(48,209,88,0.12)' : 'rgba(40,167,69,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: emerald, flexShrink: 0,
              }}>
                <IconCheck />
              </div>
              <span style={{ fontSize: '13px', color: textPrimary, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ex.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', color: textTertiary, fontWeight: 450, whiteSpace: 'nowrap' }}>{ex.dest}</span>
              <span style={{ color: textTertiary, opacity: 0.5, display: 'flex' }}>
                <IconChevron />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── AutoDox Editor Modal ──────────────────────────────────────── */}
      <AutoDoxEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};
