import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PricingModule = () => {
  const plans = [
    {
      name: 'AmendaGuard Single',
      price: '49',
      period: 'dosar',
      desc: 'Contestație unică de amendă de circulație sau parcare.',
      features: [
        'Scanare AI proces-verbal',
        'Verificare 14 motive O.G. 2/2001',
        'Generare Plângere Judecătorie PDF',
        'Ghid timbru 20 RON Ghișeul.ro'
      ],
      isPopular: true
    },
    {
      name: 'Auto',
      price: '39',
      period: 'tranzacție',
      desc: 'Setul de 5 exemplare ITL 054 + Cerere DGPCI.',
      features: [
        '5 exemplare identice oficiale',
        'Declarație fiscală DITL',
        'Roadmap primărie -> poliție',
        'Economisești 200 RON'
      ],
      isPopular: false
    },
    {
      name: 'Shield Pro Anual',
      price: '99',
      period: 'an',
      desc: 'Protecție continuă pentru șoferi și navetiști.',
      features: [
        'Amenzi nelimitate anulate',
        'Toate pachetele auto incluse',
        'Alerte ITP, RCA & Rovinietă',
        'Asistență prioritară'
      ],
      isPopular: false
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '0 16px' }}>

      <div className="rev-card" style={{ textAlign: 'center' }}>
        <span className="rev-badge rev-badge-cyan" style={{ marginBottom: '8px' }}>Fără Costuri Ascunse</span>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-pure)', marginBottom: '4px' }}>Tarife Transparente</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Plătești doar când generezi un document oficial.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {plans.map((p, idx) => (
          <div
            key={idx}
            className="rev-card"
            style={{
              borderColor: p.isPopular ? 'var(--border-active)' : 'var(--border-subtle)',
              background: p.isPopular ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-pure)' }}>{p.name}</span>
              {p.isPopular && <span className="rev-badge rev-badge-cyan">POPULAR</span>}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{p.desc}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)' }}>
                {p.price}
              </span>
              <span style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>RON</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>/ {p.period}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
              {p.features.map((f, fIdx) => (
                <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Check size={13} color="var(--accent-cyan)" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                confetti({ particleCount: 50, spread: 50 });
                alert(`Ați selectat ${p.name}. Integrarea plății este activă.`);
              }}
              className={p.isPopular ? 'btn-rev-primary' : 'btn-rev-primary'}
              style={{
                padding: '9px',
                fontSize: '0.85rem',
                background: p.isPopular ? '#FFFFFF' : 'var(--bg-surface-hover)',
                color: p.isPopular ? '#090A0F' : 'var(--text-primary)',
                border: p.isPopular ? 'none' : '1px solid var(--border-medium)'
              }}
            >
              Selectează {p.name}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
