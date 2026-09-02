import React from 'react';
import { Shield, HelpCircle, Bell } from 'lucide-react';

interface MobileHeaderProps {
  onOpenDisclaimer: () => void;
  unreadCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenDisclaimer, unreadCount = 1 }) => {
  return (
    <div style={{
      padding: '16px 20px 12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(9, 10, 15, 0.92)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      
      {/* Brand Emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Shield size={18} color="var(--accent-cyan)" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-pure)' }}>
              Birocrație<span style={{ color: 'var(--accent-cyan)' }}>Zero</span>
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', letterSpacing: '-0.01em' }}>Asistent Juridic & Documente</p>
        </div>
      </div>

      {/* Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenDisclaimer}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Aviz Legal & Conformitate"
        >
          <HelpCircle size={16} />
        </button>

        <button
          style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-cyan)'
            }} />
          )}
        </button>
      </div>

    </div>
  );
};
