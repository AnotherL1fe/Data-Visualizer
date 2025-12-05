import React from 'react';
import useDataStore from '../../store/dataStore';
import './ToggleView.css';

const ToggleView = () => {
  const { viewMode, setViewMode } = useDataStore();
  
  return (
    <div className="toggle-view">
      <button
        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
        onClick={() => setViewMode('list')}
        title="List View"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <circle cx="3" cy="6" r="2"></circle>
          <circle cx="3" cy="12" r="2"></circle>
          <circle cx="3" cy="18" r="2"></circle>
        </svg>
      </button>
      <button
        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
        onClick={() => setViewMode('grid')}
        title="Grid View"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
        </svg>
      </button>
    </div>
  );
};

export default ToggleView;