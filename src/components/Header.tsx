import React from 'react';
import { Shield, Scale, Car, FileText, Compass, AlertCircle } from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenDisclaimer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDisclaimer,
}) => {
  return (
    <header className="glass-panel" style={{ margin: '1rem 0 1.5rem 0', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        {/* Logo Brand */}
        <div
          onClick={() => setActiveTab('amendaguard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(99, 102, 241, 0.4)'
          }}>
            <Shield size={22} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                REZOLVAT
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>RO v1.0</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1 }}>Asistent Juridic & Dosare Digitale</p>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('amendaguard')}
            className={`btn ${activeTab === 'amendaguard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
          >
            <Scale size={16} />
            <span>AmendaGuard</span>
          </button>

          <button
            onClick={() => setActiveTab('autodox')}
            className={`btn ${activeTab === 'autodox' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
          >
            <Car size={16} />
            <span>AutoDox (5x)</span>
          </button>

          <button
            onClick={() => setActiveTab('anpc')}
            className={`btn ${activeTab === 'anpc' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
          >
            <FileText size={16} />
            <span>ANPC Express</span>
          </button>

          <button
            onClick={() => setActiveTab('ghiseu')}
            className={`btn ${activeTab === 'ghiseu' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
          >
            <Compass size={16} />
            <span>GhișeuNav</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`btn ${activeTab === 'pricing' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem', padding: '0.55rem 0.9rem' }}
          >
            Tarife
          </button>
        </nav>

        {/* Legal Disclaimer & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenDisclaimer}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem', gap: '0.35rem', color: 'var(--text-secondary)' }}
            title="Conformitate Legea 51/1995 & CAEN"
          >
            <AlertCircle size={14} color="#94A3B8" />
            <span>Aviz Legal</span>
          </button>
        </div>

      </div>
    </header>
  );
};
