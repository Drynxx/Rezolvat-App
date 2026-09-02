import React from 'react';
import { TrendingUp, Clock, Scale, Sparkles } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <Scale size={24} color="#818CF8" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>
            2.7M+
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Amenzi emise anual în RO
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <TrendingUp size={24} color="#34D399" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#34D399' }}>
            84.2%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Succes pe vicii O.G. 2/2001
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <Clock size={24} color="#FBBF24" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>
            &lt; 60 sec
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Scanare AI & Generare Dosar
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <Sparkles size={24} color="#C084FC" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>
            49 RON
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Economisești 500+ RON la avocat
          </div>
        </div>
      </div>

    </div>
  );
};
