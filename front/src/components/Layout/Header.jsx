import React from 'react';
import { Link } from 'react-router-dom';
import ToggleView from '../UI/ToggleView';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <h1>📊 Data Visualizer</h1>
          </Link>
        </div>
        <div className="header-controls">
          <ToggleView />
          <Link to="/add-post" className="add-post-btn">
            📝 Добавить пост
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;