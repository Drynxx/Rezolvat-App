import React from 'react';
import { Scale, Car, FileText, Compass, Plus } from 'lucide-react';
import { AppTab } from '../types';

interface BottomTabBarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onQuickScan: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  setActiveTab,
  onQuickScan,
}) => {
  return (
    <nav className="rev-bottom-bar">
      
      {/* 1. Amenzi (AmendaGuard) */}
      <button
        onClick={() => setActiveTab('amendaguard')}
        className={`rev-tab-item ${activeTab === 'amendaguard' ? 'active' : ''}`}
      >
        <Scale size={20} strokeWidth={activeTab === 'amendaguard' ? 2.2 : 1.8} />
        <span>Amenzi</span>
      </button>

      {/* 2. AutoDox */}
      <button
        onClick={() => setActiveTab('autodox')}
        className={`rev-tab-item ${activeTab === 'autodox' ? 'active' : ''}`}
      >
        <Car size={20} strokeWidth={activeTab === 'autodox' ? 2.2 : 1.8} />
        <span>AutoDox</span>
      </button>

      {/* 3. Center Quick Scan Floating Action */}
      <button
        onClick={onQuickScan}
        className="rev-scan-float-btn"
        title="Scanează Document AI"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* 4. ANPC Express */}
      <button
        onClick={() => setActiveTab('anpc')}
        className={`rev-tab-item ${activeTab === 'anpc' ? 'active' : ''}`}
      >
        <FileText size={20} strokeWidth={activeTab === 'anpc' ? 2.2 : 1.8} />
        <span>ANPC</span>
      </button>

      {/* 5. Ghișeu */}
      <button
        onClick={() => setActiveTab('ghiseu')}
        className={`rev-tab-item ${activeTab === 'ghiseu' || activeTab === 'pricing' ? 'active' : ''}`}
      >
        <Compass size={20} strokeWidth={activeTab === 'ghiseu' || activeTab === 'pricing' ? 2.2 : 1.8} />
        <span>Ghișeu</span>
      </button>

    </nav>
  );
};
